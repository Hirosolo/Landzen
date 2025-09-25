// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/landTokenizer.sol";
import "../src/land.sol";
import "../src/mock/mockStableToken.sol";

contract GeneralTest is Test {
    LandTokenizer public tokenizer;
    mockStableToken public usdt;
    Land public landContract;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);
    
    uint256 constant TOTAL_VALUE = 1000000e18; // 1M USDT
    uint256 constant TOTAL_SUPPLY = 1000; // 1000 NFTs
    uint256 constant TOKEN_PRICE = TOTAL_VALUE / TOTAL_SUPPLY; // 1000 USDT per NFT
    uint256 constant YIELD_RATE = 1e15; // Yield per block per token
    
    function setUp() public {
        // Set owner
        vm.startPrank(owner);
        
        // Deploy mock USDT
        usdt = new mockStableToken(owner, "Mock USDT", "USDT");
        
        // Deploy tokenizer
        tokenizer = new LandTokenizer();
        
        // Add USDT as supported stablecoin
        tokenizer.addSupportedStablecoin(address(usdt));
        
        // Deploy a property
        address propertyAddress = tokenizer.tokenizeProperty(
            address(usdt),
            "Test Property",
            "TPROP",
            TOTAL_VALUE,
            TOTAL_SUPPLY,
            YIELD_RATE,
            block.timestamp + 3600, // Starts in 1 hour
            1 // Land type
        );
        
        landContract = Land(propertyAddress);
        vm.stopPrank();
        
        // Give users some USDT and approve spending
        uint256 userBalance = 10000000e18; // 10M USDT each
        
        vm.startPrank(owner);
        usdt.mint(user1, userBalance);
        usdt.mint(user2, userBalance);
        usdt.mint(user3, userBalance);
        vm.stopPrank();
        
        vm.prank(user1);
        usdt.approve(address(landContract), userBalance);
        
        vm.prank(user2);
        usdt.approve(address(landContract), userBalance);
        
        vm.prank(user3);
        usdt.approve(address(landContract), userBalance);
    }
    
    function testTokenizerDeployment() public {
        // Check tokenizer deployed correctly
        assertTrue(address(tokenizer) != address(0));
        assertTrue(tokenizer.supportedStablecoins(address(usdt)));
        assertEq(tokenizer.landCount(), 1);
        
        // Check property deployed correctly
        assertTrue(address(landContract) != address(0));
        assertTrue(tokenizer.isLandZenProperty(address(landContract)));
        assertEq(landContract.i_totalSupply(), TOTAL_SUPPLY);
        assertEq(landContract.i_initialValue(), TOTAL_VALUE);
    }
    
    function testMultiplePeopleMinting() public {
        // Move past start time to enable minting
        vm.warp(block.timestamp + 3601);
        
        // User1 mints tokens (one at a time)
        vm.startPrank(user1);
        for(uint i = 0; i < 100; i++) {
            landContract.mint(user1);
        }
        vm.stopPrank();
        assertEq(landContract.balanceOf(user1), 100);
        
        // User2 mints tokens
        vm.startPrank(user2);
        for(uint i = 0; i < 200; i++) {
            landContract.mint(user2);
        }
        vm.stopPrank();
        assertEq(landContract.balanceOf(user2), 200);
        
        // User3 mints tokens
        vm.startPrank(user3);
        for(uint i = 0; i < 300; i++) {
            landContract.mint(user3);
        }
        vm.stopPrank();
        assertEq(landContract.balanceOf(user3), 300);
        
        // Check total minted
        assertEq(landContract.totalSupply(), 600);
        
        // Check users can mint more as long as within supply
        vm.startPrank(user1);
        for(uint i = 0; i < 50; i++) {
            landContract.mint(user1);
        }
        vm.stopPrank();
        assertEq(landContract.balanceOf(user1), 150);
    }
    
    function testYieldWithdrawal() public {
        // Move past start time and mint tokens
        vm.warp(block.timestamp + 3601);
        
        // Mint fewer tokens for simpler testing
        vm.startPrank(user1);
        for(uint i = 0; i < 10; i++) {
            landContract.mint(user1);
        }
        vm.stopPrank();
        
        vm.startPrank(user2);
        for(uint i = 0; i < 20; i++) {
            landContract.mint(user2);
        }
        vm.stopPrank();
        
        // Move to yield period (past startDate) - start date is when minting ends and yield begins
        // Need to advance block.number since the contract uses blocks, not timestamps
        vm.roll(landContract.i_startDate() + 1);
        
        // Transfer ownership of Land contract to owner for easier testing
        vm.prank(address(tokenizer));
        landContract.transferOwnership(owner);
        
        // Owner deposits monthly yield for the first month
        vm.startPrank(owner);
        uint256 monthlyYield = landContract.calculateRequiredMonthlyYield();
        usdt.mint(owner, monthlyYield);
        usdt.approve(address(landContract), monthlyYield);
        landContract.depositMonthlyYield();
        vm.stopPrank();
        
        // Simulate some blocks passing for yield accumulation (half a month)
        vm.roll(landContract.i_startDate() + 108000); // Half of MONTH_IN_BLOCKS
        
        // User1 withdraws yield
        uint256 user1BalanceBefore = usdt.balanceOf(user1);
        vm.prank(user1);
        landContract.withdrawYield();
        uint256 user1BalanceAfter = usdt.balanceOf(user1);
        
        assertTrue(user1BalanceAfter > user1BalanceBefore, "User1 should receive yield");
        
        // User2 can still withdraw their yield independently
        uint256 user2BalanceBefore = usdt.balanceOf(user2);
        vm.prank(user2);
        landContract.withdrawYield();
        uint256 user2BalanceAfter = usdt.balanceOf(user2);
        
        assertTrue(user2BalanceAfter > user2BalanceBefore, "User2 should receive yield");
        assertTrue(user2BalanceAfter - user2BalanceBefore > user1BalanceAfter - user1BalanceBefore, "User2 should get more yield (more tokens)");
    }
    
    function testRedemption() public {
        // Setup: mint tokens for users
        vm.warp(block.timestamp + 3601);
        
        // Mint tokens for users
        vm.startPrank(user1);
        for(uint i = 0; i < 10; i++) {
            landContract.mint(user1);
        }
        vm.stopPrank();
        
        vm.startPrank(user2);
        for(uint i = 0; i < 20; i++) {
            landContract.mint(user2);
        }
        vm.stopPrank();
        
        // Transfer ownership of Land contract to owner for easier testing
        vm.prank(address(tokenizer));
        landContract.transferOwnership(owner);
        
        // Owner funds redemption pool with enough USDT for all redemptions
        vm.startPrank(owner);
        uint256 redemptionAmount = TOTAL_VALUE; // Fund with total value
        usdt.mint(owner, redemptionAmount);
        usdt.approve(address(landContract), redemptionAmount);
        // Transfer funds to contract for redemption
        usdt.transfer(address(landContract), redemptionAmount);
        
        // Enable redemption by setting funded flag
        landContract.validateFundingForRedemption();
        
        // Set redeemable to true for testing (simulating owner decision)
        landContract.emergencyRedemption(); // This sets redeemable = true
        vm.stopPrank();
        
        // User1 redeems their tokens
        uint256 user1TokensBefore = landContract.balanceOf(user1);
        uint256 user1BalanceBefore = usdt.balanceOf(user1);
        
        vm.prank(user1);
        landContract.redeem();
        
        uint256 user1TokensAfter = landContract.balanceOf(user1);
        uint256 user1BalanceAfter = usdt.balanceOf(user1);
        
        // Check tokens were burned and USDT received
        assertEq(user1TokensAfter, 0, "User1 tokens should be burned");
        assertTrue(user1BalanceAfter > user1BalanceBefore, "User1 should receive USDT");
        
        // Check user1 received correct amount
        uint256 expectedRedemption = user1TokensBefore * TOKEN_PRICE;
        assertEq(user1BalanceAfter - user1BalanceBefore, expectedRedemption, "Should receive correct redemption amount");
        
        // User2 can still redeem independently
        uint256 user2TokensBefore = landContract.balanceOf(user2);
        uint256 user2BalanceBefore = usdt.balanceOf(user2);
        
        vm.prank(user2);
        landContract.redeem();
        
        uint256 user2TokensAfter = landContract.balanceOf(user2);
        uint256 user2BalanceAfter = usdt.balanceOf(user2);
        
        assertEq(user2TokensAfter, 0, "User2 tokens should be burned");
        uint256 expectedRedemption2 = user2TokensBefore * TOKEN_PRICE;
        assertEq(user2BalanceAfter - user2BalanceBefore, expectedRedemption2, "User2 should receive correct redemption amount");
    }
    
    function testMintingLimits() public {
        vm.warp(block.timestamp + 3601);
        
        // Try to mint without enough USDT balance
        vm.startPrank(user1);
        // First spend most of user1's balance
        usdt.transfer(address(0x999), usdt.balanceOf(user1) - (TOKEN_PRICE / 2));
        
        vm.expectRevert(); // Modern OpenZeppelin uses custom errors
        landContract.mint(user1); // Would need more USDT than available
        vm.stopPrank();
        
        // Test max supply limit by minting all tokens
        vm.startPrank(user2);
        // Mint all available tokens
        for(uint i = 0; i < TOTAL_SUPPLY; i++) {
            landContract.mint(user2);
        }
        vm.stopPrank();
        
        // Now user3 should not be able to mint
        vm.prank(user3);
        vm.expectRevert("All tokens have been minted");
        landContract.mint(user3);
    }
}