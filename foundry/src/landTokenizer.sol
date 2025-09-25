// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./land.sol";

contract LandTokenizer is Ownable, ReentrancyGuard, Pausable{

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// STATES ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    IERC20 public paymentStableToken = IERC20(0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55);
    uint256 public landCount = 0;

    /**
     * @dev In order for the business to tokenize a land, the validator must already verify the land ownership and other details off-chain.
     */
    struct LandInfo
    {
        address contractAddress;
        uint256 totalValue;
        uint256 totalSupply;
        uint256 yieldRate; // yield per block
        uint256 startDate; // in blocks
        uint256 projectLength; // in blocks
        uint256 landType;
    }
    
    mapping(uint256 => LandInfo) public lands;
    mapping(address => bool) public landzenLands; // this map will tell which land get tokenized by LandZen
    mapping(address => bool) public blacklist; // blacklist of investors

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// MODIFIERS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    modifier onlyLandZenLand(address landAddress) {
        require(landzenLands[landAddress], "Not a LandZen land");
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    modifier notBlacklisted(address addr) {
        require(!blacklist[addr], "Address is blacklisted");
        _;
    }

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// EVENTS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    event blacklistUpdated(address indexed addr, bool isBlacklisted);
    event validatorUpdated(address indexed addr, bool isValidator);
    event EmergencyPauseAll();
    event EmergencyUnpauseAll();

    constructor() Ownable(msg.sender) {
    }

    // TODO: Finished land.sol then implement this function
    function tokenizeLand() public {
        uint256 landId = landCount + 1;
        landCount = landId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// SETTER FUNCTIONS /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    function setPaymentStableToken(address _tokenAddress) external onlyOwner validAddress(_tokenAddress) {
        paymentStableToken = IERC20(_tokenAddress);
    }

    function blacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = true;
        emit blacklistUpdated(addr, true);
    }

    function unblacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = false;
        emit blacklistUpdated(addr, false);
    }
    
    function emergencyPauseAll() external onlyOwner {
        _pause();
        emit EmergencyPauseAll();
    }

    function unpauseAll() external onlyOwner {
        _unpause();
        emit EmergencyUnpauseAll();
    }

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// GETTER FUNCTIONS /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    function getLandInfo(uint256 landId) external view returns (LandInfo memory) {
        return lands[landId];
    }
}