// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mockStableToken is ERC20, Ownable {
    constructor(address owner, string memory _tokenName, string memory _tokenSymbol) 
    ERC20(_tokenName, _tokenSymbol) Ownable(owner) {
        _mint(owner, 1_000_000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}