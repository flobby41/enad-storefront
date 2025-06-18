"use client";

import { useWishlist } from "@enadhq/commerce/enad";

import ProductCard from "../product-card";

export default function AccountFavorites({ market }: { market: any }) {
  const { wishlist } = useWishlist();

  return (
    <div>
      {wishlist?.length ? (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {wishlist?.map((w) => (
            <ProductCard market={market} key={w.id} product={w} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* {isLoading
              ? [...Array(5)].map((_, i) => (
                  <Skeleton key={_ + i} className="aspect-square"></Skeleton>
                ))
              : null} */}
        </div>
      )}
    </div>
  );
}
