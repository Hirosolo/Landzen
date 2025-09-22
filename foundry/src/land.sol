// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Land is ERC721, Ownable, ReentrancyGuard, Pausable {
    IERC20 public paymentStableToken = IERC20(0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55);
    // address immutable public landTokenizerAddress;
    // owner of this address is LandTokenizer contract
    uint256 public tokenIdCounter = 0;

    uint256 public totalValue;
    uint256 public totalSupply;
    uint256 public yieldRate; // yield per block
    uint256 public startDate; // in blocks
    uint256 public projectLength; // in blocks
    uint256 public landType;

    bool public redeemable = false;

    modifier onlyLandTokenizer() {
        require(msg.sender == landTokenizerAddress, "Only LandTokenizer can call this function");
        _;
    }

    modifier onlyWhenRedeemable() {
        if(redeemable == false) {
            require(block.number >= startDate + projectLength, "Redemption not allowed yet");
        }
        _;
    }

    constructor() Ownable(msg.sender) {
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

    function redeem() external nonReentrant onlyWhenRedeemable {
    }

    function getCurrentReserved() external view returns (uint256) {
        return paymentStableToken.balanceOf(address(this));
    }
}