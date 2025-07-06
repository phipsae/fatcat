"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
//import { useAccount } from "wagmi";
import { Bridging } from "~~/components/Bridging";
import { FatCat } from "~~/components/FatCat";
import { TokenSwap } from "~~/components/TokenSwap";
import { Vault } from "~~/components/Vault";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [weight, setWeight] = useState(1);
  const [chainId, setChainId] = useState(8453);
  const [swapAmount, setSwapAmount] = useState("0");

  const feedCat = () => setWeight(w => Math.min(w + 1, 10));
  const exerciseCat = () => setWeight(w => Math.max(w - 1, 1));
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
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Turn Your Crypto Dust into Yield</h1>
      <p className="text-gray-600 text-lg mb-6 text-center">
        Bridge your leftover tokens from other L2s and start earning on Zircuit.
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

          <div className="flex gap-2">
            <button onClick={feedCat} className="px-4 py-2 bg-green-500 text-white rounded">
              🍗 Feed Cat
            </button>
            <button onClick={exerciseCat} className="px-4 py-2 bg-red-500 text-white rounded">
              🏃 Exercise Cat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
