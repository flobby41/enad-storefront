"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getStocks } from "@enadhq/commerce/backend";
import { Api, getBrinkOrderById } from "@enadhq/commerce/brink";
import { Loader2, ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import ReorderDialog from "./ui/reorder-dialog";

export default function ReOrder({
  market,
  order,
  buttonText,
  buttonClassName = "",
  disableToolTip = false,
}: {
  market: any;
  order: Api.BrinkOrder;
  buttonText?: string;
  buttonClassName?: string;
  disableToolTip?: boolean;
}) {
  const [orderLineLoading, setOrderLineLoading] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Api.BrinkOrder | null>(
    null
  );
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

  // Handle re-order button click - opens dialog
  const handleReorderClick = async (order: Api.BrinkOrder) => {
    setOrderLineLoading(order.id);
    const fullOrder = await getBrinkOrderById(`/orders/${order.id}`);

    if (!fullOrder || !fullOrder.orderLines) {
      return;
    }
    const stocksPerLine = await Promise.all(
      fullOrder.orderLines
        ?.filter((p) => !p.options?.["brandingAddon"])
        .map(async (line) => {
          const stocks = await getStocks({
            productParentId: line.productParentId,
            storeGroupId: market.storeGroupId,
            countryCode: market.country,
          });

          // Find only the stock for the current productVariantId
          const variantStock = stocks?.productParent?.productVariants?.find(
            (variant) => variant.id === line.productVariantId
          );

          return {
            orderLineId: line.id,
            stock: variantStock ? variantStock : null,
          };
        })
    );

    // Exempel: mappa in stockdata till varje orderLine (kan anpassas beroende på användning)
    const enrichedOrderLines = fullOrder?.orderLines.map((line) => {
      const stockData = stocksPerLine.find((s) => s.orderLineId === line.id);
      return {
        ...line,
        stock: stockData?.stock ?? null,
      };
    });

    setSelectedOrder({ ...fullOrder, orderLines: enrichedOrderLines });
    setIsReorderDialogOpen(true);
    setOrderLineLoading("");
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleReorderClick(order)}
              className={cn(buttonClassName, "")}
              disabled={orderLineLoading === order.id}
            >
              {buttonText || ""}
              {orderLineLoading === order.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBagIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          {!disableToolTip && (
            <TooltipContent>
              <p className="">Beställ igen</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {/* Reorder Dialog */}
      {selectedOrder && (
        <ReorderDialog
          isOpen={isReorderDialogOpen}
          onClose={() => {
            setIsReorderDialogOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          orderId={selectedOrder.id}
          market={market}
        />
      )}
    </>
  );
}
