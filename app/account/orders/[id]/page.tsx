import OrderDetails from "@/components/commerce/orders/order-item/order-details";
import { MARKETS } from "@/constants/markets";
import {
  getBrinkOrderByIdBackend,
  getBrinkOrderdeliveriesBackend,
  getBrinkOrderHistoryBackend,
} from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";

type Params = {
  lang: string;
  id: string[];
};

export default async function OrderDetailsPage(props: {
  params: Promise<Params>;
  searchParams: Promise<any>;
}) {
  const params = await props.params;
  const order = await getBrinkOrderByIdBackend(`/orders/${params.id}`);
  const orderHistory = await getBrinkOrderHistoryBackend(order?.id);
  const orderDeliveries = await getBrinkOrderdeliveriesBackend(order?.id);

  const { selectedMarket } = await getMarketData(MARKETS);

  console.log("Order Details Page", orderDeliveries);

  return (
    <OrderDetails
      market={selectedMarket}
      order={order}
      orderHistory={orderHistory}
    />
  );
}
