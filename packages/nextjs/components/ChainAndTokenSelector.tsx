"use client";

import React, { useState } from "react";

export type Chain = {
  id: number;
  name: string;
  icon: string;
};

// Supported chains for 1inch swaps
export const SUPPORTED_CHAINS: Chain[] = [
  { id: 8453, name: "Base", icon: "🔵" },
  { id: 42161, name: "Arbitrum", icon: "🔷" },
  { id: 58008, name: "Zircuit", icon: "⚡" },
];

type ChainSelectorProps = {
  onChainChange: (chainId: number) => void;
  initialChainId?: number;
};

export const ChainSelector: React.FC<ChainSelectorProps> = ({ onChainChange, initialChainId = 8453 }) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(initialChainId);

  const handleChainChange = (chainId: number) => {
    setSelectedChainId(chainId);
    onChainChange(chainId);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Select Chain</h2>
      <div className="flex flex-wrap gap-3">
        {SUPPORTED_CHAINS.map(chain => (
          <button
            key={chain.id}
            onClick={() => handleChainChange(chain.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition 
              ${selectedChainId === chain.id ? "bg-primary text-primary-content" : "bg-base-200 hover:bg-base-300"}`}
          >
            <span>{chain.icon}</span>
            <span>{chain.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
