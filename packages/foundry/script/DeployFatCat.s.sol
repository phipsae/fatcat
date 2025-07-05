// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/FatCat.sol";

/**
 * @notice Deploy script for YourContract contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployYourContract.s.sol  # local anvil chain
 * yarn deploy --file DeployYourContract.s.sol --network optimism # live network (requires keystore)
 */
contract DeployFatCatContract is ScaffoldETHDeploy {
    function run(address endpoint) external ScaffoldEthDeployerRunner {
        console.log("Deploying SkinnyCat on", endpoint);
        console.log("Using LayerZero endpoint:", endpoint);

        FatCat fatCat = new FatCat(endpoint, deployer);

        console.log("FatCat deployed to:", address(fatCat));
    }
}
