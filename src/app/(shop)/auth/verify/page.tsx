"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { verifyUser } from "@/lib/auth-actions";
import { signIn } from "next-auth/react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyUser({ email, code });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
        
        // Auto-login
        const password = sessionStorage.getItem("registration_password");
        
        if (password) {
            const loginResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (loginResult?.ok) {
                sessionStorage.removeItem("registration_password");
                sessionStorage.removeItem("registration_email");
                router.push("/");
                router.refresh();
            } else {
                router.push("/auth/signin?verified=true");
            }
        } else {
             router.push("/auth/signin?verified=true");
        }
      }
    } catch (err) {
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-none">
      <CardHeader className="flex flex-col items-center space-y-4 pt-8">
        <Logo className="scale-125" />
        <CardTitle className="text-2xl font-bold">Weryfikacja Email</CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="text-center text-gray-500 mb-6 text-sm">
          Wysłaliśmy 6-cyfrowy kod na adres: <br/>
          <span className="font-semibold text-gray-900">{email}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
              Weryfikacja pomyślna! Przekierowywanie do logowania...
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kod weryfikacyjny</label>
            <Input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest h-14"
              maxLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4" disabled={loading || success}>
            {loading ? "Weryfikowanie..." : "Zatwierdź Kod"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Suspense fallback={<div>Ładowanie...</div>}>
            <VerifyContent />
        </Suspense>
    </div>
  );
}
