import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { markOrderAsPaid } from "@/lib/orders"; // Assuming this exists or I will create/update logic

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderID: string }> }
) {
  try {
    const { orderID } = await params;
    
    // 1. Capture PayPal Payment
    const { jsonResponse, httpStatusCode } = await capturePayPalOrder(orderID);
    
    // 2. If successful, update our internal order status?
    // Actually, the frontend calls capture, gets success, then might call our backend to finalize.
    // BUT the best way is to do it here.
    // However, we need to know WHICH internal order corresponds to this PayPal order.
    // The current flow in CheckoutPage is:
    // 1. Create Internal Order (status: PENDING)
    // 2. User pays via PayPal
    // 3. Update Internal Order (status: PAID)
    
    // The frontend sends "create order" to PayPal, gets a PayPal ID.
    // We don't link them yet in the DB until capture?
    // Or we can store PayPal Order ID in our DB.
    
    // Let's stick to returning the capture result.
    // The frontend will handle the "Mark as Paid" logic via existing server action `markOrderAsPaid`
    // OR we can do it here if we pass our internal order ID in the body?
    // But PayPal API doesn't know our internal ID unless we stored it in custom_id field.
    
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error: any) {
    console.error("Failed to capture order:", error);
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 }
    );
  }
}
