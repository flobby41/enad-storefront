"use client";

import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import WishlistSheet from "@/components/wishlist-sheet";
import { useTranslation } from "@/lib/utils";
import { useWishlist } from "@enadhq/commerce/enad";
import { Heart } from "lucide-react";
import { Fragment } from "react";

interface Props {
  lang: string;
}

export default function WishlistToggle({ lang }: Props) {
  const { wishlistIds, setWishlistOpen } = useWishlist();

  const { t } = useTranslation(lang as string);

  return (
    <Fragment>
      <WishlistSheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            className="p-2 relative"
            aria-label="Open wishlist"
            onMouseDown={() => setWishlistOpen(true)}
          >
            <Heart className="w-6 mr-2 stroke-white" />
            <span className="lg:block hidden font-normal">
              {t("favorites")}
            </span>
            <span className="absolute lg:-right-2 right-1 top-0 leading-none flex items-center bg-white text-black text-[10px] w-3.5 h-3.5 rounded-full justify-center text-center">
              {wishlistIds.length}
            </span>
          </Button>
        </SheetTrigger>
      </WishlistSheet>
    </Fragment>
  );
}
