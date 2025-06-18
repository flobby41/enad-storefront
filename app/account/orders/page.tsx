import OrderList from "@/components/commerce/orders/order-list";
import { MARKETS } from "@/constants/markets";
import { getEnadUser } from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";
import { cookies } from "next/headers";

export default async function CustomerOrdersPage() {
  const { selectedMarket } = await getMarketData(MARKETS);
  const cookieStore = await cookies();
  const enadUserToken = cookieStore.get("enadUserToken")?.value || "";
  const user = await getEnadUser(enadUserToken);
  return (
    <div className="container mx-auto px-0 py-6">
      <OrderList market={selectedMarket} user={user} />
    </div>
  );
}
