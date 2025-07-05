"use client";

import React, { useState } from "react";

type Chain = {
  id: number;
  name: string;
  icon: string; // URL or emoji
};

type Token = {
  symbol: string;
  balance: number;
};

type ChainAndTokenSelectorProps = {
  chains: Chain[];
  tokens: Token[];
  onSelectionChange: (chain: Chain | null, selectedTokens: string[]) => void;
};

export const ChainAndTokenSelector: React.FC<ChainAndTokenSelectorProps> = ({ chains, tokens, onSelectionChange }) => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const handleChainChange = (chainId: number) => {
    const chain = chains.find(c => c.id === chainId) || null;
    setSelectedChain(chain);
    onSelectionChange(chain, selectedTokens);
  };

  const toggleToken = (symbol: string) => {
    const updated = selectedTokens.includes(symbol)
      ? selectedTokens.filter(t => t !== symbol)
      : [...selectedTokens, symbol];

    setSelectedTokens(updated);
    onSelectionChange(selectedChain, updated);
  };

  return (
    <div className="space-y-6">
      {/* Chain Selector */}
      <div>
        <h2 className="text-lg font-semibold mb-2">1. Choose Your Chain</h2>
        <div className="flex flex-wrap gap-3">
          {chains.map(chain => (
            <button
              key={chain.id}
              onClick={() => handleChainChange(chain.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition 
                ${selectedChain?.id === chain.id ? "bg-blue-600 text-white" : "bg-white border-gray-300 hover:bg-gray-100"}`}
            >
              <span>{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Token Selector */}
      <div>
        <h2 className="text-lg font-semibold mb-2">2. Select Tokens</h2>
        <div className="grid grid-cols-2 gap-4">
          {tokens.map(token => (
            <label
              key={token.symbol}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer 
                ${selectedTokens.includes(token.symbol) ? "bg-green-100 border-green-500" : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              <span>{token.symbol}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">${token.balance.toFixed(2)}</span>
                <input
                  type="checkbox"
                  checked={selectedTokens.includes(token.symbol)}
                  onChange={() => toggleToken(token.symbol)}
                  className="accent-blue-600"
                />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
