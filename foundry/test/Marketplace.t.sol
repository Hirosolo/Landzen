// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/marketPlace.sol";
import "../src/landTokenizer.sol";
import "../src/land.sol";
import "../src/mock/mockStableToken.sol";

contract MarketplaceTest is Test {
    
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// VARIABLES ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    
    Marketplace public marketplace;
    LandTokenizer public tokenizer;
    Land public landContract;
    mockStableToken public usdt;
    
    // Test addresses
    address public deployer = address(this);
    address public seller = address(0x1);
    address public buyer = address(0x2);
    address public feeRecipient = address(0x3);
    
    // Test constants
    uint256 public constant PROPERTY_VALUE = 100000e6; // 100k USDT
    uint256 public constant TOTAL_SUPPLY = 500;
    uint256 public constant YIELD_RATE = 1e6; // 1 USDT per block per token
    uint256 public constant LISTING_PRICE = 250e6; // 250 USDT (25% markup)
    
    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// SETUP ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    
    function setUp() public {
        // Deploy USDT mock
        usdt = new mockStableToken(address(this), "Mock USDT", "USDT");
        
        // Deploy marketplace
        marketplace = new Marketplace(feeRecipient);
        
        // Deploy tokenizer
        tokenizer = new LandTokenizer();
        
        // Add USDT as supported stablecoin
        tokenizer.addSupportedStablecoin(address(usdt));
        
        // Deploy a property through tokenizer
        uint256 startDate = block.number + 1000; // Start in 1000 blocks
        
        vm.prank(deployer);
        tokenizer.tokenizeProperty(
            address(usdt),
            "Test Property",
            "TPROP",
            PROPERTY_VALUE,
            TOTAL_SUPPLY,
            YIELD_RATE,
            startDate,
            1 // landType: Residential
        );
        
        // Get the deployed Land contract address
        address landAddress = tokenizer.getPropertyInfo(1).landContract;
        landContract = Land(landAddress);
        
        // Mint USDT to seller and buyer
        usdt.mint(seller, 1000000e6); // 1M USDT
        usdt.mint(buyer, 1000000e6);  // 1M USDT
        
        console.log("Setup complete:");
        console.log("- Marketplace:", address(marketplace));
        console.log("- Tokenizer:", address(tokenizer));
        console.log("- Land Contract:", address(landContract));
        console.log("- USDT:", address(usdt));
        console.log("- Seller:", seller);
        console.log("- Buyer:", buyer);
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// TESTS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    
    function test_FullWorkflow_MintListBuy() public {
        console.log("\n=== STARTING FULL WORKFLOW TEST ===");
        
        // Step 1: Seller mints an NFT
        console.log("\n--- Step 1: Seller mints NFT ---");
        vm.startPrank(seller);
        
        // Approve USDT spending for minting
        uint256 nftPrice = PROPERTY_VALUE / TOTAL_SUPPLY; // 200 USDT per NFT
        usdt.approve(address(landContract), nftPrice);
        
        // Mint NFT (tokenId will be 1)
        landContract.mint(seller);
        
        // Verify NFT was minted
        assertEq(landContract.ownerOf(1), seller);
        assertEq(landContract.balanceOf(seller), 1);
        console.log("SUCCESS: NFT minted successfully, tokenId: 1");
        console.log("SUCCESS: NFT owner:", landContract.ownerOf(1));
        
        vm.stopPrank();
        
        // Step 2: Seller lists NFT on marketplace
        console.log("\n--- Step 2: Seller lists NFT ---");
        vm.startPrank(seller);
        
        // Approve marketplace to transfer NFT
        landContract.approve(address(marketplace), 1);
        
        // List NFT
        marketplace.listNFT(
            address(landContract),
            1,
            address(usdt),
            LISTING_PRICE
        );
        
        // Verify listing was created
        Marketplace.Listing memory listing = marketplace.getListing(1);
        assertEq(listing.seller, seller);
        assertEq(listing.nftContract, address(landContract));
        assertEq(listing.tokenId, 1);
        assertEq(listing.paymentToken, address(usdt));
        assertEq(listing.price, LISTING_PRICE);
        assertTrue(listing.active);
        
        console.log("SUCCESS: NFT listed successfully");
        console.log("SUCCESS: Listing ID: 1");
        console.log("SUCCESS: Price:", LISTING_PRICE / 1e6, "USDT");
        
        vm.stopPrank();
        
        // Step 3: Buyer purchases NFT
        console.log("\n--- Step 3: Buyer purchases NFT ---");
        
        // Record balances before purchase
        uint256 sellerUSDTBefore = usdt.balanceOf(seller);
        uint256 buyerUSDTBefore = usdt.balanceOf(buyer);
        uint256 feeRecipientUSDTBefore = usdt.balanceOf(feeRecipient);
        
        console.log("Balances before purchase:");
        console.log("- Seller USDT:", sellerUSDTBefore / 1e6);
        console.log("- Buyer USDT:", buyerUSDTBefore / 1e6);
        console.log("- Fee recipient USDT:", feeRecipientUSDTBefore / 1e6);
        
        vm.startPrank(buyer);
        
        // Approve USDT spending for purchase
        usdt.approve(address(marketplace), LISTING_PRICE);
        
        // Purchase NFT
        marketplace.purchaseNFT(1);
        
        vm.stopPrank();
        
        // Step 4: Verify purchase results
        console.log("\n--- Step 4: Verify purchase results ---");
        
        // Verify NFT ownership transferred
        assertEq(landContract.ownerOf(1), buyer);
        assertEq(landContract.balanceOf(seller), 0);
        assertEq(landContract.balanceOf(buyer), 1);
        console.log("SUCCESS: NFT ownership transferred to buyer");
        
        // Verify listing is no longer active
        Marketplace.Listing memory updatedListing = marketplace.getListing(1);
        assertFalse(updatedListing.active);
        console.log("SUCCESS: Listing marked as inactive");
        
        // Verify payment distribution
        uint256 platformFee = marketplace.platformFee();
        uint256 expectedFeeAmount = (LISTING_PRICE * platformFee) / 10000;
        uint256 expectedSellerAmount = LISTING_PRICE - expectedFeeAmount;
        
        uint256 sellerUSDTAfter = usdt.balanceOf(seller);
        uint256 buyerUSDTAfter = usdt.balanceOf(buyer);
        uint256 feeRecipientUSDTAfter = usdt.balanceOf(feeRecipient);
        
        assertEq(sellerUSDTAfter, sellerUSDTBefore + expectedSellerAmount);
        assertEq(buyerUSDTAfter, buyerUSDTBefore - LISTING_PRICE);
        assertEq(feeRecipientUSDTAfter, feeRecipientUSDTBefore + expectedFeeAmount);
        
        console.log("Balances after purchase:");
        console.log("- Seller USDT:", sellerUSDTAfter / 1e6);
        console.log("- Buyer USDT:", buyerUSDTAfter / 1e6);
        console.log("- Fee recipient USDT:", feeRecipientUSDTAfter / 1e6);
        
        console.log("SUCCESS: Payment distributed correctly");
        console.log("SUCCESS: Platform fee:", expectedFeeAmount / 1e6);
        
        console.log("\n=== FULL WORKFLOW TEST COMPLETED SUCCESSFULLY ===");
    }
    
    function test_CannotBuyOwnNFT() public {
        console.log("\n=== TESTING: Cannot buy own NFT ===");
        
        // Seller mints and lists NFT
        vm.startPrank(seller);
        
        uint256 nftPrice = PROPERTY_VALUE / TOTAL_SUPPLY;
        usdt.approve(address(landContract), nftPrice);
        landContract.mint(seller);
        
        landContract.approve(address(marketplace), 1);
        marketplace.listNFT(address(landContract), 1, address(usdt), LISTING_PRICE);
        
        // Try to buy own NFT - should fail
        usdt.approve(address(marketplace), LISTING_PRICE);
        
        vm.expectRevert("Cannot buy your own NFT");
        marketplace.purchaseNFT(1);
        
        vm.stopPrank();
        
        console.log("SUCCESS: Correctly prevented seller from buying their own NFT");
    }
    
    function test_CanCancelListing() public {
        console.log("\n=== TESTING: Can cancel listing ===");
        
        // Seller mints and lists NFT
        vm.startPrank(seller);
        
        uint256 nftPrice = PROPERTY_VALUE / TOTAL_SUPPLY;
        usdt.approve(address(landContract), nftPrice);
        landContract.mint(seller);
        
        landContract.approve(address(marketplace), 1);
        marketplace.listNFT(address(landContract), 1, address(usdt), LISTING_PRICE);
        
        // Verify listing is active
        assertTrue(marketplace.getListing(1).active);
        
        // Cancel listing
        marketplace.cancelListing(1);
        
        // Verify listing is no longer active
        assertFalse(marketplace.getListing(1).active);
        
        vm.stopPrank();
        
        console.log("SUCCESS: Successfully cancelled listing");
    }
    
    function test_GetActiveListings() public {
        console.log("\n=== TESTING: Get active listings ===");
        
        // Create multiple listings
        vm.startPrank(seller);
        
        uint256 nftPrice = PROPERTY_VALUE / TOTAL_SUPPLY;
        
        // Mint and list 3 NFTs
        for (uint256 i = 1; i <= 3; i++) {
            usdt.approve(address(landContract), nftPrice);
            landContract.mint(seller);
            
            landContract.approve(address(marketplace), i);
            marketplace.listNFT(address(landContract), i, address(usdt), LISTING_PRICE);
        }
        
        // Cancel one listing
        marketplace.cancelListing(2);
        
        vm.stopPrank();
        
        // Get active listings
        uint256[] memory activeListings = marketplace.getActiveListings();
        
        // Should have 2 active listings (1 and 3)
        assertEq(activeListings.length, 2);
        assertEq(activeListings[0], 1);
        assertEq(activeListings[1], 3);
        
        console.log("SUCCESS: Active listings retrieved correctly:");
        for (uint256 i = 0; i < activeListings.length; i++) {
            console.log("  - Listing ID:", activeListings[i]);
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// HELPERS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    
    function test_CheckSetup() public {
        console.log("\n=== CHECKING SETUP ===");
        
        // Verify contracts are deployed
        assertTrue(address(marketplace) != address(0));
        assertTrue(address(tokenizer) != address(0));
        assertTrue(address(landContract) != address(0));
        assertTrue(address(usdt) != address(0));
        
        // Verify USDT balances
        assertEq(usdt.balanceOf(seller), 1000000e6);
        assertEq(usdt.balanceOf(buyer), 1000000e6);
        
        // Verify marketplace settings
        assertEq(marketplace.platformFee(), 250); // 2.5%
        assertEq(marketplace.feeRecipient(), feeRecipient);
        
        console.log("SUCCESS: All contracts deployed successfully");
        console.log("SUCCESS: Test addresses have USDT");
        console.log("SUCCESS: Marketplace configured correctly");
    }
}