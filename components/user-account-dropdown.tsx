"use client";

import UserIcon from "@/app/icons/user";
import { EnadUser, useEnadUser } from "@enadhq/commerce/enad";
import { Heart, LogOut, Settings, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function UserAccountDropdown({
  user,
}: {
  user: EnadUser | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useEnadUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout("/login/");
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  if (!user?.id) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-auto h-auto p-2"
        onClick={() => router.push("/login")}
        aria-label="Logga in"
      >
        <UserIcon className="h-6! w-6!" />
      </Button>
    );
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative w-auto h-auto p-2"
        onClick={toggleDropdown}
        aria-label="Mitt konto"
      >
        <UserIcon className="h-6! w-6!" />
        <div className="absolute text-xs duration-75 -right-0 bottom-1.5 h-[13px] rounded-md px-0.5 bg-black group-hover:bg-accent">
          {user?.first_name?.charAt(0)}
          {user?.last_name?.charAt(0)}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white text-black border border-gray-200 shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center mr-3">
                {user?.first_name?.charAt(0)}
                {user?.last_name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <button
              onClick={() => handleNavigation("/account")}
              className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              <User className="h-4 w-4 mr-3" />
              <span>Mitt konto</span>
            </button>
            <button
              onClick={() => handleNavigation("/account/orders")}
              className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              <ShoppingBag className="h-4 w-4 mr-3" />
              <span>Mina ordrar</span>
            </button>
            <button
              onClick={() => handleNavigation("/account/wishlist")}
              className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              <Heart className="h-4 w-4 mr-3" />
              <span>Min önskelista</span>
            </button>
            <button
              onClick={() => handleNavigation("/account/settings")}
              className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              <Settings className="h-4 w-4 mr-3" />
              <span>Inställningar</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Logga ut</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
