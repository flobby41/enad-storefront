import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { Logo } from "./sidebar";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="lg:pl-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 lg:text-left text-center">
          {/* OM LAGER 157 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-6">OM LAGER 157</h3>
            <div className="space-y-3">
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                OM OSS
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                NEWS
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                JOBBA HOS OSS
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                CERTIFIKAT
              </Link>
            </div>
          </div>

          {/* KUNDTJÄNST */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-6">KUNDTJÄNST</h3>
            <div className="space-y-3">
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                KONTAKTA OSS
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                KÖPVILLKOR
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                BETALNINGSRETUR
              </Link>
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                PRESENTKORT
              </Link>
            </div>
          </div>

          {/* BUTIKER */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-6">BUTIKER</h3>
            <div className="space-y-3">
              <Link
                href="#"
                className="block text-sm hover:text-gray-300 transition-colors"
              >
                HITTA BUTIK
              </Link>
            </div>
          </div>

          {/* FÖLJ OSS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">FÖLJ OSS!</h3>
            <div className="flex space-x-4 justify-center lg:justify-start">
              <Link href="#" className="hover:text-gray-300 transition-colors">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center text-center lg:text-left justify-between gap-8 pt-4">
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-2xl uppercase font-bold mb-2">
                GÅ MED I VÅRT NYHETSBREV <br></br>SÅ MISSAR DU INGET.
              </p>
            </div>
            <div className="flex gap-3 max-w-md">
              <Input
                type="email"
                placeholder="Din e-postadress"
                className="bg-transparent border-white text-white placeholder:text-gray-400"
              />
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black px-6"
              >
                BLI MEDLEM
              </Button>
            </div>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="lg:h-[67px] h-auto w-full lg:w-auto fill-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}
