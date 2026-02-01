"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper function to save file
async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.name.replace(/\s/g, '-');
  const uniqueFilename = `${uniqueSuffix}-${filename}`;
  const filepath = path.join(uploadDir, uniqueFilename);

  await writeFile(filepath, buffer);
  return `/uploads/${uniqueFilename}`;
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const basePrice = Number(formData.get("basePrice"));
    // const categoryId = formData.get("categoryId") as string;
    const minOrderQuantity = Number(formData.get("minOrderQuantity")) || 1;
    const isActive = formData.get("isActive") === "on";
    
    // Attributes
    const hasMount = formData.get("hasMount") === "on";
    const isLarge = formData.get("isLarge") === "on";

    // Pricing tiers
    const pricingTiersJson = formData.get("pricingTiers") as string;
    const pricingTiers = pricingTiersJson ? JSON.parse(pricingTiersJson) : [];

    // Images handling
    const images = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    for (const image of images) {
      if (image.size > 0) {
        const url = await saveFile(image);
        imageUrls.push(url);
      }
    }

    // Create Product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now().toString().slice(-4), // Simple slug gen
        basePrice,
        // categoryId,
        minOrderQuantity,
        isActive,
        hasMount,
        isLarge,
        pricing: {
          create: pricingTiers.map((tier: any) => ({
            minQuantity: tier.minQuantity,
            price: tier.price,
          })),
        },
        images: {
          create: imageUrls.map((url) => ({
            url
          }))
        }
      },
      // include: { category: true } // Just to verify
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Błąd podczas tworzenia produktu: " + (error as Error).message);
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = Number(formData.get("basePrice"));
  // const categoryId = formData.get("categoryId") as string;
  const minOrderQuantity = Number(formData.get("minOrderQuantity")) || 1;
  const isActive = formData.get("isActive") === "on";
  
  const hasMount = formData.get("hasMount") === "on";
  const isLarge = formData.get("isLarge") === "on";

  const pricingTiersJson = formData.get("pricingTiers") as string;
  const pricingTiers = pricingTiersJson ? JSON.parse(pricingTiersJson) : [];

  // Images handling
  const images = formData.getAll("images") as File[];
  
  // If new images are uploaded, add them. 
  // NOTE: This implementation currently APPENDS new images. 
  // To allow deleting, we would need separate logic in frontend to track deleted IDs.
  // For MVP, we just add new ones. User can't delete individual images in this edit action easily without more logic.
  
  const newImageUrls: string[] = [];
  for (const image of images) {
    if (image.size > 0) {
      const url = await saveFile(image);
      newImageUrls.push(url);
    }
  }

  // Transaction to update product and replace pricing tiers
  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name,
        description,
        basePrice,
        // categoryId,
        minOrderQuantity,
        isActive,
        hasMount,
        isLarge,
      },
    });

    // Delete old pricing
    await tx.pricingTier.deleteMany({
      where: { productId: id },
    });
    
    // Handle deleted images
    const deletedImageIdsJson = formData.get("deletedImageIds") as string;
    if (deletedImageIdsJson) {
        const deletedIds = JSON.parse(deletedImageIdsJson) as string[];
        if (deletedIds.length > 0) {
            await tx.productImage.deleteMany({
                where: { 
                    id: { in: deletedIds },
                    productId: id
                }
            });
        }
    }

    // Create new pricing
    await tx.pricingTier.createMany({
      data: pricingTiers.map((tier: any) => ({
        productId: id,
        minQuantity: tier.minQuantity,
        price: tier.price,
      })),
    });

    // Add new images
    if (newImageUrls.length > 0) {
        await tx.productImage.createMany({
            data: newImageUrls.map(url => ({
                productId: id,
                url
            }))
        });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
    // With onDelete: SetNull/Cascade in schema, this might be simpler, 
    // but let's be explicit if needed.
    // If schema has onDelete: SetNull for OrderItem -> Product relation, we can just delete.
    
    await prisma.product.delete({
        where: { id }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
}


export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: {
            status,
            trackingNumber: trackingNumber || null // Allow clearing or setting
        }
    });
    revalidatePath("/admin/orders");
}

import { sendPaymentConfirmation } from "@/lib/email";

export async function approveBlikPayment(orderId: string) {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "PAID",
            paymentStatus: "PAID"
        }
    });
    
    await sendPaymentConfirmation(order);
    
    revalidatePath("/admin/orders");
}

export async function updateSettings(shippingCost: number, freeShippingThreshold: number) {
    const settings = await prisma.settings.findFirst();
    
    if (settings) {
        await prisma.settings.update({
            where: { id: settings.id },
            data: {
                shippingCost,
                freeShippingThreshold
            }
        });
    } else {
        await prisma.settings.create({
            data: {
                shippingCost,
                freeShippingThreshold
            }
        });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Update cart logic maybe? (If cart logic reads from DB in future)
}
