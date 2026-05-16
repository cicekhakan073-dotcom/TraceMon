// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITradeRouter {
    /// @notice Execute a copy trade on a specific vault
    function executeCopyTrade(
        address vault,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external;

    /// @notice Emitted when a copy trade is executed on a vault
    event CopyTradeExecuted(
        address indexed vault,
        address indexed leader,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
}
