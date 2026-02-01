"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/", // Redirect to home page
    });
    
    if (result?.error) {
        setError("Nieprawidłowe dane logowania");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="flex flex-col items-center space-y-4 pt-8">
          <Logo className="scale-125" />
          <CardTitle className="text-2xl font-bold">Logowanie</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                    {error}
                </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="text" 
                placeholder="jan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Hasło</label>
                  <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">Zapomniałeś hasła?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold mt-4">
              Zaloguj się
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
              <p>Nie masz konta? <Link href="/auth/register" className="text-blue-600 hover:underline">Zarejestruj się</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
