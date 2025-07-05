import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useTokenBalance = (tokenAddress: string, chainId: number = 8453) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !tokenAddress) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching balance for:", {
          chainId,
          address,
          tokenAddress,
        });

        // Use our proxy endpoint
        const response = await fetch(`/api/inch/balance?chainId=${chainId}&address=${address}&tokens=${tokenAddress}`);

        const data = await response.json();
        console.log("Balance API raw response:", data);

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // Validate response structure
        if (!data || typeof data !== "object") {
          console.error("Invalid response format:", data);
          throw new Error("Invalid response format from API");
        }

        if (!data.balances || typeof data.balances !== "object") {
          console.error("Missing balances object:", data);
          throw new Error("Response missing balances data");
        }

        const tokenBalance = data.balances[tokenAddress.toLowerCase()];
        console.log("Token balance:", tokenBalance);

        if (tokenBalance === undefined) {
          console.error("Balance not found for token:", tokenAddress);
          throw new Error("Balance not found for the specified token");
        }

        setBalance(tokenBalance);
      } catch (err) {
        console.error("Error fetching token balance:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, tokenAddress, chainId]);

  return { balance, loading, error };
};
