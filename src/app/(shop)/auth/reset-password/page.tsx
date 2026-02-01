"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { resetPassword } from "@/lib/reset-actions";

function ResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await resetPassword({ email, code, password });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="flex flex-col items-center space-y-4 pt-8">
          <Logo className="scale-125" />
          <CardTitle className="text-2xl font-bold">Reset Hasła</CardTitle>
          <p className="text-sm text-gray-500 text-center">dla {email}</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">Hasło zmienione! Przekierowywanie...</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kod z maila</label>
              <Input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center tracking-widest"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nowe hasło</label>
              <Input
                type="password"
                placeholder="Nowe hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4" disabled={loading || success}>
              {loading ? "Zapisywanie..." : "Zmień hasło"}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div>Ładowanie...</div>}>
                <ResetContent />
            </Suspense>
        </div>
    )
}
