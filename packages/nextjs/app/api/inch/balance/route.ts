import { NextResponse } from "next/server";

const INCH_BALANCE_API_URL = "https://api.1inch.dev/balance/v1.2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId");
    const address = searchParams.get("address");
    const tokens = searchParams.get("tokens");

    console.log("Balance API request params:", { chainId, address, tokens });

    if (!chainId || !address || !tokens) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_1INCH_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const apiUrl = `${INCH_BALANCE_API_URL}/${chainId}/balances/${address}?tokens=${tokens}`;
    console.log("Calling 1inch API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("1inch API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.description || "Failed to fetch balance" },
          { status: response.status },
        );
      } catch {
        return NextResponse.json(
          { error: `API Error: ${response.status} ${response.statusText}` },
          { status: response.status },
        );
      }
    }

    const data = await response.json();
    console.log("1inch API response:", data);

    // Transform the response to match expected format
    const transformedData = {
      balances: {
        [tokens.toLowerCase()]: data[tokens.toLowerCase()] || "0",
      },
    };

    console.log("Transformed response:", transformedData);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Balance proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
