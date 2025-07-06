"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

interface VaultProps {
  onWithdrawAll: () => void;
}

export const Vault: React.FC<VaultProps> = ({ onWithdrawAll }) => {
  const { address } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isHammerFlying, setIsHammerFlying] = useState(false);
  const [hasWithdrawnAll, setHasWithdrawnAll] = useState(false);
  const [lastKnownBalance, setLastKnownBalance] = useState<bigint>(0n);
  const hammerRef = useRef<HTMLDivElement>(null);

  // Mock vault balance for now - replace with actual contract balance later
  const { data: balance } = useBalance({
    address: address,
  });

  // Track balance changes to detect new deposits
  useEffect(() => {
    if (balance?.value) {
      // If we have withdrawn all and see a new, higher balance, enable the withdraw all button
      if (hasWithdrawnAll && balance.value > lastKnownBalance) {
        setHasWithdrawnAll(false);
      }
      setLastKnownBalance(balance.value);
    }
  }, [balance?.value, hasWithdrawnAll, lastKnownBalance]);

  const animateCatHead = () => {
    const catHead = document.querySelector('img[alt="Cat Head"]') as HTMLElement;
    if (catHead) {
      const headContainer = catHead.parentElement;
      if (headContainer) {
        // Add keyframe animation class
        headContainer.style.animation = "none"; // Reset animation
        void headContainer.offsetHeight; // Trigger reflow
        headContainer.style.animation = "catHeadShake 1.5s cubic-bezier(0.36, 0, 0.66, -0.56)";
        // Remove animation after it's done
        setTimeout(() => {
          headContainer.style.animation = "none";
        }, 1500);
      }
    }
  };

  const handleWithdrawAll = async () => {
    if (hammerRef.current) {
      setIsWithdrawing(true);
      setIsHammerFlying(true);
      // Get the hammer and cat positions
      const hammer = hammerRef.current;
      const withdrawButton = document.querySelector(".btn-error") as HTMLElement;
      const catBelly = document.querySelector('img[alt="Cat Belly"]') as HTMLElement;

      if (catBelly && withdrawButton) {
        const bellyRect = catBelly.getBoundingClientRect();
        const buttonRect = withdrawButton.getBoundingClientRect();

        // Position hammer at the button center
        hammer.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        hammer.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

        // Calculate the distance to move - aim for the center of the belly
        const targetX = bellyRect.left + bellyRect.width / 2;
        const targetY = bellyRect.top + bellyRect.height / 2;

        // Apply the animation with a smoother transition
        hammer.style.transition = "transform 2s cubic-bezier(0.4, 0, 0.2, 1), left 0s, top 0s";
        hammer.style.transform = `translate(${targetX - (buttonRect.left + buttonRect.width / 2)}px, ${targetY - (buttonRect.top + buttonRect.height / 2)}px) rotate(720deg)`;

        // Add a bounce animation to the belly
        const bellyContainer = catBelly.parentElement;
        if (bellyContainer) {
          bellyContainer.style.transition = "transform 0.8s ease-in-out";
          bellyContainer.style.transform = "scale(0.95)";
          setTimeout(() => {
            bellyContainer.style.transform = "scale(1.05)";
            // Animate the head when the belly expands
            animateCatHead();
            setTimeout(() => {
              bellyContainer.style.transform = "none";
              // Reset cat weight after the animation
              onWithdrawAll();
              // Mark that we've withdrawn all funds
              setHasWithdrawnAll(true);
            }, 800);
          }, 800);
        }
      }

      // Reset after animation
      setTimeout(() => {
        setIsHammerFlying(false);
        setIsWithdrawing(false);
        if (hammer) {
          hammer.style.transition = "none";
          hammer.style.transform = "none";
        }
      }, 2500);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes catHeadShake {
          0% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(-15deg);
          }
          30% {
            transform: rotate(10deg);
          }
          45% {
            transform: rotate(-10deg);
          }
          60% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-3deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="border-2 border-green-500 rounded-xl p-6 bg-base-200 shadow-xl relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <div className="relative w-32 h-32">
                <Image src="/vault.png" alt="Vault" className="rounded-lg object-cover" fill priority />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Your Vault Position</h2>
              <div className="stats bg-base-100 shadow flex flex-col items-center">
                <div className="stat text-center">
                  <div className="stat-title">Total Deposited</div>
                  <div className="stat-value text-green-500">
                    {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ETH` : "0 ETH"}
                  </div>
                  <div className="mt-4">
                    <div className="relative" style={{ zIndex: 1 }}>
                      <button
                        className="btn btn-error w-40"
                        onClick={handleWithdrawAll}
                        disabled={
                          !address || isWithdrawing || !balance?.value || balance.value === 0n || hasWithdrawnAll
                        }
                        style={{ cursor: hasWithdrawnAll ? "not-allowed" : "url(/hammer.png), pointer" }}
                      >
                        {hasWithdrawnAll ? "Vault Empty" : "Withdraw All"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Hammer container moved outside the button container for better z-index handling */}
          <div
            ref={hammerRef}
            className={`fixed transition-all duration-2000 ${isHammerFlying ? "opacity-100" : "opacity-0"}`}
            style={{
              width: "32px",
              height: "32px",
              zIndex: 9999,
              transform: "rotate(0deg)",
              transformOrigin: "center",
              pointerEvents: "none",
            }}
          >
            <Image src="/hammer.png" alt="Hammer" width={32} height={32} className="object-contain" />
          </div>
        </div>
      </div>
    </>
  );
};
