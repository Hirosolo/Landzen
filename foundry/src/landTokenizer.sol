// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./land.sol";

contract LandTokenizer is Ownable, ReentrancyGuard, Pausable{
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
        uint256 tokenizeAt;
        uint256 landType;
        bool isActive;     
    }
    
    mapping(address => bool) public validators;
    mapping(uint256 => LandInfo) public lands;
    mapping(address => bool) public landzenLands; // this map will tell which land get tokenized by LandZen
    mapping(address => bool) public blacklist; // blacklist of investors

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

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

    event blacklistUpdated(address indexed addr, bool isBlacklisted);
    event validatorUpdated(address indexed addr, bool isValidator);

    constructor() Ownable(msg.sender) {
        validators[msg.sender] = true;
    }

    // TODO: Finished land.sol then implement this function
    function tokenizeLand() {}

    function blacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = true;
        emit blacklistUpdated(addr, true);
    }

    function unblacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = false;
        emit blacklistUpdated(addr, false);
    }

    function addValidator(address addr) external onlyOwner validAddress(addr) {
        validators[addr] = true;
        emit validatorUpdated(addr, true);
    }

    function removeValidator(address addr) external onlyOwner validAddress(addr) {
        validators[addr] = false;
        emit validatorUpdated(addr, false);
    }

    function isValidator(address _addr) external view returns (bool) {
        return validators[_addr];
    }

    function getLandInfo(uint256 landId) external view returns (LandInfo memory) {
        return lands[landId];
    }
}