"use client";

import { useState } from "react";
import { ChainAndTokenSelector } from "~~/components/ChainAndTokenSelector";
import { FatCat } from "~~/components/FatCat";

// Mock data
const chains = [
  { id: 1, name: "Arbitrum", icon: "🌀" },
  { id: 2, name: "Optimism", icon: "🔴" },
  { id: 3, name: "Base", icon: "🟦" },
  { id: 4, name: "Scroll", icon: "🟡" },
];

const tokens = [
  { symbol: "DAI", balance: 12.34 },
  { symbol: "USDC", balance: 9.87 },
  { symbol: "WETH", balance: 5.67 },
  { symbol: "OP", balance: 2.11 },
  { symbol: "ARB", balance: 1.23 },
];

export default function Home() {
  const [weight, setWeight] = useState(1);
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const feedCat = () => setWeight(w => Math.min(w + 1, 10));
  const exerciseCat = () => setWeight(w => Math.max(w - 1, 1));

  const handleSelectionChange = (chain: any, tokens: string[]) => {
    setSelectedChain(chain);
    setSelectedTokens(tokens);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Piggy Fat Cat</h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-6xl">
        {/* Left: Chain and Token Selector */}
        <div className="w-full max-w-md">
          <ChainAndTokenSelector chains={chains} tokens={tokens} onSelectionChange={handleSelectionChange} />
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

          {selectedTokens.length > 0 && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                {selectedTokens.length} token{selectedTokens.length > 1 ? "s" : ""} selected from{" "}
                {selectedChain?.name || "a chain"} — cat is ready to bridge!
              </p>
              <button onClick={feedCat} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                Bridge & Feed Cat 🪄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
