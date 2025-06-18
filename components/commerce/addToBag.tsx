"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStocks } from "@enadhq/commerce/backend";
import { Product, useBrink } from "@enadhq/commerce/brink";
import { EnadProduct, useApp } from "@enadhq/commerce/enad";
import { Loader2Icon, ShoppingBag } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

type Props = {
  className?: string;
  qty?: number;
  product?: EnadProduct;
  stocks?: Product.ProductParentStock[];
  showQty?: boolean;
  disabled?: boolean;
  isCard?: boolean;
  openDialogAfterAdded?: boolean;
  hasOptions?: boolean;
  hideCheckoutIcon?: boolean;
  market: {
    name: string;
    currency: string;
    language: string;
    locale: string;
    country: string;
    engageLocale: string;
    enadMarket: string;
    engageStore: string;
  };
  selectedSize: string;
};

const warehouse_online = process.env.NEXT_PUBLIC_ENAD_WAREHOUSE_ONLINE_ID;

const AddToBag = ({
  className,
  qty,
  product,
  showQty,
  isCard,
  openDialogAfterAdded,
  disabled = false,
  hasOptions,
  hideCheckoutIcon,
  market,
  selectedSize,
}: Props) => {
  const { addToCart } = useBrink();
  const { setIsCartOpen } = useApp();
  const [messsage, setMessage] = useState("");
  const [quantity, setQuantity] = useState(qty || 1);
  const [loading, setLoading] = useState(false);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const enadStock =
    product?.variants?.length &&
    (product?.variants?.[0]?.inventories?.find(
      (i) => i?.warehouse?.id === warehouse_online
    )?.quantity ?? 0) > 0
      ? true
      : false;

  const [stock, setStock] = useState<Product.ProductVariantStock | null>(null);
  const [allOutOfStock, setAllOutOfStock] = useState(!enadStock);
  const [monitorReady, setMonitorReady] = useState(false);
  const [lowStock, setLowStock] = useState(false);

  const fetchStocks = async () => {
    const response = await getStocks({
      productParentId: product?.product_number ?? "",
      storeGroupId: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
      countryCode: market.country,
      cache: "no-store",
    });
    if ("productParent" in response) {
      const stocks = response.productParent.productVariants;

      setStock(response.productParent.productVariants?.[0]);

      const allOutOfStock = stocks.every(
        (stock) => stock.availableQuantity <= 0 && stock?.validateStock
      );
      setAllOutOfStock(allOutOfStock);

      const lowStock = stocks.every(
        (stock) => stock.availableQuantity < 10 && allOutOfStock === false
      );
      setLowStock(lowStock);

      if (product?.is_active && allOutOfStock) {
        setMonitorReady(true);
      }
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAddItem = async (id: string, qty: number) => {
    setLoading(true);

    if (id) {
      const addedToCartResponse = await addToCart({
        productVariantId: id,
        quantity: Number(qty || 1),
        market: market.country,
        lang: market.language,
        store: process.env.NEXT_PUBLIC_BRINK_STORE_GROUP_ID || "",
        engageLocale: market.language,
        enadProduct: product,
      });
      setLoading(false);

      if (addedToCartResponse !== "out of stock error") {
        setIsCartOpen(true);
      }
    } else {
      setMessage("Select size");
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          autoFocus={false}
          onMouseDown={() => handleAddItem(selectedSize, quantity)}
          aria-label={"cart.addToCart"}
          disabled={disabled || allOutOfStock || !product?.is_active}
          className={cn(className, "w-full")}
          variant={allOutOfStock ? "ghost" : "default"}
          size={"lg"}
        >
          {!allOutOfStock && !hideCheckoutIcon && (
            <ShoppingBag className="w-4 mr-2 shrink-0" />
          )}

          {selectedSize === ""
            ? "Choose size"
            : allOutOfStock
            ? "Out of stock"
            : "Add to bag"}
          {loading && (
            <Loader2Icon className="animate shrink-0 animate-spin ml-2 w-4" />
          )}
        </Button>
      </div>
    </Fragment>
  );
};

export default AddToBag;
