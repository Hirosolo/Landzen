// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract lzUSDT is ERC20, Ownable {
    constructor(address owner) ERC20("LandZen USD Token", "lzUSDT") Ownable(owner) {
        _mint(owner, 1_000_000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}