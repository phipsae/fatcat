"use client";

import { zircuit } from "viem/chains";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const Withdraw = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: fatCatZircuitContract } = useDeployedContractInfo({
    contractName: "FatCatZircuit" as any,
    chainId: zircuit.id,
  });

  const { data: userBalance, error: userBalanceError } = useReadContract({
    abi: fatCatZircuitContract?.abi,
    address: fatCatZircuitContract?.address,
    functionName: "getUserBalance",
    chainId: zircuit.id,
    args: connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: !!(fatCatZircuitContract?.abi && fatCatZircuitContract?.address && connectedAddress),
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
          abi: fatCatZircuitContract?.abi,
          address: fatCatZircuitContract?.address,
          chainId: zircuit.id,
          functionName: "withdraw",
          args: [userBalance as bigint],
        })
      }
    >
      Withdraw all
    </button>
  );
};
