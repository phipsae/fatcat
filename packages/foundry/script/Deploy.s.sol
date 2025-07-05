//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployFatCatContract } from "./DeployFatCat.s.sol";
import { DeploySkinnyCatContract } from "./DeploySkinnyCat.s.sol";

/**
 * @notice Main deployment script for all contracts
 * @dev Run this when you want to deploy multiple contracts at once
 *
 * Example: yarn deploy # runs this script(without`--file` flag)
 */
contract DeployScript is ScaffoldETHDeploy {
    address public endpointoptimism = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address public endpointbase = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address public endpointarbitrum = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    function run() external {
        // Deploys all your contracts sequentially
        // Add new deployments here when needed

        // DeployFatCatContract deployFatCatContract = new DeployFatCatContract();
        // deployFatCatContract.run(endpointoptimism);

        DeploySkinnyCatContract deploySkinnyCatContract = new DeploySkinnyCatContract();
        deploySkinnyCatContract.run(endpointbase);

        // Deploy another contract
        // DeployMyContract myContract = new DeployMyContract();
        // myContract.run();
    }
}
