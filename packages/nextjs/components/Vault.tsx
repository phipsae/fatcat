"use client";

import { useState } from "react";
import Image from "next/image";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

export const Vault = () => {
  const { address } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock vault balance for now - replace with actual contract balance later
  const { data: balance } = useBalance({
    address: address,
  });

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      // Add withdrawal logic here
      console.log("Withdrawing...");
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="border-2 border-green-500 rounded-xl p-6 bg-base-200 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <div className="relative w-32 h-32">
              <Image src="/vault.png" alt="Vault" className="rounded-lg object-cover" fill priority />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Your Vault Position</h2>
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-title">Total Deposited</div>
                <div className="stat-value text-green-500">
                  {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ETH` : "0 ETH"}
                </div>
              </div>
            </div>
            <button
              className="btn btn-success mt-4"
              onClick={handleWithdraw}
              disabled={!address || isWithdrawing || !balance?.value || balance.value === 0n}
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
