"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { registerUser } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const result = await registerUser({ name, email, password });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Redirect to verification
      sessionStorage.setItem("registration_email", email);
      sessionStorage.setItem("registration_password", password);
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="flex flex-col items-center space-y-4 pt-8">
          <Logo className="scale-125" />
          <CardTitle className="text-2xl font-bold">Rejestracja</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
                Konto utworzone pomyślnie! Przekierowywanie...
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Imię i Nazwisko</label>
              <Input
                type="text"
                placeholder="Jan Kowalski"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hasło</label>
              <Input
                type="password"
                placeholder="Minimum 6 znaków"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4" disabled={success}>
              {success ? "Utworzono konto" : "Zarejestruj się"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Masz już konto? <Link href="/auth/signin" className="text-blue-600 hover:underline">Zaloguj się</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
