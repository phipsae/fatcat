"use client";

import { useEffect, useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { COMMON_TOKENS_BY_CHAIN } from "~~/config/tokens";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTokenBalance } from "~~/hooks/scaffold-eth/useTokenBalance";

// Helper function to safely format token amounts
const safeFormatUnits = (value: string | undefined | null, decimals: number = 18): string => {
  if (!value) return "0";
  try {
    const formatted = formatUnits(BigInt(value), decimals);
    const num = parseFloat(formatted);
    if (num < 0.000001) {
      return num.toExponential(6);
    } else if (num < 0.001) {
      return num.toFixed(8);
    } else if (num < 1) {
      return num.toFixed(6);
    }
    return num.toFixed(4);
  } catch (error) {
    console.error("Error formatting units:", error);
    return "0";
  }
};

// Helper function to calculate exchange rate
const calculateExchangeRate = (
  fromAmount: string,
  toAmount: string,
  fromDecimals: number,
  toDecimals: number,
): string => {
  try {
    if (!fromAmount || !toAmount) return "N/A";

    // Convert to same decimal places for accurate division
    const normalizedFromAmount = parseFloat(formatUnits(BigInt(fromAmount), fromDecimals));
    const normalizedToAmount = parseFloat(formatUnits(BigInt(toAmount), toDecimals));

    if (normalizedFromAmount === 0) return "N/A";

    // Calculate rate: how many toTokens you get for 1 fromToken
    const rate = normalizedToAmount / normalizedFromAmount;

    // Format based on the size of the number
    if (rate < 0.000001) {
      return rate.toExponential(6);
    } else if (rate < 0.001) {
      return rate.toFixed(8);
    } else if (rate < 1) {
      return rate.toFixed(6);
    }
    return rate.toFixed(4);
  } catch (error) {
    console.error("Error calculating exchange rate:", error);
    return "N/A";
  }
};

interface TokenSwapProps {
  chainId: number;
  onSwapComplete?: (amount: string) => void;
}

interface QuoteData {
  toAmount: string;
  rate: string;
  protocols?: any[];
}

interface SwapData {
  fromTokenAmount: string;
  toTokenAmount: string;
  exchangeRate: string;
  protocols?: any[];
  tx: any;
}

// Helper function to format DEX names
const formatDexNames = (protocols: any[]): string => {
  if (!protocols || !protocols.length) return "Unknown DEX";

  // Flatten the protocols array as 1inch returns nested protocol routes
  const flattenProtocols = (items: any[]): string[] => {
    return items.reduce((acc: string[], item) => {
      if (item.protocols) {
        return [...acc, ...flattenProtocols(item.protocols)];
      }
      return [...acc, item.name];
    }, []);
  };

  // Get unique DEX names
  const dexNames = [...new Set(flattenProtocols(protocols))];

  if (dexNames.length === 1) return dexNames[0];
  if (dexNames.length === 2) return `${dexNames[0]} and ${dexNames[1]}`;
  return `${dexNames[0]} and ${dexNames.length - 1} others`;
};

export const TokenSwap: React.FC<TokenSwapProps> = ({ chainId, onSwapComplete }) => {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState("");
  const [amount, setAmount] = useState("");
  const [swapData, setSwapData] = useState<SwapData | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingQuote, setFetchingQuote] = useState(false);

  // Get available tokens for current chain, excluding ETH
  const availableFromTokens = Object.values(COMMON_TOKENS_BY_CHAIN[chainId] || {}).filter(
    token => token.symbol !== "ETH",
  );

  // ETH is always the destination token
  const toToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const toTokenInfo = COMMON_TOKENS_BY_CHAIN[chainId]?.ETH;

  // Get token balances
  const {
    balance: fromTokenBalance,
    loading: loadingFromBalance,
    error: fromBalanceError,
  } = useTokenBalance(fromToken, chainId);
  const {
    balance: toTokenBalance,
    loading: loadingToBalance,
    error: toBalanceError,
  } = useTokenBalance(toToken, chainId);

  // Get token info
  const fromTokenInfo = availableFromTokens.find(t => t.address.toLowerCase() === fromToken.toLowerCase());

  // This would be your contract write hook
  const { writeContractAsync: approveToken } = useScaffoldWriteContract({
    contractName: "ERC20", // You'll need to have ERC20 ABI in your contracts
  });

  const fetchQuote = async () => {
    if (!address || !fromToken || !amount || !fromTokenInfo) return;

    try {
      setFetchingQuote(true);
      setError(null);

      const amountBigInt = parseUnits(amount || "0", fromTokenInfo.decimals).toString();

      if (amountBigInt === "0") return;

      const quoteResponse = await fetch(
        `/api/inch/swap?` +
          new URLSearchParams({
            chainId: chainId.toString(),
            action: "quote",
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            amount: amountBigInt,
            walletAddress: address,
          }),
      );

      const data = await quoteResponse.json();

      if (!quoteResponse.ok) {
        if (data.description === "insufficient liquidity") {
          throw new Error("Insufficient liquidity for this swap");
        }
        throw new Error(data.description || data.error || "Failed to get quote");
      }

      const rate = calculateExchangeRate(
        amountBigInt,
        data.toAmount,
        fromTokenInfo?.decimals || 18,
        toTokenInfo?.decimals || 18,
      );

      setQuoteData({
        toAmount: data.toAmount,
        rate,
        protocols: data.protocols,
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch quote");
      setQuoteData(null);
    } finally {
      setFetchingQuote(false);
    }
  };

  const fetchSwapData = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setSwapData(null);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Invalid token selection");
      }

      const amountBigInt = parseUnits(amount || "0", fromTokenInfo.decimals).toString();

      if (amountBigInt === "0") {
        throw new Error("Please enter an amount");
      }

      const swapResponse = await fetch(
        `/api/inch/swap?` +
          new URLSearchParams({
            chainId: chainId.toString(),
            action: "swap",
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            amount: amountBigInt,
            walletAddress: address,
            slippage: "1",
            from: address,
          }),
      );

      const swapData = await swapResponse.json();
      console.log("Swap API response:", swapData);

      if (!swapResponse.ok) {
        throw new Error(swapData.description || swapData.error || "Failed to get swap data");
      }

      const toAmount = swapData.toAmount || swapData.tx?.toAmount || "0";

      const formattedSwapData = {
        fromTokenAmount: amountBigInt,
        toTokenAmount: toAmount,
        exchangeRate: calculateExchangeRate(
          parseUnits(amount || "0", fromTokenInfo?.decimals || 18).toString(),
          toAmount,
          fromTokenInfo?.decimals || 18,
          toTokenInfo?.decimals || 18,
        ),
        protocols: swapData.protocols,
        tx: swapData.tx,
      };

      setSwapData(formattedSwapData);

      if (swapData.tx?.approve && fromToken !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        await approveToken({
          functionName: "approve",
          args: [swapData.tx.to, swapData.tx.value || swapData.tx.data?.value || "0"],
        });
      }

      if (onSwapComplete && quoteData) {
        onSwapComplete(safeFormatUnits(quoteData.toAmount, toTokenInfo?.decimals));
      }
    } catch (error) {
      console.error("Error fetching swap data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch swap data");
    } finally {
      setLoading(false);
    }
  };

  // Add effect to fetch quote when amount or token changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchQuote();
    }, 500); // Debounce quote fetching by 500ms

    return () => clearTimeout(debounceTimeout);
  }, [amount, fromToken, address, chainId]);

  // Show balance errors if any
  const balanceError = fromBalanceError || toBalanceError;
  if (balanceError) {
    console.error("Balance fetch error:", balanceError);
  }

  // Safely get formatted balances
  const formattedFromBalance = safeFormatUnits(fromTokenBalance, fromTokenInfo?.decimals);
  const formattedToBalance = safeFormatUnits(toTokenBalance, toTokenInfo?.decimals);

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-100 rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Swap to ETH</h2>

      {!address && (
        <div className="alert alert-warning">
          <span>Please connect your wallet to swap tokens</span>
        </div>
      )}

      {(error || balanceError) && (
        <div className="alert alert-error">
          <span>{error || balanceError}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm">From Token</label>
          {loadingFromBalance ? (
            <span className="text-sm opacity-50">Loading balance...</span>
          ) : (
            <span className="text-sm">
              Balance: {formattedFromBalance} {fromTokenInfo?.symbol || ""}
            </span>
          )}
        </div>
        <select
          className="select select-bordered w-full"
          value={fromToken}
          onChange={e => setFromToken(e.target.value)}
        >
          <option value="">Select token</option>
          {availableFromTokens.map(token => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Amount</label>
        <EtherInput value={amount} onChange={value => setAmount(value)} />
        {fromTokenBalance && Number(formattedFromBalance) > 0 && (
          <button className="text-sm text-primary hover:underline" onClick={() => setAmount(formattedFromBalance)}>
            Use max
          </button>
        )}
        {fetchingQuote && <span className="text-sm text-gray-500">Fetching quote...</span>}
        {quoteData && !fetchingQuote && (
          <div className="text-sm space-y-1">
            <p>Expected output: {safeFormatUnits(quoteData.toAmount, toTokenInfo?.decimals)} ETH</p>
            <p>
              Rate: 1 {fromTokenInfo?.symbol} = {quoteData.rate} ETH
            </p>
            <p className="text-gray-500">via {formatDexNames(quoteData.protocols || [])}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm">To Token</label>
          {loadingToBalance ? (
            <span className="text-sm opacity-50">Loading balance...</span>
          ) : (
            <span className="text-sm">
              Balance: {formattedToBalance} {toTokenInfo?.symbol || ""}
            </span>
          )}
        </div>
        <div className="select select-bordered w-full flex items-center px-4 py-3">
          <span>ETH - Ethereum</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={fetchSwapData} disabled={!fromToken || !amount || loading}>
        {loading ? "Loading..." : "Swap to ETH"}
      </button>

      {swapData && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Swap Details</h3>
          <div className="text-sm space-y-1">
            <p>
              From: {amount} {fromTokenInfo?.symbol}
            </p>
            <p>To: {quoteData ? safeFormatUnits(quoteData.toAmount, toTokenInfo?.decimals) : "0"} ETH</p>
            <p>
              Rate: 1 {fromTokenInfo?.symbol} = {quoteData ? quoteData.rate : "0"} ETH
            </p>
            <p className="text-gray-500">via {formatDexNames(swapData.protocols || [])}</p>
          </div>
        </div>
      )}
    </div>
  );
};
