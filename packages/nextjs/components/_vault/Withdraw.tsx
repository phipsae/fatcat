"use client";

import { optimismSepolia } from "viem/chains";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const Withdraw = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: fatCatOptimismContract } = useDeployedContractInfo({
    contractName: "FatCatOptimism" as any,
    chainId: optimismSepolia.id,
  });

  const { data: userBalance, error: userBalanceError } = useReadContract({
    abi: fatCatOptimismContract?.abi,
    address: fatCatOptimismContract?.address,
    functionName: "getUserBalance",
    chainId: optimismSepolia.id,
    args: connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: !!(fatCatOptimismContract?.abi && fatCatOptimismContract?.address && connectedAddress),
    },
  });

  // Log error for debugging
  if (userBalanceError) {
    console.error("User balance error:", userBalanceError);
  }

  //   const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
  //     contractName: "FatCatOptimism" as any,
  //   });

  return (
    <button
      className="btn btn-primary"
      onClick={() =>
        writeContract({
          abi: fatCatOptimismContract?.abi,
          address: fatCatOptimismContract?.address,
          chainId: optimismSepolia.id,
          functionName: "withdraw",
          args: [userBalance as bigint],
        })
      }
    >
      Withdraw all
    </button>
  );
};
