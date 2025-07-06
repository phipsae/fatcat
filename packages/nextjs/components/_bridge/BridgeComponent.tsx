"use client";

import { useEffect, useState } from "react";
import { EtherInput } from "../scaffold-eth";
import { optionsInBytes } from "./optionsInBytes";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const BridgeComponent = ({ endpoint, address }: { endpoint: number; address: string }) => {
  const [ethAmount, setEthAmount] = useState<string>("0");
  const [options, setOptions] = useState<string>("");

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "SkinnyCatArbitrum",
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

  const { data: bridgeQuote } = useScaffoldReadContract({
    contractName: "SkinnyCatArbitrum",
    functionName: "quoteSendEth",
    args: [endpoint, getEthAmountInWei(), address, `0x${options}`, false],
  });

  useEffect(() => {
    setOptions(optionsInBytes(ethAmount));
  }, [ethAmount]);

  return (
    <div>
      BridgeComponent
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Amount to Bridge (ETH)</label>
        <EtherInput value={ethAmount} onChange={setEthAmount} placeholder="Enter ETH amount" />
      </div>
      <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await writeYourContractAsync({
              functionName: "sendEth",
              args: [40232, getEthAmountInWei(), address, `0x${options}`],
              value: bridgeQuote?.nativeFee ?? 0n,
            });
          } catch (e) {
            console.error("Error setting greeting:", e);
          }
        }}
      >
        Bridge {ethAmount} ETH
      </button>
      <button onClick={() => console.log(`0x${options}`)}>Options</button>
    </div>
  );
};
