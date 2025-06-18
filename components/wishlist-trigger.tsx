"use client";

import FavoriteIcon from "@/app/icons/favorite";
import { cn } from "@/lib/utils";
import { useWishlist } from "@enadhq/commerce/enad";
import { Button, ButtonProps } from "./ui/button";

interface Props {
  productNumber: string;
  className?: string;
  classNameHeart?: string;
  disabled?: boolean;
  boldHeart?: boolean;
  variant: ButtonProps["variant"];
  size: ButtonProps["size"];
}

function WishlistTrigger({
  productNumber,
  className,
  classNameHeart,
  boldHeart = false,
  disabled = false,
  variant,
  size,
}: Props) {
  const { wishlistIds, toggleWishlist } = useWishlist();

  // Check if the product is in the wishlist
  const productInWishlist = wishlistIds.includes(productNumber);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(className, "w-8")}
      aria-label="Add to wishlist"
      onMouseDown={() => toggleWishlist(productNumber)}
    >
      <FavoriteIcon
        className={cn(
          "h-8 w-8",
          classNameHeart,
          productInWishlist ? "fill-black" : ""
        )}
      />
    </Button>
  );
}

export default WishlistTrigger;
