// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/mock/mockStableToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILand {
    function getYieldEconomics() external view returns (uint256 totalTokens, uint256 pricePerTokenInUSDT, uint256 expectedAnnualYieldInUSDT);
}

contract FundPropertiesForYield is Script {
    address constant USDT_ADDRESS = 0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55; // Mock USDT address
    
    // All deployed property addresses
    address[] public propertyAddresses = [
        0xb32559bC7924e175FB3285D46f3f7Fd7d441123e,
        0x292C1C0EA88A461625010c49738DA0bA10237EE6,
        0xB897fB791A67884699629A9e65AFb08812A1168e,
        0x5942A271986e3344C31C7ae8B4deCD90dA70E00d,
        0x72f82Bde74fdc61Fe45B0D0a368462886D73181d,
        0xC24C06F2554DF4D086B8CaAe4ef57176E44bc1aC,
        0xEdFBC8a81AB254eddB95843475f780C7fD5a8e62,
        0xE186c2d6DEB392f25267522C4c8B7D60455f40aE
    ];
    
    function run() external {
        vm.startBroadcast();
        
        mockStableToken usdt = mockStableToken(USDT_ADDRESS);
        
        console.log("=== FUNDING PROPERTIES FOR YIELD TESTING ===");
        console.log("USDT Contract:", USDT_ADDRESS);
        console.log("Properties to fund:", propertyAddresses.length);
        
        // Fund each property with mock USDT for yield testing
        uint256 fundingAmount = 100000e6; // 100k USDT per property
        
        for (uint256 i = 0; i < propertyAddresses.length; i++) {
            console.log("\n--- Property", i + 1, "---");
            console.log("Address:", propertyAddresses[i]);
            
            // Mint USDT to the property contract
            usdt.mint(propertyAddresses[i], fundingAmount);
            
            // Verify new balance
            uint256 newBalance = usdt.balanceOf(propertyAddresses[i]);
            console.log("Funded with (USDT):", fundingAmount / 1e6);
            console.log("New property balance:", newBalance / 1e6, "USDT");
            console.log("SUCCESS: Property funded!");
        }
        
        vm.stopBroadcast();
        
        console.log("\n=== FUNDING SUMMARY ===");
        
        // Check balances after funding
        for (uint256 i = 0; i < propertyAddresses.length; i++) {
            uint256 balance = IERC20(USDT_ADDRESS).balanceOf(propertyAddresses[i]);
            console.log("Property balance (USDT):", balance / 1e6);
        }
        
        console.log("\n=== SUCCESS ===");
        console.log("All 8 properties have been funded with USDT for yield testing!");
    }
    
    // Helper function to fund a single property
    function fundSingleProperty(address propertyAddress, uint256 amount) public {
        vm.startBroadcast();
        
        mockStableToken usdt = mockStableToken(USDT_ADDRESS);
        
        console.log("Funding property with (USDT):", amount / 1e6);
        usdt.mint(propertyAddress, amount);
        
        uint256 newBalance = usdt.balanceOf(propertyAddress);
        console.log("New property balance:", newBalance / 1e6, "USDT");
        
        vm.stopBroadcast();
    }
    
    // Emergency funding function
    function emergencyFundProperty(address propertyAddress, uint256 amount) public {
        vm.startBroadcast();
        
        mockStableToken usdt = mockStableToken(USDT_ADDRESS);
        console.log("Emergency funding property (USDT):", amount / 1e6);
        usdt.mint(propertyAddress, amount);
        
        vm.stopBroadcast();
    }
}