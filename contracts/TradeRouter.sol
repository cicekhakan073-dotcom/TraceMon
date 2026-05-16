// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CopyVault.sol";
import "./LeaderRegistry.sol";

/// @title TradeRouter - Distributes leader trades to all follower vaults
/// @notice When a leader executes a trade, the router fans it out to all linked vaults in parallel
contract TradeRouter {
    // --- State ---
    address public factory;
    address public admin;
    LeaderRegistry public leaderRegistry;

    mapping(address => address[]) private leaderToVaults;
    mapping(address => bool) public authorizedLeaders;

    // --- Events ---
    event VaultRegistered(address indexed leader, address indexed vault);
    event VaultRemoved(address indexed leader, address indexed vault);
    event MirrorTradeInitiated(
        address indexed leader,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 vaultCount
    );

    // --- Modifiers ---
    modifier onlyFactory() {
        require(msg.sender == factory, "TradeRouter: not factory");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "TradeRouter: not admin");
        _;
    }

    // --- Constructor ---
    constructor(address _leaderRegistry) {
        admin = msg.sender;
        leaderRegistry = LeaderRegistry(_leaderRegistry);
    }

    // --- Admin Functions ---

    /// @notice Set factory address (called once after factory deployment)
    function setFactory(address _factory) external onlyAdmin {
        require(factory == address(0), "TradeRouter: factory already set");
        factory = _factory;
    }

    /// @notice Authorize a leader to execute mirror trades
    function authorizeLeader(address leader) external onlyAdmin {
        require(
            leaderRegistry.isRegisteredLeader(leader),
            "TradeRouter: not registered leader"
        );
        authorizedLeaders[leader] = true;
    }

    // --- Core Functions ---

    /// @notice Register a new vault for a leader (called by factory)
    function registerVault(address leader, address vault) external onlyFactory {
        leaderToVaults[leader].push(vault);
        emit VaultRegistered(leader, vault);
    }

    /// @notice Remove a vault from a leader's list
    function removeVault(address leader, address vault) external {
        CopyVault v = CopyVault(payable(vault));
        require(
            msg.sender == v.owner() || msg.sender == admin,
            "TradeRouter: not authorized"
        );

        address[] storage vaults = leaderToVaults[leader];
        for (uint256 i = 0; i < vaults.length; i++) {
            if (vaults[i] == vault) {
                vaults[i] = vaults[vaults.length - 1];
                vaults.pop();
                emit VaultRemoved(leader, vault);
                return;
            }
        }
    }

    /// @notice Execute a mirror trade across all vaults following the leader
    /// @dev On Monad, each vault call hits a different storage slot = parallel execution
    function executeMirrorTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external {
        require(authorizedLeaders[msg.sender], "TradeRouter: not authorized leader");

        address[] storage vaults = leaderToVaults[msg.sender];
        uint256 len = vaults.length;

        emit MirrorTradeInitiated(msg.sender, tokenIn, tokenOut, amountIn, len);

        // Each vault is an isolated contract with separate storage
        // Monad executes these calls in parallel since there are no state conflicts
        for (uint256 i = 0; i < len; i++) {
            CopyVault vault = CopyVault(payable(vaults[i]));
            if (vault.isActive()) {
                // Scale amountIn proportionally to vault balance
                uint256 vaultBalance = address(vault).balance;
                uint256 scaledAmount = (vaultBalance * amountIn) / 1 ether;
                if (scaledAmount > 0 && scaledAmount <= vaultBalance) {
                    vault.executeTrade(tokenIn, tokenOut, scaledAmount, minAmountOut);
                }
            }
        }

        // Update leader stats
        leaderRegistry.updateStats(msg.sender, int256(amountIn), true);
    }

    // --- View Functions ---

    /// @notice Get all vaults following a leader
    function getVaultsForLeader(address leader) external view returns (address[] memory) {
        return leaderToVaults[leader];
    }

    /// @notice Get the number of vaults following a leader
    function getVaultCountForLeader(address leader) external view returns (uint256) {
        return leaderToVaults[leader].length;
    }
}
