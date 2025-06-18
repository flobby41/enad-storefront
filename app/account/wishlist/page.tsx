import AccountFavorites from "@/components/commerce/favorites";
import { MARKETS } from "@/constants/markets";
import { getEnadUser } from "@enadhq/commerce/backend";
import { getMarketData } from "@enadhq/commerce/storefront";
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function WishlistPage() {
  const { selectedMarket } = await getMarketData(MARKETS);
  const cookieStore = await cookies();
  const enadUserToken = cookieStore.get("enadUserToken")?.value || "";
  const user = await getEnadUser(enadUserToken);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto lg:px-6 px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/account" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold uppercase">Min önskelista</h1>
      </div>

      <AccountFavorites market={selectedMarket} />

      {/* {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium mb-2">Din önskelista är tom</h2>
          <p className="text-gray-600 mb-6">
            Spara produkter genom att klicka på hjärtat på produktsidan.
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block"
          >
            Börja shoppa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className="bg-white border border-gray-200 rounded-md overflow-hidden"
            >
              <div className="relative aspect-3/4 w-full">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeItem(item.id, item.color, item.size)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Ta bort från önskelista"
                >
                  <Trash2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.colorName}, {item.size}
                </p>
                <p className="font-medium mb-4">{item.price} kr</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-black text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span>Lägg i varukorg</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
