// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/SkinnyCat.sol";

/**
 * @notice Deploy script for SkinnyCat contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeploySkinnyCat.s.sol --network base
 * yarn deploy --file DeploySkinnyCat.s.sol --network arbitrum
 */
contract DeploySkinnyCatContract is ScaffoldETHDeploy {
    function run(address endpoint) external ScaffoldEthDeployerRunner {
        console.log("Deploying SkinnyCat on", endpoint);
        console.log("Using LayerZero endpoint:", endpoint);

        SkinnyCat skinnyCat = new SkinnyCat(endpoint, deployer);

        console.log("SkinnyCat deployed to:", address(skinnyCat));
    }
}
