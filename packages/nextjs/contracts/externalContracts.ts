import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  11155420: {
    FatCatOptimism: {
      address: "0xc8Cc9d999CCB4688a69F024dcaa57Ebe59F8b830",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_endpoint",
              type: "address",
            },
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "InvalidDelegate",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidEndpointCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "options",
              type: "bytes",
            },
          ],
          name: "InvalidOptions",
          type: "error",
        },
        {
          inputs: [],
          name: "LzTokenUnavailable",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
          ],
          name: "NoPeer",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "msgValue",
              type: "uint256",
            },
          ],
          name: "NotEnoughNative",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
          ],
          name: "OnlyEndpoint",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
          ],
          name: "OnlyPeer",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "eid",
                  type: "uint32",
                },
                {
                  internalType: "uint16",
                  name: "msgType",
                  type: "uint16",
                },
                {
                  internalType: "bytes",
                  name: "options",
                  type: "bytes",
                },
              ],
              indexed: false,
              internalType: "struct EnforcedOptionParam[]",
              name: "_enforcedOptions",
              type: "tuple[]",
            },
          ],
          name: "EnforcedOptionSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          name: "EthReceived",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "peer",
              type: "bytes32",
            },
          ],
          name: "PeerSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "crossChain",
              type: "bool",
            },
          ],
          name: "VaultDeposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "VaultWithdraw",
          type: "event",
        },
        {
          inputs: [],
          name: "SEND",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "SEND_WITH_ETH",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "origin",
              type: "tuple",
            },
          ],
          name: "allowInitializePath",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "_msgType",
              type: "uint16",
            },
            {
              internalType: "bytes",
              name: "_extraOptions",
              type: "bytes",
            },
          ],
          name: "combineOptions",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "endpoint",
          outputs: [
            {
              internalType: "contract ILayerZeroEndpointV2",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "msgType",
              type: "uint16",
            },
          ],
          name: "enforcedOptions",
          outputs: [
            {
              internalType: "bytes",
              name: "enforcedOption",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_user",
              type: "address",
            },
          ],
          name: "getUserBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "",
              type: "tuple",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "_sender",
              type: "address",
            },
          ],
          name: "isComposeMsgSender",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastEthAmount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastMessage",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastSender",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "_origin",
              type: "tuple",
            },
            {
              internalType: "bytes32",
              name: "_guid",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "_message",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "_executor",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_extraData",
              type: "bytes",
            },
          ],
          name: "lzReceive",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "nextNonce",
          outputs: [
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "oAppVersion",
          outputs: [
            {
              internalType: "uint64",
              name: "senderVersion",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "receiverVersion",
              type: "uint64",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
          ],
          name: "peers",
          outputs: [
            {
              internalType: "bytes32",
              name: "peer",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_delegate",
              type: "address",
            },
          ],
          name: "setDelegate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "eid",
                  type: "uint32",
                },
                {
                  internalType: "uint16",
                  name: "msgType",
                  type: "uint16",
                },
                {
                  internalType: "bytes",
                  name: "options",
                  type: "bytes",
                },
              ],
              internalType: "struct EnforcedOptionParam[]",
              name: "_enforcedOptions",
              type: "tuple[]",
            },
          ],
          name: "setEnforcedOptions",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_eid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "_peer",
              type: "bytes32",
            },
          ],
          name: "setPeer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "userBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
    },
  },
  421614: {
    SkinnyCatArbitrum: {
      address: "0x4552da51328ff6EC3252dbeAd067F541c471d467",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_endpoint",
              type: "address",
            },
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "InvalidDelegate",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidEndpointCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "options",
              type: "bytes",
            },
          ],
          name: "InvalidOptions",
          type: "error",
        },
        {
          inputs: [],
          name: "LzTokenUnavailable",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
          ],
          name: "NoPeer",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "msgValue",
              type: "uint256",
            },
          ],
          name: "NotEnoughNative",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
          ],
          name: "OnlyEndpoint",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "sender",
              type: "bytes32",
            },
          ],
          name: "OnlyPeer",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "eid",
                  type: "uint32",
                },
                {
                  internalType: "uint16",
                  name: "msgType",
                  type: "uint16",
                },
                {
                  internalType: "bytes",
                  name: "options",
                  type: "bytes",
                },
              ],
              indexed: false,
              internalType: "struct EnforcedOptionParam[]",
              name: "_enforcedOptions",
              type: "tuple[]",
            },
          ],
          name: "EnforcedOptionSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          name: "EthReceived",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "peer",
              type: "bytes32",
            },
          ],
          name: "PeerSet",
          type: "event",
        },
        {
          inputs: [],
          name: "SEND",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "SEND_WITH_ETH",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "origin",
              type: "tuple",
            },
          ],
          name: "allowInitializePath",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "_msgType",
              type: "uint16",
            },
            {
              internalType: "bytes",
              name: "_extraOptions",
              type: "bytes",
            },
          ],
          name: "combineOptions",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_message",
              type: "bytes",
            },
          ],
          name: "decodeStringWithEth",
          outputs: [
            {
              internalType: "string",
              name: "_string",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_ethAmount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_receiver",
              type: "address",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "endpoint",
          outputs: [
            {
              internalType: "contract ILayerZeroEndpointV2",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "msgType",
              type: "uint16",
            },
          ],
          name: "enforcedOptions",
          outputs: [
            {
              internalType: "bytes",
              name: "enforcedOption",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "",
              type: "tuple",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "_sender",
              type: "address",
            },
          ],
          name: "isComposeMsgSender",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastEthAmount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastMessage",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastSender",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "srcEid",
                  type: "uint32",
                },
                {
                  internalType: "bytes32",
                  name: "sender",
                  type: "bytes32",
                },
                {
                  internalType: "uint64",
                  name: "nonce",
                  type: "uint64",
                },
              ],
              internalType: "struct Origin",
              name: "_origin",
              type: "tuple",
            },
            {
              internalType: "bytes32",
              name: "_guid",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "_message",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "_executor",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_extraData",
              type: "bytes",
            },
          ],
          name: "lzReceive",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "nextNonce",
          outputs: [
            {
              internalType: "uint64",
              name: "nonce",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "oAppVersion",
          outputs: [
            {
              internalType: "uint64",
              name: "senderVersion",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "receiverVersion",
              type: "uint64",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "eid",
              type: "uint32",
            },
          ],
          name: "peers",
          outputs: [
            {
              internalType: "bytes32",
              name: "peer",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_dstEid",
              type: "uint32",
            },
            {
              internalType: "uint256",
              name: "_transferAmount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_user",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_options",
              type: "bytes",
            },
            {
              internalType: "bool",
              name: "_payInLzToken",
              type: "bool",
            },
          ],
          name: "quoteSendString",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "nativeFee",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "lzTokenFee",
                  type: "uint256",
                },
              ],
              internalType: "struct MessagingFee",
              name: "fee",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_dstEid",
              type: "uint32",
            },
            {
              internalType: "uint256",
              name: "_transferAmount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_user",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_options",
              type: "bytes",
            },
          ],
          name: "sendString",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_delegate",
              type: "address",
            },
          ],
          name: "setDelegate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint32",
                  name: "eid",
                  type: "uint32",
                },
                {
                  internalType: "uint16",
                  name: "msgType",
                  type: "uint16",
                },
                {
                  internalType: "bytes",
                  name: "options",
                  type: "bytes",
                },
              ],
              internalType: "struct EnforcedOptionParam[]",
              name: "_enforcedOptions",
              type: "tuple[]",
            },
          ],
          name: "setEnforcedOptions",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_eid",
              type: "uint32",
            },
            {
              internalType: "bytes32",
              name: "_peer",
              type: "bytes32",
            },
          ],
          name: "setPeer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
