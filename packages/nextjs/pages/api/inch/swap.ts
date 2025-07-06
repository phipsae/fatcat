import { NextApiRequest, NextApiResponse } from "next";

const INCH_API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { chainId, src, dst, amount, from, slippage } = req.query;

    if (!chainId || !src || !dst || !amount || !from) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const response = await fetch(
      `https://api.1inch.dev/swap/v5.2/${chainId}/swap?` +
        new URLSearchParams({
          src: src as string,
          dst: dst as string,
          amount: amount as string,
          from: from as string,
          slippage: (slippage || "1") as string,
        }),
      {
        headers: {
          Authorization: `Bearer ${INCH_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Swap API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
