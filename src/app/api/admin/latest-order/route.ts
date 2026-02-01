
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const latestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, fullName: true, total: true }
  });

  return NextResponse.json({ latestOrder });
}
