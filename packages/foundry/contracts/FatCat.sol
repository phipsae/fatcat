// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FatCat is OApp, OAppOptionsType3 {
    using OptionsBuilder for bytes;

    mapping(address => uint256) public userBalance;

    /// @notice Event emitted when a user deposits ETH into the vault
    event VaultDeposit(address indexed user, uint256 amount, bool crossChain);

    /// @notice Event emitted when a user withdraws ETH from the vault
    event VaultWithdraw(address indexed user, uint256 amount);

    /// @notice Event emitted when ETH is received
    event EthReceived(address indexed sender, uint256 amount, string message);

    /// @notice Initialize with Endpoint V2 and owner address
    /// @param _endpoint The local chain's LayerZero Endpoint V2 address
    /// @param _owner    The address permitted to configure this OApp
    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) { }

    /// @notice Invoked by OAppReceiver when EndpointV2.lzReceive is called
    /// @dev   _origin    Metadata (source chain, sender address, nonce)
    /// @dev   _guid      Global unique ID for tracking this message
    /// @param _message   ABI-encoded bytes (the string we sent earlier)
    /// @dev   _executor  Executor address that delivered the message
    /// @dev   _extraData Additional data from the Executor (unused here)
    function _lzReceive(
        Origin calldata, /*_origin*/
        bytes32, /*_guid*/
        bytes calldata _message,
        address, /*_executor*/
        bytes calldata /*_extraData*/
    ) internal override {
        // 1. Decode the incoming bytes into a string
        //    You can use abi.decode, abi.decodePacked, or directly splice bytes
        //    if you know the format of your data structures
        (uint256 _transferAmount, address _user) = abi.decode(_message, (uint256, address));

        // 2. Apply your custom logic. In this example, store it in `lastMessage`.
        _processVaultDeposit(_user, _transferAmount);

        // 3. (Optional) Trigger further on-chain actions.
        //    e.g., emit an event, mint tokens, call another contract, etc.
        //    emit MessageReceived(_origin.srcEid, _string);
    }

    /// @notice Allow contract to receive ETH
    receive() external payable {
        _processVaultDeposit(msg.sender, msg.value);
    }

    /// @notice Withdraw ETH from the vault
    /// @param _amount Amount to withdraw (in wei)
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(userBalance[msg.sender] >= _amount, "Insufficient balance");
        require(address(this).balance >= _amount, "Insufficient vault balance");

        // Update user balance
        userBalance[msg.sender] -= _amount;

        // Transfer ETH to user
        (bool success,) = payable(msg.sender).call{ value: _amount }("");
        require(success, "ETH transfer failed");

        emit VaultWithdraw(msg.sender, _amount);
    }

    /// @notice Process a vault deposit received from another chain
    /// @param _user User who made the deposit
    /// @param _amount Amount deposited
    function _processVaultDeposit(address _user, uint256 _amount) internal {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "Invalid amount");

        // Update user balance
        userBalance[_user] += _amount;

        // Emit event (crossChain = true)
        emit VaultDeposit(_user, _amount, true);
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return userBalance[_user];
    }
}
