// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CopyVault - Isolated vault for each follower
/// @notice Each follower gets their own vault, enabling parallel execution on Monad
contract CopyVault {
    // --- State ---
    address public owner;
    address public leader;
    address public router;
    uint256 public depositedAmount;
    bool public isActive;
    uint256 public maxSlippage; // in basis points (50 = 0.5%)
    uint256 public stopLossPercentage; // in basis points

    // --- Events ---
    event Deposited(address indexed owner, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event TradeExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event VaultPaused(address indexed owner);
    event VaultUnpaused(address indexed owner);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "CopyVault: not owner");
        _;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "CopyVault: not router");
        _;
    }

    modifier whenActive() {
        require(isActive, "CopyVault: vault is paused");
        _;
    }

    // --- Constructor ---
    constructor(
        address _owner,
        address _leader,
        address _router,
        uint256 _maxSlippage
    ) {
        owner = _owner;
        leader = _leader;
        router = _router;
        maxSlippage = _maxSlippage;
        isActive = true;
    }

    // --- External Functions ---

    /// @notice Deposit native MON into the vault
    function deposit() external payable onlyOwner {
        require(msg.value > 0, "CopyVault: zero deposit");
        depositedAmount += msg.value;
        emit Deposited(owner, msg.value);
    }

    /// @notice Withdraw MON from the vault
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "CopyVault: insufficient balance");
        depositedAmount = depositedAmount > amount ? depositedAmount - amount : 0;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "CopyVault: transfer failed");
        emit Withdrawn(owner, amount);
    }

    /// @notice Execute a trade - only callable by the router when vault is active
    /// @dev In production, this would call a DEX router (Kuru, Perpl, etc.)
    function executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyRouter whenActive {
        require(amountIn <= address(this).balance, "CopyVault: insufficient balance");

        // In MVP, we simulate the trade by emitting the event
        // Production would integrate with actual DEX contracts
        uint256 amountOut = amountIn; // Placeholder: 1:1 swap simulation

        emit TradeExecuted(tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @notice Update max slippage tolerance
    function setMaxSlippage(uint256 _slippage) external onlyOwner {
        require(_slippage <= 1000, "CopyVault: slippage too high"); // max 10%
        maxSlippage = _slippage;
    }

    /// @notice Update stop loss percentage
    function setStopLoss(uint256 _stopLoss) external onlyOwner {
        stopLossPercentage = _stopLoss;
    }

    /// @notice Pause the vault - stops copying trades
    function pause() external onlyOwner {
        isActive = false;
        emit VaultPaused(owner);
    }

    /// @notice Unpause the vault - resume copying trades
    function unpause() external onlyOwner {
        isActive = true;
        emit VaultUnpaused(owner);
    }

    /// @notice Get all vault information
    function getVaultInfo()
        external
        view
        returns (
            address _owner,
            address _leader,
            uint256 _deposited,
            bool _isActive,
            uint256 _maxSlippage,
            uint256 _stopLoss,
            uint256 _balance
        )
    {
        return (
            owner,
            leader,
            depositedAmount,
            isActive,
            maxSlippage,
            stopLossPercentage,
            address(this).balance
        );
    }

    /// @notice Allow vault to receive MON
    receive() external payable {}
}
