import { Options } from "@layerzerolabs/lz-v2-utilities";
import { parseEther } from "viem";

export const optionsInBytes = (ethAmount: string) => {
  // Helper function to safely convert ETH amount to wei
  const getEthAmountInWei = () => {
    try {
      if (!ethAmount || ethAmount === "" || ethAmount === "0" || ethAmount === "0.") {
        return 0n;
      }
      return parseEther(ethAmount);
    } catch {
      console.warn("Invalid ETH amount:", ethAmount);
      return 0n;
    }
  };

  const optionsBuilder = Options.newOptions().addExecutorLzReceiveOption(300000, getEthAmountInWei());
  const bytes = optionsBuilder.toBytes();
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};
