import { NextResponse } from "next/server";

const INCH_API_URL = "https://api.1inch.dev";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId");
    const action = searchParams.get("action"); // 'quote' or 'swap'
    const params = Object.fromEntries(searchParams.entries());

    if (!chainId || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_1INCH_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Remove our custom parameters from the forwarded query
    delete params.chainId;
    delete params.action;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    const response = await fetch(`${INCH_API_URL}/swap/v5.2/${chainId}/${action}?${queryString}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Swap proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch swap data" }, { status: 500 });
  }
}
