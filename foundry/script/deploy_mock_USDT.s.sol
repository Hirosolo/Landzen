// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/mock/mockStableToken.sol";

contract DeployLzUSDT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

         
        mockStableToken usdt = new mockStableToken(deployer, "Tether USD", "USDT");
        console.log("Deployed mock USDT at:", address(usdt));
        
        vm.stopBroadcast();
    }
}