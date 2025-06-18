"use client";

import { cn } from "@/lib/utils";
import { MarketPrice } from "@enadhq/commerce/enad";
import { localizedPrice } from "@enadhq/commerce/storefront";

interface Props {
  inline?: boolean;
  className?: string;
  discountClassName?: string;
  enadPrice: MarketPrice | undefined;
  market: any;
}

const EnadPrice: React.FC<Props> = ({
  enadPrice,
  className,
  discountClassName,
  market,
}) => {
  const isDiscounted = enadPrice?.on_sale;

  return (
    <div className="">
      {isDiscounted ? (
        <div className="flex flex-col">
          <div className={cn(`flex space-x-2 w-full ${className}`)}>
            <ins
              className={cn(
                "!no-underline text-base lg:text-xl font-bold whitespace-nowrap",
                className
              )}
            >
              {enadPrice?.sale_price_amount &&
                localizedPrice(
                  enadPrice?.sale_price_amount,
                  true,
                  market.language,
                  market.currency
                )}
            </ins>
            <del
              className={cn(
                "line-through text-base lg:text-xl font-normal opacity-80",
                discountClassName
              )}
            >
              {enadPrice?.base_price_amount &&
                localizedPrice(
                  enadPrice?.base_price_amount,
                  true,
                  market.language,
                  market.currency
                )}
            </del>
          </div>
          <span className="text-xxs uppercase font-light tracking-wide">
            exkl. moms
          </span>
        </div>
      ) : (
        <div
          className={cn(
            `text-xs lg:text-[20px] font-bold flex flex-col`,
            className
          )}
        >
          <span>
            {enadPrice?.base_price_amount &&
              localizedPrice(
                enadPrice?.base_price_amount,
                true,
                market.language,
                market.currency
              )}
          </span>
          <span className="text-xxs uppercase font-light tracking-wide">
            exkl. moms
          </span>
        </div>
      )}
    </div>
  );
};
export default EnadPrice;
