"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">Strona Główna</Link>
            <Link href="/products" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">Oferta</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">Kontakt</Link>
          </div>

          <div className="flex items-center gap-4">
            {/* User Menu */}
            {session ? (
                <div className="flex items-center gap-3">
                    <Link href="/profile">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Moje Konto</span>
                        </Button>
                    </Link>
                    {/* Admin Link */}
                    {/* @ts-ignore */}
                    {session.user?.role === 'ADMIN' && (
                        <Link href="/admin">
                             <Button variant="ghost" size="sm" className="text-red-600">Admin</Button>
                        </Link>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => signOut()}>
                        <LogOut className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>
            ) : (
                <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">Zaloguj</Button>
                </Link>
            )}

             <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md">Strona Główna</Link>
              <Link href="/products" className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md">Oferta</Link>
              <Link href="/contact" className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md">Kontakt</Link>
           </div>
        </div>
      )}
    </nav>
  );
}
