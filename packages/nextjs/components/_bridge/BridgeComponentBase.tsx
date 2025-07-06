"use client";

import { useEffect, useState } from "react";
import { EtherInput } from "../scaffold-eth";
import { optionsInBytes } from "./optionsInBytes";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { useReadContract, useWriteContract } from "wagmi";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";

export const BridgeComponentBase = ({ endpoint, address }: { endpoint: number; address: string }) => {
  const { writeContractAsync } = useWriteContract();
  const writeTx = useTransactor();

  const [ethAmount, setEthAmount] = useState<string>("0");
  const [options, setOptions] = useState<string>("");
  const [isTransacting, setIsTransacting] = useState<boolean>(false);

  const { data: SkinnyCatBaseContract } = useDeployedContractInfo({
    contractName: "SkinnyCatBase" as any,
    chainId: baseSepolia.id,
  });

  // Helper function to safely convert ETH amount to wei
  const getEthAmountInWei = () => {
    try {
      if (!ethAmount || ethAmount === "" || ethAmount === "0" || ethAmount === "0.") {
        return 0n;
      }
      return parseEther(ethAmount);
    } catch {
      console.warn("Invalid ETH amount:", ethAmount);
      return 0n;
    }
  };

  // Debug logs
  console.log("Debug Info:", {
    contractData: SkinnyCatBaseContract,
    endpoint,
    address,
    ethAmount,
    options,
    enabled: !!(SkinnyCatBaseContract?.abi && SkinnyCatBaseContract?.address && address),
  });

  const {
    data: bridgeQuote,
    error,
    isLoading,
  } = useReadContract({
    abi: SkinnyCatBaseContract?.abi,
    address: SkinnyCatBaseContract?.address,
    functionName: "quoteSendEth",
    // chainId: baseSepolia.id,
    args: [endpoint, getEthAmountInWei(), address, `0x${options}`, false],
    query: {
      enabled: !!(SkinnyCatBaseContract?.abi && SkinnyCatBaseContract?.address && address),
    },
  });

  console.log("Quote result:", { bridgeQuote, error, isLoading });

  useEffect(() => {
    setOptions(optionsInBytes(ethAmount));
  }, [ethAmount]);

  return (
    <div>
      BridgeComponent BASE SEPOLIA
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Amount to Bridge (ETH)</label>
        <EtherInput value={ethAmount} onChange={setEthAmount} placeholder="Enter ETH amount" />
      </div>
      {!!bridgeQuote && (
        <button className="btn btn-primary" onClick={() => console.log((bridgeQuote as any).nativeFee)}>
          Quote
        </button>
      )}
      {error && <div className="text-red-500">Error: {error.message}</div>}
      {isLoading && <div className="text-blue-500">Loading quote...</div>}
      {!!bridgeQuote && (
        <button
          className="btn btn-primary"
          disabled={isTransacting}
          onClick={async () => {
            if (!SkinnyCatBaseContract?.abi || !SkinnyCatBaseContract?.address) {
              console.error("Contract not found");
              return;
            }

            const makeWriteWithParams = () =>
              writeContractAsync({
                abi: SkinnyCatBaseContract.abi,
                address: SkinnyCatBaseContract.address,
                chainId: baseSepolia.id,
                functionName: "sendEth",
                args: [endpoint, getEthAmountInWei(), address, `0x${options}`],
                value: (bridgeQuote as any)?.nativeFee ?? 0n,
              });

            try {
              setIsTransacting(true);
              await writeTx(makeWriteWithParams);
            } catch (error) {
              console.error("Transaction failed:", error);
            } finally {
              setIsTransacting(false);
            }
          }}
        >
          {isTransacting ? "Bridging..." : `Bridge ${ethAmount} ETH`}
        </button>
      )}
    </div>
  );
};
