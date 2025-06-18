"use client";

import { TAGS } from "@enadhq/commerce/brink";
import { EnadUser, useEnadUser } from "@enadhq/commerce/enad";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { Heart, LogOut, Settings, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export default function MyAccount({ user }: { user: EnadUser }) {
  const { logout } = useEnadUser();
  const queryClient = useQueryClient();

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = (): void => {
    deleteCookie("checkoutToken");
    deleteCookie("cartToken");
    queryClient.setQueryData([TAGS.checkout], null);
    queryClient.setQueryData([TAGS.cart], null);
    logout("/login/");
  };

  return (
    <div className="container mx-auto lg:px-6 px-4 py-6">
      <h1 className="text-xl font-bold uppercase mb-6">Mitt konto</h1>

      <div className="bg-white border border-gray-200  p-6 mb-4">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mr-6">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-medium">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <Link
          href="/account/settings"
          className="bg-white border border-gray-200  p-6 hover:border-black transition-colors"
        >
          <User className="h-8 w-8 mb-4" />
          <h3 className="font-medium mb-2">Mitt konto</h3>
          <p className="text-sm text-gray-500">Hantera dina personuppgifter</p>
        </Link> */}

        <Link
          href="/account/orders"
          className="bg-white border border-gray-200  p-6 hover:border-black transition-colors"
        >
          <ShoppingBag className="h-8 w-8 mb-4" />
          <h3 className="font-medium mb-2">Mina ordrar</h3>
          <p className="text-sm text-gray-500">Se dina tidigare köp</p>
        </Link>

        <Link
          href="/account/wishlist"
          className="bg-white border border-gray-200  p-6 hover:border-black transition-colors"
        >
          <Heart className="h-8 w-8 mb-4" />
          <h3 className="font-medium mb-2">Min önskelista</h3>
          <p className="text-sm text-gray-500">Se dina sparade produkter</p>
        </Link>

        <Link
          href="/account/settings"
          className="bg-white border border-gray-200  p-6 hover:border-black transition-colors"
        >
          <Settings className="h-8 w-8 mb-4" />
          <h3 className="font-medium mb-2">Inställningar</h3>
          <p className="text-sm text-gray-500">Hantera ditt konto</p>
        </Link>
      </div>

      <button
        onClick={() => handleLogout()}
        className="mt-8 flex items-center text-gray-600 hover:text-black"
      >
        <LogOut className="h-5 w-5 mr-2" />
        <span>Logga ut</span>
      </button>
    </div>
  );
}
