"use client";

import { useState } from "react";
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
    return formatUnits(BigInt(value), decimals);
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
    if (fromAmount === "0" || toAmount === "0") return "N/A";

    // Convert to same decimal places for accurate division
    const normalizedFromAmount = Number(formatUnits(BigInt(fromAmount), fromDecimals));
    const normalizedToAmount = Number(formatUnits(BigInt(toAmount), toDecimals));

    // Calculate rate: how many toTokens you get for 1 fromToken
    const rate = normalizedToAmount / normalizedFromAmount;

    // Format the rate to a reasonable number of decimal places
    return rate.toFixed(6);
  } catch (error) {
    console.error("Error calculating exchange rate:", error);
    return "N/A";
  }
};

// Helper function to get token info
const getTokenInfo = (address: string) => {
  const token = Object.values(COMMON_TOKENS_BY_CHAIN[8453] || {}).find(
    t => t.address.toLowerCase() === address.toLowerCase(),
  );
  return token;
};

interface TokenSwapProps {
  chainId: number;
}

export const TokenSwap: React.FC<TokenSwapProps> = ({ chainId }) => {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [swapData, setSwapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get available tokens for current chain
  const availableTokens = COMMON_TOKENS_BY_CHAIN[chainId] || {};

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
  const fromTokenInfo = getTokenInfo(fromToken);
  const toTokenInfo = getTokenInfo(toToken);

  // This would be your contract write hook
  const { writeContractAsync: approveToken } = useScaffoldWriteContract({
    contractName: "ERC20", // You'll need to have ERC20 ABI in your contracts
  });

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

      // Validate amount
      if (amountBigInt === "0") {
        throw new Error("Please enter an amount");
      }

      // First, get the swap quote
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

      const quoteData = await quoteResponse.json();
      console.log("Quote API response:", quoteData);

      if (!quoteResponse.ok) {
        if (quoteData.description === "insufficient liquidity") {
          throw new Error("Insufficient liquidity for this swap. Try a different token pair or amount.");
        }
        throw new Error(quoteData.description || quoteData.error || "Failed to get quote");
      }

      // Then, get the swap transaction data
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
            from: address, // Add this line to explicitly set the 'from' address
          }),
      );

      const swapData = await swapResponse.json();
      console.log("Swap API response:", swapData);

      if (!swapResponse.ok) {
        throw new Error(swapData.description || swapData.error || "Failed to get swap data");
      }

      // Format the response data
      const formattedSwapData = {
        fromTokenAmount: amountBigInt,
        toTokenAmount: swapData.toAmount || swapData.tx?.toAmount,
        exchangeRate: calculateExchangeRate(
          amountBigInt,
          swapData.toAmount || swapData.tx?.toAmount || "0",
          fromTokenInfo.decimals,
          toTokenInfo.decimals,
        ),
        tx: swapData.tx,
      };

      setSwapData(formattedSwapData);

      // If approval is needed and it's not native ETH, call the approve function
      if (swapData.tx?.approve && fromToken !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        await approveToken({
          functionName: "approve",
          args: [swapData.tx.to, swapData.tx.value || swapData.tx.data?.value || "0"],
        });
      }
    } catch (error) {
      console.error("Error fetching swap data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch swap data");
    } finally {
      setLoading(false);
    }
  };

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
      <h2 className="text-2xl font-bold text-center mb-4">Swap Tokens</h2>

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
          {Object.values(availableTokens).map(token => (
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
        <select className="select select-bordered w-full" value={toToken} onChange={e => setToToken(e.target.value)}>
          <option value="">Select token</option>
          {Object.values(availableTokens).map(token => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn btn-primary"
        onClick={fetchSwapData}
        disabled={!fromToken || !toToken || !amount || loading || fromToken === toToken}
      >
        {loading ? "Loading..." : "Swap"}
      </button>

      {swapData && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Swap Details</h3>
          <div className="space-y-2">
            <p>
              From: {safeFormatUnits(swapData.fromTokenAmount, fromTokenInfo?.decimals)} {fromTokenInfo?.symbol}
            </p>
            <p>
              To: {safeFormatUnits(swapData.toTokenAmount, toTokenInfo?.decimals)} {toTokenInfo?.symbol}
            </p>
            <p>
              Exchange Rate: 1 {fromTokenInfo?.symbol} = {swapData.exchangeRate} {toTokenInfo?.symbol}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
