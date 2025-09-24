// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Land is ERC721, Ownable, ReentrancyGuard, Pausable {

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// STATES ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    IERC20 public paymentStableToken = IERC20(0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55);
    uint256 public tokenIdCounter = 1;

    uint256 public immutable i_initialValue; // initial value of the land determined by the validator to handle this in real life
    uint256 public immutable i_totalSupply;
    uint256 public immutable i_yieldRate; // yield per block
    uint256 public immutable i_startDate; // in blocks
    uint256 public immutable i_projectLength; // in blocks
    uint256 public immutable i_landType;

    bool public redeemable = false;
    bool public funded = false; // this variable acted as a flag when the tokenizer funded the contract for redemption

    mapping(address => uint256) public lastWithdraw; // each holder's last withdraw block number

    error InsufficientYieldReserved(
        "Insufficient yield reserved for withdrawal, validator need to revoke this token and refund the holder"
    );

    modifier onlyLandTokenizer() {
        require(msg.sender == landTokenizerAddress, "Only LandTokenizer can call this function");
        _;
    }

    modifier onlyWhenRedeemable() {
        if(redeemable == false) {
            require(block.number >= startDate + projectLength, "Redemption not allowed yet");
        } else {
            require(redeemable == true, "Redemption not allowed yet");
        }
        _;
    }

    modifier isFunded() {
        require(funded == true, "Contract not funded yet");
        _;
    }

    modifier mintable() {
        require(tokenIdCounter <= i_totalSupply, "All tokens have been minted");
        _;
    }

    modifier haveYieldReserved() {
        if(paymentStableToken.balanceOf(address(this)) <= (i_yieldRate * 30 days)){
            revert InsufficientYieldReserved();
        }
        _;
    }

    constructor(
        address _landTokenizerAddress,
        uint256 _initialValue,
        uint256 _totalSupply,
        uint256 _yieldRate,
        uint256 _startDate,
        uint256 _projectLength,
        uint256 _landType,
        string memory _name,
        string memory _symbol
    )
    ERC721( _name, _symbol) 
    Ownable(msg.sender) {
        landTokenizerAddress = _landTokenizerAddress;
        i_initialValue = _initialValue;
        i_totalSupply = _totalSupply;
        i_yieldRate = _yieldRate;
        i_startDate = _startDate;
        i_projectLength = _projectLength;
        i_landType = _landType;
    }

    function mint(address to) external onlyLandTokenizer mintable nonReentrant {
        uint256 tokenPrice = i_initialValue / i_totalSupply;
        paymentStableToken.transferFrom(to, address(this), tokenPrice);

        _safeMint(to, tokenIdCounter);

        lastWithdraw[to] = block.number;
        tokenIdCounter++;
    }

    function withdrawYield() external  nonReentrant haveYieldReserved {
        require(balanceOf(msg.sender) > 0, "No tokens owned");

        uint256 blocksPassed = block.number - lastWithdraw[msg.sender];
        uint256 yieldAmount = (i_yieldRate * blocksPassed * balanceOf(msg.sender));

        require(yieldAmount > 0, "No yield to withdraw");

        paymentStableToken.transfer(msg.sender, yieldAmount);
        lastWithdraw[msg.sender] = block.number;
    }

    function setPaymentStableToken(address _tokenAddress) external onlyOwner {
        paymentStableToken = IERC20(_tokenAddress);
    }

    /**
     * @dev This function is called by the validator third party 
     * @dev The reason for this to trigger is listed on the app
     */
    function emergencyRedemption() onlyOwner {
        redeemable = true;
    }


    function validateFundingForRedemption() external onlyOwner {
        funded = true;
    }

    function redeem() external nonReentrant onlyWhenRedeemable isFunded {
    }

    function getCurrentReserved() external view returns (uint256) {
        return paymentStableToken.balanceOf(address(this));
    }

    fucntion getCurrentHolders() external view returns (uint256) {
        return totalSupply() - 1;
    }
}