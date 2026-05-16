// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CopyVault.sol";
import "./TradeRouter.sol";

/// @title TradeWatchFactory - Deploys isolated vaults for followers
/// @notice Low gas on Monad makes per-user vault deployment economically viable
contract TradeWatchFactory {
    // --- State ---
    TradeRouter public router;
    address public admin;

    mapping(address => address[]) private userVaults;
    uint256 public totalVaults;

    // --- Events ---
    event VaultCreated(
        address indexed owner,
        address indexed leader,
        address vault
    );

    // --- Constructor ---
    constructor(address _router) {
        router = TradeRouter(_router);
        admin = msg.sender;
    }

    // --- Core Functions ---

    /// @notice Create a new isolated vault and start copying a leader
    /// @param leader The leader address to copy
    /// @param maxSlippage Max slippage in basis points (50 = 0.5%)
    function createVault(
        address leader,
        uint256 maxSlippage
    ) external payable returns (address) {
        require(msg.value > 0, "Factory: must deposit MON");

        // Deploy a new isolated vault for this follower
        CopyVault vault = new CopyVault(
            msg.sender,
            leader,
            address(router),
            maxSlippage
        );

        // Forward the deposit to the vault
        (bool success, ) = address(vault).call{value: msg.value}("");
        require(success, "Factory: deposit transfer failed");

        // Register with router
        router.registerVault(leader, address(vault));

        // Track user vaults
        userVaults[msg.sender].push(address(vault));
        totalVaults++;

        emit VaultCreated(msg.sender, leader, address(vault));
        return address(vault);
    }

    // --- View Functions ---

    /// @notice Get all vaults owned by a user
    function getVaultsForUser(address user) external view returns (address[] memory) {
        return userVaults[user];
    }

    /// @notice Get the total number of vaults deployed
    function getVaultCount() external view returns (uint256) {
        return totalVaults;
    }
}
