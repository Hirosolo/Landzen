// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/mock/lzUSDT.sol";

contract DeployLzUSDT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        lzUSDT lzUsdt = new lzUSDT(deployer);
        console.log("lzUSDT deployed to:", address(lzUsdt));
        
        vm.stopBroadcast();
    }
}