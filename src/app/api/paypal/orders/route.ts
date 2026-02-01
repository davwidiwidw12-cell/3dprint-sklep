import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required." },
        { status: 400 }
      );
    }

    const { jsonResponse, httpStatusCode } = await createPayPalOrder(Number(amount));
    
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
