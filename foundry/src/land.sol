// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Land is ERC721, Ownable, ReentrancyGuard, Pausable {
    IERC20 public paymentStableToken = IERC20(0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55);
    address public landTokenizerAddress;

    function setPaymentStableToken(address _tokenAddress) external onlyOwner {
        paymentStableToken = IERC20(_tokenAddress);
    }
}