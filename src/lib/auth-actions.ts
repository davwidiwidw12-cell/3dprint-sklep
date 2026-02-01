"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const RegisterSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Kod musi mieć 6 cyfr"),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password } = result.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    if (existingUser.emailVerified) {
        return { error: "Ten adres email jest już zajęty" };
    } else {
        // User exists but is not verified -> Resend code (update user)
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword, // Update password in case they forgot
                name,
                verificationCode: code,
                verificationCodeExpires: expires
            }
        });
    }
  } else {
      // Create new user
      await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
            emailVerified: null,
            verificationCode: code,
            verificationCodeExpires: expires
        },
      });
  }

  // Send Email
  await sendEmail(
    email,
    "Kod weryfikacyjny - 3dprint",
    `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Weryfikacja konta 3dprint</h2>
        <p>Witaj ${name},</p>
        <p>Twój kod weryfikacyjny to:</p>
        <h1 style="letter-spacing: 5px; background: #f0f0f0; padding: 10px; display: inline-block;">${code}</h1>
        <p>Wpisz go na stronie, aby dokończyć rejestrację.</p>
        <p>Kod jest ważny przez 1 godzinę.</p>
     </div>`
  );

  return { success: true, requireVerification: true };
}

export async function verifyUser(data: z.infer<typeof VerifySchema>) {
    const result = VerifySchema.safeParse(data);
    if (!result.success) return { error: "Nieprawidłowe dane" };

    const { email, code } = result.data;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return { error: "Użytkownik nie istnieje" };
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
        if (user.emailVerified) return { error: "Konto jest już zweryfikowane" };
        return { error: "Brak kodu weryfikacyjnego. Zarejestruj się ponownie." };
    }

    if (user.verificationCode !== code) {
        return { error: "Nieprawidłowy kod weryfikacyjny" };
    }

    if (new Date() > user.verificationCodeExpires) {
        return { error: "Kod wygasł. Zarejestruj się ponownie, aby otrzymać nowy." };
    }

    // Verify user
    await prisma.user.update({
        where: { email },
        data: { 
            emailVerified: new Date(),
            verificationCode: null,
            verificationCodeExpires: null
        }
    });

    return { success: true };
}
