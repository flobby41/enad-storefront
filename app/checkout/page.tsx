"use server";

import CheckoutComponent from "@/components/commerce/checkout/checkout";
import { MARKETS } from "@/constants/markets";
import { getEnadOrganisation, getEnadUser } from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const { selectedMarket } = await getMarketData(MARKETS);
  const cookieStore = await cookies();
  const enadUserToken = cookieStore.get("enadUserToken")?.value || "";
  const user = await getEnadUser(enadUserToken);
  const organisations = await getEnadOrganisation(enadUserToken);

  return (
    <CheckoutComponent
      organisations={organisations.companies || []}
      market={selectedMarket}
      user={user}
    />
  );
}
