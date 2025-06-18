"use client";

import SearchIcon from "@/app/icons/search";
import { useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function SearchInput({
  placeholder = "Sök...",
  className = "",
  autoFocus = false,
  onClose,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-6 w-6" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-none py-1 h-[43px] pl-12 bg-[#1A1A1A] placeholder:text-white placeholder:text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
      />
      {false && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
