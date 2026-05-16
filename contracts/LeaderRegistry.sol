// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LeaderRegistry - On-chain leader profiles and performance tracking
/// @notice Stores leader stats that can be queried in real-time via MonadDb
contract LeaderRegistry {
    // --- Structs ---
    struct LeaderInfo {
        string name;
        uint256 performanceFee; // basis points (1000 = 10%)
        int256 totalPnL;
        uint256 totalTrades;
        uint256 winCount;
        uint256 followerCount;
        bool isActive;
        uint256 registeredAt;
    }

    // --- State ---
    address public admin;
    address public router;

    mapping(address => LeaderInfo) private leaders;
    address[] private leaderList;

    // --- Events ---
    event LeaderRegistered(address indexed leader, string name, uint256 performanceFee);
    event LeaderStatsUpdated(address indexed leader, int256 pnl, uint256 totalTrades);

    // --- Modifiers ---
    modifier onlyRouter() {
        require(msg.sender == router, "LeaderRegistry: not router");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "LeaderRegistry: not admin");
        _;
    }

    // --- Constructor ---
    constructor() {
        admin = msg.sender;
    }

    // --- Admin Functions ---

    /// @notice Set the router address (called once after router deployment)
    function setRouter(address _router) external onlyAdmin {
        router = _router;
    }

    // --- Core Functions ---

    /// @notice Register as a leader trader
    /// @param name Display name
    /// @param performanceFee Fee in basis points (max 2000 = 20%)
    function registerAsLeader(string calldata name, uint256 performanceFee) external {
        require(bytes(name).length > 0, "LeaderRegistry: empty name");
        require(performanceFee <= 2000, "LeaderRegistry: fee too high");
        require(!leaders[msg.sender].isActive, "LeaderRegistry: already registered");

        leaders[msg.sender] = LeaderInfo({
            name: name,
            performanceFee: performanceFee,
            totalPnL: 0,
            totalTrades: 0,
            winCount: 0,
            followerCount: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        leaderList.push(msg.sender);
        emit LeaderRegistered(msg.sender, name, performanceFee);
    }

    /// @notice Update leader stats after a trade (called by router)
    function updateStats(address leader, int256 pnl, bool isWin) external onlyRouter {
        LeaderInfo storage info = leaders[leader];
        require(info.isActive, "LeaderRegistry: not active leader");

        info.totalPnL += pnl;
        info.totalTrades++;
        if (isWin) {
            info.winCount++;
        }

        emit LeaderStatsUpdated(leader, info.totalPnL, info.totalTrades);
    }

    /// @notice Increment follower count (called by router on vault creation)
    function incrementFollowers(address leader) external onlyRouter {
        leaders[leader].followerCount++;
    }

    // --- View Functions ---

    /// @notice Get full leader info
    function getLeaderInfo(address leader)
        external
        view
        returns (LeaderInfo memory)
    {
        return leaders[leader];
    }

    /// @notice Get all registered leader addresses
    function getAllLeaders() external view returns (address[] memory) {
        return leaderList;
    }

    /// @notice Check if an address is a registered leader
    function isRegisteredLeader(address leader) external view returns (bool) {
        return leaders[leader].isActive;
    }

    /// @notice Get total number of leaders
    function getLeaderCount() external view returns (uint256) {
        return leaderList.length;
    }
}
