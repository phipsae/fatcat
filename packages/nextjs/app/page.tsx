"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { formatEther } from "viem";
import { zircuit } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";
import { Bridging } from "~~/components/Bridging";
import { FatCat } from "~~/components/FatCat";
import { TokenSwap } from "~~/components/TokenSwap";
import { Vault } from "~~/components/Vault";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [weight, setWeight] = useState(1);
  const [chainId, setChainId] = useState(8453);
  const [swapAmount, setSwapAmount] = useState("0");

  // Get contract info for fetching user balance
  const { data: fatCatZircuitContract } = useDeployedContractInfo({
    contractName: "FatCatZircuit" as any,
    chainId: zircuit.id,
  });

  // Get user's vault balance
  const { data: userBalance } = useReadContract({
    abi: fatCatZircuitContract?.abi,
    address: fatCatZircuitContract?.address,
    functionName: "getUserBalance",
    chainId: zircuit.id,
    args: address ? [address] : undefined,
    query: {
      enabled: !!(fatCatZircuitContract?.abi && fatCatZircuitContract?.address && address),
    },
  });

  // Calculate weight based on balance (1 weight per 0.00001 ETH)
  useEffect(() => {
    if (userBalance) {
      const balanceInEth = Number(formatEther(userBalance as bigint));
      const calculatedWeight = Math.floor(balanceInEth / 0.00001);
      // Clamp between 1 and 10
      const clampedWeight = Math.min(Math.max(calculatedWeight, 1), 10);
      setWeight(clampedWeight);
    }
  }, [userBalance]);

  const feedCat = () => setWeight(w => Math.min(w + 1, 10));
  const resetCat = () => setWeight(1);

  // Handle chain change
  const handleChainChange = (newChainId: number) => {
    setChainId(newChainId);
  };

  // Handle swap completion
  const handleSwapComplete = (amount: string) => {
    setSwapAmount(amount);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Feed your cat on Zircuit</h1>
      <p className="text-gray-600 text-lg mb-6 text-center">
        Bridge your leftover tokens from other L2s to make your cat fatter.
      </p>

      {/* Add Vault component */}
      <Vault onWithdrawAll={resetCat} />

      <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full max-w-7xl">
        {/* Left: Token Swap with Chain Selector */}
        <div className="w-full max-w-md flex flex-col gap-6">
          <TokenSwap onChainChange={handleChainChange} initialChainId={chainId} onSwapComplete={handleSwapComplete} />
        </div>

        <div className="w-full max-w-md">
          <Bridging onDeposit={() => feedCat()} swapAmount={swapAmount} chainId={chainId} address={address ?? ""} />
        </div>

        {/* Right: FatCat */}
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <FatCat weight={weight} />

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              Fat level automatically updates based on your vault balance!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
