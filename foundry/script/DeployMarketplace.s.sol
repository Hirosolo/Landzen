// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/marketPlace.sol";

contract DeployMarketplace is Script {
    
    function run() external {
        // Get the private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get fee recipient address (can be the deployer or a different address)
        address feeRecipient = vm.envOr("FEE_RECIPIENT", vm.addr(deployerPrivateKey));
        
        console.log("Starting Marketplace deployment...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Fee Recipient:", feeRecipient);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Marketplace
        Marketplace marketplace = new Marketplace(feeRecipient);
        
        vm.stopBroadcast();
        
        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("Marketplace deployed at:", address(marketplace));
        console.log("Platform fee (basis points):", marketplace.platformFee());
        console.log("Fee recipient:", marketplace.feeRecipient());
        console.log("Owner:", marketplace.owner());
        
        // Verify deployment
        console.log("\n=== VERIFICATION ===");
        console.log("Marketplace listing counter:", marketplace.listingCounter());
        console.log("Marketplace paused:", marketplace.paused());
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Add the marketplace address to your frontend configuration");
        console.log("2. Users can now list their Land NFTs for sale");
        console.log("3. Other users can purchase listed NFTs");
        console.log("4. Platform will earn 2.5% fee on each sale");
        
        // Save deployment info to a file
        string memory deploymentInfo = string.concat(
            "MARKETPLACE_ADDRESS=", vm.toString(address(marketplace)), "\n",
            "PLATFORM_FEE=", vm.toString(marketplace.platformFee()), "\n",
            "FEE_RECIPIENT=", vm.toString(marketplace.feeRecipient()), "\n",
            "OWNER=", vm.toString(marketplace.owner()), "\n"
        );
        
        vm.writeFile("marketplace_deployment.env", deploymentInfo);
        console.log("\nDeployment info saved to: marketplace_deployment.env");
    }
}