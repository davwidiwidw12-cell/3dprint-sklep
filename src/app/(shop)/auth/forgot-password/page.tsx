"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { requestPasswordReset } from "@/lib/reset-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await requestPasswordReset({ email });
    setLoading(false);
    setMessage("Jeśli konto istnieje, wysłaliśmy kod resetujący.");
    setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="flex flex-col items-center space-y-4 pt-8">
          <Logo className="scale-125" />
          <CardTitle className="text-2xl font-bold">Przypomnij hasło</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm text-center">
                    {message}
                </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="jan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4" disabled={loading}>
              {loading ? "Wysyłanie..." : "Wyślij kod"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/auth/signin" className="text-gray-500 hover:text-gray-900">Wróć do logowania</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
