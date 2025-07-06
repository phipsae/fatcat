"use client";

import { BridgeComponent } from "./_bridge/BridgeComponent";
import { BridgeComponentBase } from "./_bridge/BridgeComponentBase";
import { useChainId } from "wagmi";

interface BridgingProps {
  onDeposit: () => void;
  swapAmount?: string;
  chainId: number;
  address: string;
}

export const Bridging: React.FC<BridgingProps> = ({ address }) => {
  const currentChainId = useChainId();
  // const { address } = useAccount();
  // const [amount, setAmount] = useState(swapAmount);
  // const [isDepositing, setIsDepositing] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);

  // Update amount when swapAmount changes
  // useEffect(() => {
  //   setAmount(swapAmount);
  //   setIsSuccess(false);
  // }, [swapAmount]);

  // // Reset state when chain changes
  // useEffect(() => {
  //   setAmount("0");
  //   setIsSuccess(false);
  //   setIsDepositing(false);
  // }, [chainId]);

  // const handleDeposit = async () => {
  //   setIsDepositing(true);
  //   try {
  //     onDeposit();
  //     console.log("Depositing and feeding cat...");
  //     setAmount("0");
  //     setIsSuccess(true);
  //   } catch (error) {
  //     console.error("Error depositing:", error);
  //   } finally {
  //     setIsDepositing(false);
  //   }
  // };

  // Function to render content based on chain ID
  const renderContent = () => {
    switch (currentChainId) {
      case 48900:
        return (
          <div className="alert alert-warning flex items-center justify-center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="font-semibold">Please switch to another network</span>
            </div>
          </div>
        );
      case 42161:
        return <BridgeComponent endpoint={30303} address={address} />;
      case 8453:
        return <BridgeComponentBase endpoint={30303} address={address} />;
      default:
        return (
          <div className="alert alert-info">
            <span>Unsupported network. Please switch to a supported network.</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-green-500 rounded-xl p-6 bg-base-200 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <span className="flex items-center justify-center bg-green-500 text-white rounded-full w-8 h-8 text-lg font-bold">
            2
          </span>
          Bridge to Zircuit to save!
        </h2>
        <div className="flex flex-col gap-4">{renderContent()}</div>
      </div>
    </div>
  );
};
