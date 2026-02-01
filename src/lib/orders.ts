"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const OrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(9),
  fullName: z.string().min(3),
  addressLine1: z.string().min(3), // Street or Locker ID
  city: z.string().min(2),
  postalCode: z.string().min(5),
  country: z.string().default("PL"),
  shippingMethod: z.enum(["COURIER", "LOCKER"]),
  paymentMethod: z.enum(["PAYPAL", "BLIK"]),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    name: z.string(),
    customDimensions: z.string().optional(),
    customImageUrl: z.string().optional()
  })),
  shippingCost: z.number(),
  total: z.number(),
  userId: z.string().optional(),
  notes: z.string().optional(),
});

import { sendOrderConfirmation, sendPaymentConfirmation } from "@/lib/email";
import webpush from "web-push";

// Configure Web Push (Server Side)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@example.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
}

export async function markOrderAsPaid(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID" }
  });
  
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (order) {
      await sendPaymentConfirmation(order);
  }

  revalidatePath("/admin/orders");
}

export async function createOrder(data: z.infer<typeof OrderSchema>) {
  const { items, ...orderData } = data;

  // Calculate subtotal from items to verify (security)
  // For MVP trusting client slightly but ideally we fetch prices from DB.
  // Let's trust client for now as prices are snapshots.
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Re-verify shipping logic
  const calculatedShipping = subtotal >= 200 ? 0 : 10.99;
  
  // Create Order
  const order = await prisma.order.create({
    data: {
      ...orderData,
      subtotal: subtotal,
      shippingCost: calculatedShipping,
      total: subtotal + calculatedShipping, // overwrite total with server calc
      status: "PENDING",
      paymentStatus: "UNPAID",
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          customDimensions: item.customDimensions,
          customImageUrl: item.customImageUrl
        }))
      }
    }
  });
  
  await sendOrderConfirmation(order);

  // Send Web Push to Admin(s)
  try {
      const admins = await prisma.user.findMany({
          where: { role: "ADMIN" },
          include: { pushSubscriptions: true }
      });

      const notifications = [];
      for (const admin of admins) {
          for (const sub of admin.pushSubscriptions) {
              const pushConfig = {
                  endpoint: sub.endpoint,
                  keys: {
                      auth: sub.auth,
                      p256dh: sub.p256dh
                  }
              };
              
              const payload = JSON.stringify({
                  title: "Nowe Zamówienie! 💰",
                  body: `Zamówienie od ${order.fullName} na kwotę ${Number(order.total).toFixed(2)} zł`,
                  url: `/admin/orders/${order.id}`
              });

              notifications.push(
                  webpush.sendNotification(pushConfig, payload)
                      .catch(err => {
                          if (err.statusCode === 410) {
                              // Subscription expired, remove it
                              prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(console.error);
                          }
                          console.error("Push Error:", err);
                      })
              );
          }
      }
      await Promise.all(notifications);
  } catch (error) {
      console.error("Failed to send push notifications:", error);
  }

  revalidatePath("/admin/orders");
  return { success: true, orderId: order.id };
}



export async function deleteOrder(orderId: string) {
    await prisma.order.delete({
        where: { id: orderId }
    });
    revalidatePath("/admin/orders");
}
