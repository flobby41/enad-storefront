"use server";

import MyAccount from "@/components/auth/my-account";
import { MARKETS } from "@/constants/markets";
import { getEnadUser } from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";
import { cookies } from "next/headers";

export default async function MyAccountPage() {
  const { selectedMarket } = await getMarketData(MARKETS);
  const cookieStore = await cookies();
  const enadUserToken = cookieStore.get("enadUserToken")?.value || "";
  const user = await getEnadUser(enadUserToken);

  return <MyAccount market={selectedMarket} user={user} />;
}
