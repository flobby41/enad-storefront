"use client";

import { useEnadUser, useWishlist } from "@enadhq/commerce/enad";
import { ArrowLeft, Menu, Search, ShoppingBag, Star, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchInput from "./search-input";
import { Logo } from "./sidebar";
import UserAccountDropdown from "./user-account-dropdown";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setWishlistOpen, wishlistIds } = useWishlist();
  const router = useRouter();
  const { user } = useEnadUser();

  return (
    <>
      <header className="sticky top-0 left-0 right-0 bg-black text-white z-50">
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo className="h-5 fill-white" />
          </Link>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
            <button aria-label="Search">
              <Search className="h-6 w-6" />
            </button>
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative"
              aria-label="Favorites"
            >
              <Star className="h-6 w-6" />
              {wishlistIds?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistIds?.length}
                </span>
              )}
            </button>
            {user?.id ? (
              <UserAccountDropdown user={user} />
            ) : (
              <button
                onClick={() => router.push("/account/login")}
                aria-label="Logga in"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button className="relative" aria-label="Shopping bag">
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile search overlay */}
        {false && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            <div className="flex items-center mb-4">
              <button className="mr-4">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <SearchInput placeholder="Sök produkter..." autoFocus />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Sök efter produkter, kategorier eller artikelnummer
            </p>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <span className="font-medium">Meny</span>
            <div className="w-6"></div> {/* Empty div for flex alignment */}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <SearchInput placeholder="Sök produkter..." />
          </div>

          {/* Navigation */}
          {/* <nav className="p-4">
              <ul className="space-y-2">
                {categories.map((category) => renderCategory(category, true))}
              </ul>
            </nav> */}
        </div>
      )}
    </>
  );
}
