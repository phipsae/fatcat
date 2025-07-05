export const COMMON_TOKENS_BY_CHAIN: { [chainId: number]: { [symbol: string]: any } } = {
  // Base (chainId: 8453)
  8453: {
    ETH: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    },
    WETH: {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
    },
    cbETH: {
      address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
      symbol: "cbETH",
      name: "Coinbase Wrapped Staked ETH",
      decimals: 18,
    },
    USDbC: {
      address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      symbol: "USDbC",
      name: "USD Base Coin",
      decimals: 6,
    },
    "1INCH": {
      address: "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE",
      symbol: "1INCH",
      name: "1inch Token",
      decimals: 18,
    },
  },
  // Arbitrum (chainId: 42161)
  42161: {
    ETH: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    USDC: {
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    },
    WETH: {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
    },
  },
  // Zircuit (chainId: 58008)
  58008: {
    ETH: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    USDC: {
      address: "0x0faF6df7054946141266420b43783387A78d82A9",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    },
    WETH: {
      address: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
    },
    ZRC: {
      address: "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8",
      symbol: "ZRC",
      name: "Zircuit Token",
      decimals: 18,
    },
  },
  // Optimism (chainId: 10)
  10: {
    ETH: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    USDC: {
      address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    },
    WETH: {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
    },
    OP: {
      address: "0x4200000000000000000000000000000000000042",
      symbol: "OP",
      name: "Optimism",
      decimals: 18,
    },
    USDT: {
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
    },
  },
};
