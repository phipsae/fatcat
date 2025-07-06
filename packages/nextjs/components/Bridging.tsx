"use client";

import { useEffect, useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { useAccount } from "wagmi";

interface BridgingProps {
  onDeposit: () => void;
  swapAmount?: string;
  chainId: number;
}

export const Bridging: React.FC<BridgingProps> = ({ onDeposit, swapAmount = "0", chainId }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState(swapAmount);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update amount when swapAmount changes
  useEffect(() => {
    setAmount(swapAmount);
    setIsSuccess(false);
  }, [swapAmount]);

  // Reset state when chain changes
  useEffect(() => {
    setAmount("0");
    setIsSuccess(false);
    setIsDepositing(false);
  }, [chainId]);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      onDeposit();
      console.log("Depositing and feeding cat...");
      setAmount("0");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error depositing:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-green-500 rounded-xl p-6 bg-base-200 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <span className="flex items-center justify-center bg-primary text-primary-content rounded-full w-8 h-8 text-lg font-bold">
            2
          </span>
          Bridge to Save
        </h2>
        <div className="flex flex-col gap-4">
          {Number(amount) > 0 && !isSuccess && (
            <div className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-lg">
              Great! You are about to bridge {amount} ETH to your savings vault. With every deposit watch the
              piggy-kitty belly grow! 🐱💰
            </div>
          )}
          {isSuccess && (
            <div className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-lg animate-bounce">
              HOORAY! Your piggy kitty is getting fatter! 🎉🐱
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount to Bridge (ETH)</span>
            </label>
            <EtherInput value={amount} onChange={value => setAmount(value)} placeholder="Enter ETH amount" />
          </div>

          <button
            className="btn btn-success w-full"
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0 || !address || isDepositing || isSuccess}
          >
            {isDepositing ? "Bridging..." : "🏦 Bridge ETH"}
          </button>
        </div>
      </div>
    </div>
  );
};
