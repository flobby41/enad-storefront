export type SizeGuideCategory = "tops" | "bottoms" | "dresses" | "outerwear" | "shoes" | "accessories" | "jeans"

export interface SizeGuideTable {
  title: string
  headers: string[]
  rows: {
    size: string
    measurements: string[]
  }[]
  notes?: string[]
}

export interface SizeGuide {
  category: SizeGuideCategory
  title: string
  description: string
  tables: SizeGuideTable[]
  howToMeasure?: {
    title: string
    steps: {
      name: string
      description: string
    }[]
  }
}

const sizeGuides: Record<SizeGuideCategory, SizeGuide> = {
  tops: {
    category: "tops",
    title: "Storleksguide för toppar",
    description: "Använd tabellen nedan för att hitta din storlek för t-shirts, linnen, skjortor och andra överdelar.",
    tables: [
      {
        title: "Damstorlekar",
        headers: ["Storlek", "Byst (cm)", "Midja (cm)", "Höft (cm)"],
        rows: [
          { size: "XS", measurements: ["82-85", "64-67", "88-91"] },
          { size: "S", measurements: ["86-89", "68-71", "92-95"] },
          { size: "M", measurements: ["90-93", "72-75", "96-99"] },
          { size: "L", measurements: ["94-97", "76-79", "100-103"] },
          { size: "XL", measurements: ["98-103", "80-85", "104-109"] },
          { size: "XXL", measurements: ["104-109", "86-91", "110-115"] },
        ],
        notes: [
          "Alla mått är i centimeter och avser kroppsmått, inte plaggmått.",
          "Om du ligger mellan två storlekar, välj den större storleken för en lösare passform.",
        ],
      },
      {
        title: "Herrstorlekar",
        headers: ["Storlek", "Bröst (cm)", "Midja (cm)", "Höft (cm)"],
        rows: [
          { size: "XS", measurements: ["86-89", "74-77", "90-93"] },
          { size: "S", measurements: ["90-93", "78-81", "94-97"] },
          { size: "M", measurements: ["94-97", "82-85", "98-101"] },
          { size: "L", measurements: ["98-103", "86-91", "102-107"] },
          { size: "XL", measurements: ["104-109", "92-97", "108-113"] },
          { size: "XXL", measurements: ["110-115", "98-103", "114-119"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Byst/Bröst",
          description: "Mät runt den bredaste delen av bröstkorgen, under armarna och över brösten.",
        },
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, vanligtvis i höjd med naveln.",
        },
        {
          name: "Höft",
          description: "Mät runt den bredaste delen av höften, ungefär 20 cm nedanför midjan.",
        },
      ],
    },
  },
  bottoms: {
    category: "bottoms",
    title: "Storleksguide för byxor",
    description: "Använd tabellen nedan för att hitta din storlek för byxor, shorts och kjolar.",
    tables: [
      {
        title: "Damstorlekar",
        headers: ["Storlek", "Midja (cm)", "Höft (cm)", "Innerbensöm (cm)"],
        rows: [
          { size: "XS / 34", measurements: ["64-67", "88-91", "78"] },
          { size: "S / 36", measurements: ["68-71", "92-95", "79"] },
          { size: "M / 38", measurements: ["72-75", "96-99", "80"] },
          { size: "L / 40", measurements: ["76-79", "100-103", "81"] },
          { size: "XL / 42", measurements: ["80-85", "104-109", "82"] },
          { size: "XXL / 44", measurements: ["86-91", "110-115", "83"] },
        ],
      },
      {
        title: "Herrstorlekar",
        headers: ["Storlek", "Midja (cm)", "Höft (cm)", "Innerbensöm (cm)"],
        rows: [
          { size: "XS / 44", measurements: ["74-77", "90-93", "80"] },
          { size: "S / 46", measurements: ["78-81", "94-97", "81"] },
          { size: "M / 48", measurements: ["82-85", "98-101", "82"] },
          { size: "L / 50", measurements: ["86-91", "102-107", "83"] },
          { size: "XL / 52", measurements: ["92-97", "108-113", "84"] },
          { size: "XXL / 54", measurements: ["98-103", "114-119", "85"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, vanligtvis i höjd med naveln.",
        },
        {
          name: "Höft",
          description: "Mät runt den bredaste delen av höften, ungefär 20 cm nedanför midjan.",
        },
        {
          name: "Innerbensöm",
          description: "Mät från grenen ner till fotleden längs insidan av benet.",
        },
      ],
    },
  },
  jeans: {
    category: "jeans",
    title: "Storleksguide för jeans",
    description:
      "Använd tabellen nedan för att hitta din storlek för jeans. Jeansen anges i tum för midja och innerbensöm (t.ex. 32/32).",
    tables: [
      {
        title: "Damstorlekar",
        headers: ["Storlek (EU)", "Midja (tum)", "Midja (cm)", "Höft (cm)", "Innerbensöm (tum)"],
        rows: [
          { size: "34", measurements: ["24-25", "61-64", "88-91", "30-32"] },
          { size: "36", measurements: ["26-27", "65-69", "92-95", "30-32"] },
          { size: "38", measurements: ["28-29", "70-74", "96-99", "30-32"] },
          { size: "40", measurements: ["30-31", "75-79", "100-103", "30-32"] },
          { size: "42", measurements: ["32-33", "80-84", "104-109", "30-32"] },
          { size: "44", measurements: ["34-36", "85-91", "110-115", "30-32"] },
        ],
        notes: [
          "Jeansens storlek anges vanligtvis som midja/innerbensöm i tum, t.ex. 28/32.",
          "Om du är mellan två storlekar, välj den större storleken för en bekvämare passform.",
        ],
      },
      {
        title: "Herrstorlekar",
        headers: ["Storlek (EU)", "Midja (tum)", "Midja (cm)", "Höft (cm)", "Innerbensöm (tum)"],
        rows: [
          { size: "44", measurements: ["28-29", "71-74", "90-93", "30-34"] },
          { size: "46", measurements: ["30-31", "75-79", "94-97", "30-34"] },
          { size: "48", measurements: ["32-33", "80-84", "98-101", "30-34"] },
          { size: "50", measurements: ["34-36", "85-91", "102-107", "30-34"] },
          { size: "52", measurements: ["38-40", "92-102", "108-113", "30-34"] },
          { size: "54", measurements: ["42-44", "103-112", "114-119", "30-34"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, vanligtvis i höjd med naveln.",
        },
        {
          name: "Höft",
          description: "Mät runt den bredaste delen av höften, ungefär 20 cm nedanför midjan.",
        },
        {
          name: "Innerbensöm",
          description: "Mät från grenen ner till fotleden längs insidan av benet.",
        },
      ],
    },
  },
  dresses: {
    category: "dresses",
    title: "Storleksguide för klänningar",
    description: "Använd tabellen nedan för att hitta din storlek för klänningar.",
    tables: [
      {
        title: "Damstorlekar",
        headers: ["Storlek", "Byst (cm)", "Midja (cm)", "Höft (cm)"],
        rows: [
          { size: "XS / 34", measurements: ["82-85", "64-67", "88-91"] },
          { size: "S / 36", measurements: ["86-89", "68-71", "92-95"] },
          { size: "M / 38", measurements: ["90-93", "72-75", "96-99"] },
          { size: "L / 40", measurements: ["94-97", "76-79", "100-103"] },
          { size: "XL / 42", measurements: ["98-103", "80-85", "104-109"] },
          { size: "XXL / 44", measurements: ["104-109", "86-91", "110-115"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Byst",
          description: "Mät runt den bredaste delen av bröstkorgen, under armarna och över brösten.",
        },
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, vanligtvis i höjd med naveln.",
        },
        {
          name: "Höft",
          description: "Mät runt den bredaste delen av höften, ungefär 20 cm nedanför midjan.",
        },
      ],
    },
  },
  outerwear: {
    category: "outerwear",
    title: "Storleksguide för ytterkläder",
    description: "Använd tabellen nedan för att hitta din storlek för jackor, kappor och andra ytterkläder.",
    tables: [
      {
        title: "Damstorlekar",
        headers: ["Storlek", "Byst (cm)", "Midja (cm)", "Höft (cm)"],
        rows: [
          { size: "XS / 34", measurements: ["82-85", "64-67", "88-91"] },
          { size: "S / 36", measurements: ["86-89", "68-71", "92-95"] },
          { size: "M / 38", measurements: ["90-93", "72-75", "96-99"] },
          { size: "L / 40", measurements: ["94-97", "76-79", "100-103"] },
          { size: "XL / 42", measurements: ["98-103", "80-85", "104-109"] },
          { size: "XXL / 44", measurements: ["104-109", "86-91", "110-115"] },
        ],
        notes: [
          "För ytterkläder rekommenderar vi att välja en storlek större om du planerar att bära tjockare kläder under.",
        ],
      },
      {
        title: "Herrstorlekar",
        headers: ["Storlek", "Bröst (cm)", "Midja (cm)", "Höft (cm)"],
        rows: [
          { size: "XS / 44", measurements: ["86-89", "74-77", "90-93"] },
          { size: "S / 46", measurements: ["90-93", "78-81", "94-97"] },
          { size: "M / 48", measurements: ["94-97", "82-85", "98-101"] },
          { size: "L / 50", measurements: ["98-103", "86-91", "102-107"] },
          { size: "XL / 52", measurements: ["104-109", "92-97", "108-113"] },
          { size: "XXL / 54", measurements: ["110-115", "98-103", "114-119"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Byst/Bröst",
          description: "Mät runt den bredaste delen av bröstkorgen, under armarna och över brösten.",
        },
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, vanligtvis i höjd med naveln.",
        },
        {
          name: "Höft",
          description: "Mät runt den bredaste delen av höften, ungefär 20 cm nedanför midjan.",
        },
      ],
    },
  },
  shoes: {
    category: "shoes",
    title: "Storleksguide för skor",
    description: "Använd tabellen nedan för att hitta din skostorlek.",
    tables: [
      {
        title: "Damskor",
        headers: ["EU", "UK", "US", "Fotlängd (cm)"],
        rows: [
          { size: "35", measurements: ["2.5", "5", "22"] },
          { size: "36", measurements: ["3.5", "6", "22.5"] },
          { size: "37", measurements: ["4", "6.5", "23.5"] },
          { size: "38", measurements: ["5", "7.5", "24"] },
          { size: "39", measurements: ["6", "8.5", "25"] },
          { size: "40", measurements: ["6.5", "9", "25.5"] },
          { size: "41", measurements: ["7.5", "10", "26"] },
          { size: "42", measurements: ["8", "10.5", "27"] },
        ],
      },
      {
        title: "Herrskor",
        headers: ["EU", "UK", "US", "Fotlängd (cm)"],
        rows: [
          { size: "39", measurements: ["5.5", "6.5", "25"] },
          { size: "40", measurements: ["6.5", "7.5", "25.5"] },
          { size: "41", measurements: ["7", "8", "26.5"] },
          { size: "42", measurements: ["8", "9", "27"] },
          { size: "43", measurements: ["9", "10", "28"] },
          { size: "44", measurements: ["9.5", "10.5", "28.5"] },
          { size: "45", measurements: ["10.5", "11.5", "29.5"] },
          { size: "46", measurements: ["11", "12", "30"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Fotlängd",
          description:
            "Ställ dig på ett papper och rita runt din fot. Mät från hälen till den längsta tån. Mät båda fötterna och använd det större måttet.",
        },
      ],
    },
  },
  accessories: {
    category: "accessories",
    title: "Storleksguide för accessoarer",
    description: "Använd tabellerna nedan för att hitta din storlek för olika accessoarer.",
    tables: [
      {
        title: "Handskar",
        headers: ["Storlek", "Handens omkrets (cm)"],
        rows: [
          { size: "XS", measurements: ["15-16"] },
          { size: "S", measurements: ["17-18"] },
          { size: "M", measurements: ["19-20"] },
          { size: "L", measurements: ["21-22"] },
          { size: "XL", measurements: ["23-24"] },
        ],
      },
      {
        title: "Bälten",
        headers: ["Storlek", "Midja (cm)"],
        rows: [
          { size: "XS", measurements: ["65-75"] },
          { size: "S", measurements: ["75-85"] },
          { size: "M", measurements: ["85-95"] },
          { size: "L", measurements: ["95-105"] },
          { size: "XL", measurements: ["105-115"] },
        ],
      },
      {
        title: "Hattar",
        headers: ["Storlek", "Huvudets omkrets (cm)"],
        rows: [
          { size: "S", measurements: ["55-56"] },
          { size: "M", measurements: ["57-58"] },
          { size: "L", measurements: ["59-60"] },
          { size: "XL", measurements: ["61-62"] },
        ],
      },
    ],
    howToMeasure: {
      title: "Så här mäter du",
      steps: [
        {
          name: "Handens omkrets",
          description: "Mät runt den bredaste delen av handen, exklusive tummen.",
        },
        {
          name: "Midja",
          description: "Mät runt den smalaste delen av midjan, där du vanligtvis bär bältet.",
        },
        {
          name: "Huvudets omkrets",
          description: "Mät runt huvudet, strax ovanför öronen och över pannan.",
        },
      ],
    },
  },
}

export function getSizeGuideForCategory(category: SizeGuideCategory): SizeGuide {
  return sizeGuides[category]
}

export function getSizeGuideForProduct(productType: string): SizeGuide | null {
  // Map product types to size guide categories
  const categoryMap: Record<string, SizeGuideCategory> = {
    // Tops
    topp: "tops",
    "t-shirt": "tops",
    skjorta: "tops",
    blus: "tops",
    linne: "tops",
    tröja: "tops",
    hoodie: "tops",
    sweatshirt: "tops",

    // Bottoms
    byxor: "bottoms",
    shorts: "bottoms",
    kjol: "bottoms",

    // Jeans
    jeans: "jeans",

    // Dresses
    klänning: "dresses",
    dress: "dresses",

    // Outerwear
    jacka: "outerwear",
    kappa: "outerwear",
    rock: "outerwear",
    väst: "outerwear",

    // Shoes
    skor: "shoes",
    stövlar: "shoes",
    sandaler: "shoes",
    sneakers: "shoes",

    // Accessories
    accessoarer: "accessories",
    handskar: "accessories",
    bälte: "accessories",
    mössa: "accessories",
    keps: "accessories",
    halsduk: "accessories",
  }

  // Try to find a matching category
  for (const [key, value] of Object.entries(categoryMap)) {
    if (productType.toLowerCase().includes(key.toLowerCase())) {
      return sizeGuides[value]
    }
  }

  // Default to tops if no match is found
  return sizeGuides.tops
}
