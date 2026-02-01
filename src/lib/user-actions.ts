"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Podaj obecne hasło"),
  newPassword: z.string().min(6, "Nowe hasło musi mieć min. 6 znaków"),
});

const ChangeEmailSchema = z.object({
  newEmail: z.string().email("Nieprawidłowy email"),
  password: z.string().min(1, "Podaj hasło do potwierdzenia"),
});

export async function changePassword(data: z.infer<typeof ChangePasswordSchema>) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Nie jesteś zalogowany" };

  const result = ChangePasswordSchema.safeParse(data);
  if (!result.success) return { error: result.error.issues[0].message };

  const { currentPassword, newPassword } = result.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return { error: "Użytkownik nie istnieje" };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Obecne hasło jest nieprawidłowe" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function changeEmail(data: z.infer<typeof ChangeEmailSchema>) {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Nie jesteś zalogowany" };
  
    const result = ChangeEmailSchema.safeParse(data);
    if (!result.success) return { error: result.error.issues[0].message };
  
    const { newEmail, password } = result.data;
  
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "Użytkownik nie istnieje" };
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: "Hasło jest nieprawidłowe" };

    // Check if email taken
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) return { error: "Ten email jest już zajęty" };
  
    // Update email - strictly speaking we should verify it again, but for MVP let's allow direct change
    // or set verified to null.
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
          email: newEmail,
          // If we want to force re-verification:
          // emailVerified: null 
          // But that would lock them out if we strictly enforce verified login. 
          // Let's keep it simple for user request: just change it.
      },
    });
  
    return { success: true };
  }
