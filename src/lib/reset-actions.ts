"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy email"),
});

const ResetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Kod musi mieć 6 znaków"),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
});

export async function requestPasswordReset(data: z.infer<typeof ForgotPasswordSchema>) {
    const result = ForgotPasswordSchema.safeParse(data);
    if (!result.success) return { error: result.error.issues[0].message };

    const { email } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Don't reveal user existence, just say email sent
        return { success: true }; 
    }

    // Generate code
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code = "123456"; // Fixed for dev
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Save token
    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token: code,
            expires
        }
    });

    // Send email
    await sendEmail(
        email,
        "Reset hasła - 3dprint",
        `<p>Kod do resetu hasła: <strong>${code}</strong></p>`
    );

    return { success: true };
}

export async function resetPassword(data: z.infer<typeof ResetPasswordSchema>) {
    const result = ResetPasswordSchema.safeParse(data);
    if (!result.success) return { error: result.error.issues[0].message };

    const { email, code, password } = result.data;

    // Verify code
    const token = await prisma.verificationToken.findFirst({
        where: {
            identifier: email,
            token: code,
            expires: { gt: new Date() }
        }
    });

    if (!token) return { error: "Nieprawidłowy lub wygasły kod" };

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    // Delete used token
    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: code } }
    });

    return { success: true };
}
