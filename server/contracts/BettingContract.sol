// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorldCupBetting is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _betIds;
    
    struct Bet {
        uint256 betId;
        address bettor;
        string gameId;
        string betType;
        string selection;
        uint256 amount;
        uint256 odds;
        bool isSettled;
        bool isWon;
        uint256 payout;
        uint256 timestamp;
    }
    
    struct Game {
        string gameId;
        string team1;
        string team2;
        uint256 startTime;
        bool isFinished;
        string winner;
        uint256 team1Score;
        uint256 team2Score;
    }
    
    mapping(uint256 => Bet) public bets;
    mapping(string => Game) public games;
    mapping(address => uint256[]) public userBets;
    mapping(address => uint256) public userBalances;
    
    uint256 public totalBets;
    uint256 public totalVolume;
    uint256 public houseEdge = 50; // 5% house edge (in basis points)
    
    event BetPlaced(uint256 betId, address bettor, string gameId, string betType, string selection, uint256 amount, uint256 odds);
    event BetSettled(uint256 betId, bool isWon, uint256 payout);
    event GameAdded(string gameId, string team1, string team2, uint256 startTime);
    event GameResultSet(string gameId, string winner, uint256 team1Score, uint256 team2Score);
    event Withdrawal(address user, uint256 amount);
    event Deposit(address user, uint256 amount);
    
    modifier onlyValidBet(uint256 betId) {
        require(bets[betId].bettor != address(0), "Bet does not exist");
        _;
    }
    
    modifier onlyUnsettledBet(uint256 betId) {
        require(!bets[betId].isSettled, "Bet already settled");
        _;
    }
    
    function placeBet(
        string memory gameId,
        string memory betType,
        string memory selection,
        uint256 odds
    ) external payable nonReentrant {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(games[gameId].startTime > block.timestamp, "Game has already started");
        require(odds > 100, "Invalid odds");
        
        _betIds.increment();
        uint256 betId = _betIds.current();
        
        bets[betId] = Bet({
            betId: betId,
            bettor: msg.sender,
            gameId: gameId,
            betType: betType,
            selection: selection,
            amount: msg.value,
            odds: odds,
            isSettled: false,
            isWon: false,
            payout: 0,
            timestamp: block.timestamp
        });
        
        userBets[msg.sender].push(betId);
        totalBets++;
        totalVolume += msg.value;
        
        emit BetPlaced(betId, msg.sender, gameId, betType, selection, msg.value, odds);
    }
    
    function addGame(
        string memory gameId,
        string memory team1,
        string memory team2,
        uint256 startTime
    ) external onlyOwner {
        require(games[gameId].startTime == 0, "Game already exists");
        
        games[gameId] = Game({
            gameId: gameId,
            team1: team1,
            team2: team2,
            startTime: startTime,
            isFinished: false,
            winner: "",
            team1Score: 0,
            team2Score: 0
        });
        
        emit GameAdded(gameId, team1, team2, startTime);
    }
    
    function setGameResult(
        string memory gameId,
        string memory winner,
        uint256 team1Score,
        uint256 team2Score
    ) external onlyOwner {
        require(games[gameId].startTime > 0, "Game does not exist");
        require(!games[gameId].isFinished, "Game result already set");
        
        games[gameId].isFinished = true;
        games[gameId].winner = winner;
        games[gameId].team1Score = team1Score;
        games[gameId].team2Score = team2Score;
        
        // Settle all bets for this game
        _settleGameBets(gameId);
        
        emit GameResultSet(gameId, winner, team1Score, team2Score);
    }
    
    function _settleGameBets(string memory gameId) internal {
        for (uint256 i = 1; i <= _betIds.current(); i++) {
            if (keccak256(bytes(bets[i].gameId)) == keccak256(bytes(gameId)) && !bets[i].isSettled) {
                _settleBet(i);
            }
        }
    }
    
    function _settleBet(uint256 betId) internal {
        Bet storage bet = bets[betId];
        Game storage game = games[bet.gameId];
        
        bool isWon = _checkBetResult(bet, game);
        uint256 payout = 0;
        
        if (isWon) {
            payout = (bet.amount * bet.odds) / 100;
            // Apply house edge
            payout = payout - (payout * houseEdge) / 1000;
            userBalances[bet.bettor] += payout;
        }
        
        bet.isSettled = true;
        bet.isWon = isWon;
        bet.payout = payout;
        
        emit BetSettled(betId, isWon, payout);
    }
    
    function _checkBetResult(Bet memory bet, Game memory game) internal pure returns (bool) {
        if (keccak256(bytes(bet.betType)) == keccak256(bytes("moneyline"))) {
            if (keccak256(bytes(bet.selection)) == keccak256(bytes("Draw"))) {
                return keccak256(bytes(game.winner)) == keccak256(bytes("Draw"));
            } else {
                return keccak256(bytes(bet.selection)) == keccak256(bytes(game.winner));
            }
        } else if (keccak256(bytes(bet.betType)) == keccak256(bytes("spread"))) {
            // Simplified spread logic - in real implementation would be more complex
            return keccak256(bytes(bet.selection)) == keccak256(bytes(game.winner));
        } else if (keccak256(bytes(bet.betType)) == keccak256(bytes("total"))) {
            uint256 totalGoals = game.team1Score + game.team2Score;
            if (keccak256(bytes(bet.selection)) == keccak256(bytes("over"))) {
                return totalGoals > 2; // Assuming 2.5 total
            } else {
                return totalGoals < 3; // Assuming 2.5 total
            }
        }
        return false;
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than 0");
        
        userBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        userBalances[msg.sender] += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    function getUserBets(address user) external view returns (uint256[] memory) {
        return userBets[user];
    }
    
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    function getGame(string memory gameId) external view returns (Game memory) {
        return games[gameId];
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    function setHouseEdge(uint256 newEdge) external onlyOwner {
        require(newEdge <= 100, "House edge cannot exceed 10%");
        houseEdge = newEdge;
    }
    
    function withdrawHouseFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    receive() external payable {
        // Allow contract to receive ETH
    }
} 