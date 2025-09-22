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
    
    mapping(address => bool) public validators;

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

    function isValidator(address _addr) external view returns (bool) {
        return validators[_addr];
    }
}