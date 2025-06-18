import ProductDetail from "@/components/product-detail";
import { MARKETS } from "@/constants/markets";
import { getEnadUser, getProductBySlug } from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";
import { cookies } from "next/headers";
import Link from "next/link";

type Params = {
  lang: string;
  slug: string[];
};

export default async function ProductPage(props: {
  params: Promise<Params>;
  searchParams: Promise<any>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const productSlug = params.slug.pop();
  const { selectedMarket } = await getMarketData(MARKETS);
  const product = await getProductBySlug(
    selectedMarket.enadMarket,
    selectedMarket.language,
    productSlug || ""
  );
  const cookieStore = await cookies();
  const enadUserToken = cookieStore.get("enadUserToken")?.value || "";
  const user = await getEnadUser(enadUserToken);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Produkt hittades inte</h1>
        <Link href="/category/kille" className="underline">
          Tillbaka till produkter
        </Link>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      market={selectedMarket}
      user={user}
      searchParams={searchParams}
    />
  );
}
