import { Address } from "../scaffold-eth";
import { formatEther } from "viem";
import { optimismSepolia } from "viem/chains";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const VaultComponent = () => {
  const { address: connectedAddress } = useAccount();

  // Get contract info from externalContracts.ts
  const { data: fatCatOptimismContract } = useDeployedContractInfo({
    contractName: "FatCatOptimism" as any,
    chainId: optimismSepolia.id,
  });

  // Get the contract's ETH balance using the address from contract info
  const { data: vaultBalance } = useBalance({
    address: fatCatOptimismContract?.address,
    chainId: optimismSepolia.id,
  });

  const {
    data: userBalance,
    isLoading: isUserBalanceLoading,
    error: userBalanceError,
  } = useReadContract({
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

  // Successfully calling getUserBalance function from FatCatOptimism contract

  //   const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
  //     contractName: "FatCat",
  //   });

  //   const { data: bridgeQuote } = useScaffoldReadContract({
  //     contractName: "FatCatOptimism",
  //     functionName: "quoteSendString",
  //     args: [40232, "send", `0x${options}`, false],
  //   });

  return (
    <div>
      <div>VaultComponent</div>
      <div>
        Connected Address: <Address address={connectedAddress} />
      </div>
      <div>
        Contract Address: <Address address={fatCatOptimismContract?.address} />
      </div>
      <div>Total Value Locked in Vault: {vaultBalance ? formatEther(vaultBalance.value) : "0"} ETH</div>
      <div>
        My Balance:{" "}
        {!connectedAddress
          ? "Please connect wallet"
          : isUserBalanceLoading
            ? "Loading..."
            : userBalanceError
              ? `Error loading balance: ${userBalanceError.message || "Unknown error"}`
              : userBalance
                ? formatEther(userBalance as bigint)
                : "0"}{" "}
        ETH
      </div>
      {/* <button onClick={() => console.log(`0x${options}`)}>Options</button> */}
    </div>
  );
};
