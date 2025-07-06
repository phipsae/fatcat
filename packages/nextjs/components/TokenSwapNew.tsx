"use client";

import { useEffect, useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";
import { COMMON_TOKENS_BY_CHAIN } from "~~/config/tokens";
import { useTokenBalance } from "~~/hooks/scaffold-eth/useTokenBalance";

// Supported chains for 1inch swaps
export const SUPPORTED_CHAINS = [
  { id: 8453, name: "Base", icon: "🔵" },
  { id: 42161, name: "Arbitrum", icon: "🟢" },
  { id: 10, name: "Optimism", icon: "🔴" },
];

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
  onChainChange: (chainId: number) => void;
  initialChainId?: number;
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

// ERC20 ABI for approve function
const erc20Abi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const TokenSwap = ({ onChainChange, initialChainId = 8453, onSwapComplete }: TokenSwapProps) => {
  const { address } = useAccount();
  const [chainId, setChainId] = useState(initialChainId);
  const [fromToken, setFromToken] = useState("");
  const [amount, setAmount] = useState("");
  const [swapData, setSwapData] = useState<SwapData | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
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

  // Handle chain change
  const handleChainChange = (newChainId: number) => {
    setChainId(newChainId);
    setFromToken(""); // Reset token selection when chain changes
    onChainChange(newChainId);
  };

  // Use wagmi hooks for approve and swap
  const { writeContractAsync: approveToken } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onSuccess(data: `0x${string}`) {
        console.log("✅ Transaction prepared successfully:", data);
      },
      onError(error: Error) {
        console.error("❌ Transaction preparation failed:", error);
      },
    },
  });

  console.log("🔧 Transaction sender initialized:", { sendTransactionAsync: !!sendTransactionAsync });

  const fetchQuote = async () => {
    if (!address || !fromToken || !amount || !fromTokenInfo) {
      setSwapError("Please fill in all fields");
      return;
    }

    try {
      setFetchingQuote(true);
      setSwapError(null);

      const amountBigInt = parseUnits(amount || "0", fromTokenInfo.decimals).toString();

      if (amountBigInt === "0") {
        setSwapError("Please enter an amount");
        return;
      }

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
        const errorMessage =
          data.description === "insufficient liquidity"
            ? "Insufficient liquidity for this swap"
            : data.description || data.error || "Failed to get quote";
        setSwapError(errorMessage);
        setQuoteData(null);
        return;
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
      setSwapError(null);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setSwapError(error instanceof Error ? error.message : "Failed to fetch quote");
      setQuoteData(null);
    } finally {
      setFetchingQuote(false);
    }
  };

  const fetchSwapData = async () => {
    console.log("🔄 Swap button clicked");
    console.log("Current state:", {
      fromToken,
      toToken,
      amount,
      address,
      chainId,
    });

    if (!address) {
      setSwapError("Please connect your wallet first");
      return;
    }

    try {
      setSwapError(null);
      setIsSwapping(true);
      setSwapData(null);

      if (!fromTokenInfo || !toTokenInfo) {
        console.error("❌ Missing token info:", { fromTokenInfo, toTokenInfo });
        setSwapError("Invalid token selection");
        return;
      }

      console.log("💱 Token info:", {
        fromToken: {
          address: fromToken,
          symbol: fromTokenInfo.symbol,
          decimals: fromTokenInfo.decimals,
        },
        toToken: {
          address: toToken,
          symbol: toTokenInfo.symbol,
          decimals: toTokenInfo.decimals,
        },
      });

      const amountBigInt = parseUnits(amount || "0", fromTokenInfo.decimals).toString();
      console.log("💰 Amount:", {
        raw: amount,
        decimals: fromTokenInfo.decimals,
        bigInt: amountBigInt,
      });

      if (amountBigInt === "0") {
        setSwapError("Please enter an amount");
        return;
      }

      // Validate addresses before proceeding
      if (!fromToken || !toToken) {
        console.error("❌ Missing token addresses:", { fromToken, toToken });
        setSwapError("Token addresses are required");
        return;
      }

      if (!address) {
        console.error("❌ Missing wallet address");
        setSwapError("Wallet address is required");
        return;
      }

      console.log("🔍 Validating addresses:", {
        fromToken,
        toToken,
        walletAddress: address,
      });

      // Step 1: Check allowance first
      if (fromToken !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        console.log("🔍 Checking token allowance...");
        const allowanceResponse = await fetch(
          `/api/inch/swap?` +
            new URLSearchParams({
              chainId: chainId.toString(),
              action: "allowance",
              fromTokenAddress: fromToken,
              walletAddress: address,
            }),
        );

        const allowanceData = await allowanceResponse.json();
        console.log("✅ Allowance data:", allowanceData);

        if (!allowanceResponse.ok) {
          console.error("❌ Allowance check failed:", allowanceData);
          setSwapError(allowanceData.description || allowanceData.error || "Failed to check allowance");
          return;
        }

        // If allowance is insufficient, get approval data and execute approval
        const currentAllowance = BigInt(allowanceData.allowance || "0");
        const requiredAmount = BigInt(amountBigInt);

        console.log("💭 Allowance check:", {
          current: currentAllowance.toString(),
          required: requiredAmount.toString(),
          needsApproval: currentAllowance < requiredAmount,
        });

        if (currentAllowance < requiredAmount) {
          console.log("📝 Requesting approval data...");
          const approvalResponse = await fetch(
            `/api/inch/swap?` +
              new URLSearchParams({
                chainId: chainId.toString(),
                action: "approve",
                fromTokenAddress: fromToken,
                amount: amountBigInt,
              }),
          );

          const approvalData = await approvalResponse.json();
          console.log("✅ Approval data:", approvalData);

          if (!approvalResponse.ok) {
            console.error("❌ Approval request failed:", approvalData);
            setSwapError(approvalData.description || approvalData.error || "Failed to get approval data");
            return;
          }

          try {
            console.log("🔓 Executing approval transaction...");
            // Execute the approval transaction
            const approveTx = await approveToken({
              abi: erc20Abi,
              address: fromToken as `0x${string}`,
              functionName: "approve",
              args: [approvalData.spender, approvalData.amount || amountBigInt],
            });
            console.log("✅ Approval transaction sent:", approveTx);
          } catch (error) {
            console.error("❌ Approval transaction failed:", error);
            setSwapError(error instanceof Error ? error.message : "Failed to approve token");
            return;
          }
        }
      }

      // Step 2: Get swap transaction data
      console.log("📊 Requesting swap quote...");
      console.log("📊 Requesting swap quote with params:", {
        chainId,
        fromToken,
        toToken,
        amount: amountBigInt,
        address,
      });

      const swapResponse = await fetch(
        `/api/inch/swap?` +
          new URLSearchParams({
            chainId: chainId.toString(),
            src: fromToken,
            dst: toToken,
            amount: amountBigInt,
            from: address,
            slippage: "1",
          }),
      );

      const swapData = await swapResponse.json();
      console.log("📈 Raw swap quote:", swapData);

      if (!swapResponse.ok || !swapData || !swapData.tx) {
        console.error("❌ Invalid swap response:", { swapData, status: swapResponse.status });
        throw new Error("Failed to get valid swap data from API");
      }

      if (!swapResponse.ok) {
        throw new Error(swapData.description || swapData.error || "Failed to get swap data");
      }

      // Validate the swap data structure
      if (!swapData.tx || !swapData.toAmount) {
        console.error("Invalid swap data structure:", swapData);
        throw new Error("Invalid swap data received from API");
      }

      const toAmount = swapData.toAmount;

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

      // Step 3: Execute the swap transaction
      try {
        console.log("🔄 Preparing swap transaction...");
        console.log("📝 Transaction data:", swapData.tx);

        // Prepare transaction request
        const txRequest = {
          to: swapData.tx.to as `0x${string}`,
          data: swapData.tx.data as `0x${string}`,
          value: swapData.tx.value ? BigInt(swapData.tx.value) : BigInt(0),
        };

        console.log("🔐 Requesting wallet signature...");
        console.log("📤 Transaction request:", {
          to: txRequest.to,
          value: txRequest.value.toString(),
          dataLength: txRequest.data.length,
        });
        const hash = await sendTransactionAsync(txRequest);
        console.log("✅ Transaction sent! Hash:", hash);

        // Update UI or show success message
        setSwapError(null);
        if (onSwapComplete) {
          onSwapComplete(safeFormatUnits(toAmount, toTokenInfo?.decimals));
        }
      } catch (error) {
        console.error("❌ Transaction failed:", error);
        setSwapError(error instanceof Error ? error.message : "Failed to send transaction");
      } finally {
        setIsSwapping(false);
      }
    } catch (error) {
      console.error("Error in swap process:", error);
      setSwapError(error instanceof Error ? error.message : "Failed to execute swap");
      setSwapData(null);
    } finally {
      setIsSwapping(false);
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
    <div className="flex flex-col gap-4 p-4 bg-base-100 rounded-xl border-2 border-green-500">
      <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <span className="flex items-center justify-center bg-green-500 text-white rounded-full w-8 h-8 text-lg font-bold">
          1
        </span>
        Swap to ETH
      </h2>

      {/* Chain Selector */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Select Chain</h3>
        <div className="flex flex-wrap gap-3">
          {SUPPORTED_CHAINS.map(chain => (
            <button
              key={chain.id}
              onClick={() => handleChainChange(chain.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
                ${chainId === chain.id ? "bg-primary text-primary-content" : "bg-base-200 hover:bg-base-300"}`}
            >
              <span>{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          ))}
        </div>
      </div>

      {!address && (
        <div className="alert alert-warning">
          <span>Please connect your wallet to swap tokens</span>
        </div>
      )}

      {(swapError || balanceError) && (
        <div className="alert alert-error">
          <span>{swapError || balanceError}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm">From Token</label>
          {!fromToken ? (
            <span className="text-sm">Balance: 0</span>
          ) : loadingFromBalance ? (
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
          {!fromToken ? (
            <span className="text-sm">Balance: 0 ETH</span>
          ) : loadingToBalance ? (
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

      <button className="btn btn-primary" onClick={fetchSwapData} disabled={!fromToken || !amount || isSwapping}>
        {isSwapping ? "Loading..." : "Swap to ETH"}
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
