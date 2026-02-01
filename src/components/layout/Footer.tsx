import { Logo } from "@/components/ui/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Logo light />
            <p className="text-gray-400 text-sm leading-relaxed">
              Tworzymy wyjątkowe produkty 3D z pasją i precyzją. 
              Od personalizowanych breloków po unikalne prezenty.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#D4AF37]">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a href="tel:+48515083675" className="hover:text-white">+48 515 083 675</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a href="mailto:maslana2121@gmail.com" className="hover:text-white">maslana2121@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Bytom, Polska</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#D4AF37]">O nas</h3>
            <p className="text-gray-400 text-sm">
              Michał Kaleta<br />
              Specjalizacja: Druk 3D, Projektowanie, Personalizacja.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} 3dprint. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
