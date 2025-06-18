"use client";

import ProductCard from "@/components/product-card";
import SearchInput from "@/components/search-input";
import { products } from "@/data/products";
import { searchProducts } from "@/utils/search";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState(
    searchProducts(products, queryParam)
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold mb-6">
        {queryParam ? `SÖKRESULTAT FÖR: ${queryParam.toUpperCase()}` : "SÖK"}
      </h1>

      {/* Search input for refinement */}
      <div className="mb-8 max-w-xl">
        <SearchInput placeholder="Förfina din sökning..." className="mb-2" />
        <p className="text-sm text-gray-500">
          Sök efter produkter, kategorier eller artikelnummer
        </p>
      </div>

      {/* Search results */}
      {searchResults.length > 0 ? (
        <>
          <p className="mb-4 text-gray-600">
            {searchResults.length} produkter hittades
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border-t border-b border-gray-200 my-8">
          <h2 className="text-xl font-medium mb-2">Inga produkter hittades</h2>
          <p className="text-gray-600 mb-6">
            Vi kunde inte hitta några produkter som matchar "{queryParam}".
          </p>
          <div className="max-w-md mx-auto">
            <h3 className="font-medium mb-2">Förslag:</h3>
            <ul className="text-gray-600 text-left list-disc pl-6">
              <li>Kontrollera stavningen</li>
              <li>Använd färre eller mer generella sökord</li>
              <li>
                Sök efter produktkategori istället för specifika produkter
              </li>
              <li>Prova att söka efter liknande produkter</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
