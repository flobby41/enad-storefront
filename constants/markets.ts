export const LOCALIZED_COUNTRIES = ["se"]

export const MARKETS: Market = {
  se: {
    name: "Sverige",
    currency: "SEK",
    language: "sv",
    locale: "sv-SE",
    country: "SE",
    engageLocale: "sv-SE",
    enadMarket: "sweden",
    engageStore: "SE",
    storeGroupId: "0195ed1a-b0df-7a7a-9cc7-3d19a54fc190",
    storeGroupSlug: "b2b-standard",
  },
}

type Market = {
  [key: string]: {
    name: string
    currency: string
    language: string
    locale: string
    country: string
    engageLocale: string
    enadMarket: string
    engageStore: string
    storeGroupId: string
    storeGroupSlug: string
  }
}
