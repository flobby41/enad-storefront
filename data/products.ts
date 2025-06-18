import type { Product } from "@/types/product"

export const products: Product[] = [
  {
    id: 1,
    name: 'BASIC T-SHIRT "MARLON"',
    price: 30,
    currency: "kr",
    colors: [
      {
        name: "Olive",
        value: "#556B2F",
        images: [
          {
            url: "/olive-green-t-shirt-model.png",
            alt: "Olive green t-shirt front view",
          },
          {
            url: "/olive-green-t-shirt-back.png",
            alt: "Olive green t-shirt back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/black-t-shirt-model.png",
            alt: "Black t-shirt front view",
          },
          {
            url: "/black-t-shirt-back.png",
            alt: "Black t-shirt back view",
          },
        ],
      },
      {
        name: "Blue",
        value: "#A7C7E7",
        images: [
          {
            url: "/placeholder.svg?key=r2m9x",
            alt: "Light blue t-shirt front view",
          },
          {
            url: "/placeholder.svg?key=2yuu0",
            alt: "Light blue t-shirt back view",
          },
        ],
      },
      {
        name: "White",
        value: "#FFFFFF",
        images: [
          {
            url: "/white-t-shirt-model.png",
            alt: "White t-shirt front view",
          },
          {
            url: "/white-t-shirt-back-view.png",
            alt: "White t-shirt back view",
          },
        ],
      },
      {
        name: "Red",
        value: "#FF0000",
        images: [
          {
            url: "/placeholder.svg?key=etune",
            alt: "Red t-shirt front view",
          },
          {
            url: "/red-t-shirt-back-view.png",
            alt: "Red t-shirt back view",
          },
        ],
      },
      {
        name: "Navy",
        value: "#000080",
        images: [
          {
            url: "/placeholder.svg?key=109tc",
            alt: "Navy t-shirt front view",
          },
          {
            url: "/placeholder.svg?key=zjb9x",
            alt: "Navy t-shirt back view",
          },
        ],
      },
      {
        name: "Grey",
        value: "#808080",
        images: [
          {
            url: "/placeholder.svg?key=ncq1p",
            alt: "Grey t-shirt front view",
          },
          {
            url: "/placeholder.svg?key=5izdt",
            alt: "Grey t-shirt back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "XS", available: true },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: true },
      { name: "3XL", available: false },
      { name: "4XL", available: false },
    ],
    images: [
      {
        url: "/olive-green-t-shirt-model.png",
        alt: "Olive green t-shirt front view",
      },
    ],
    category: "kille",
    subcategory: "t-shirts",
  },
  {
    id: 2,
    name: 'SLIM FIT JEANS "ALEX"',
    price: 150,
    currency: "kr",
    colors: [
      {
        name: "Blue Denim",
        value: "#6F8FAF",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=blue+denim+jeans+on+model",
            alt: "Blue denim jeans front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=blue+denim+jeans+back+view",
            alt: "Blue denim jeans back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=black+jeans+on+model",
            alt: "Black jeans front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=black+jeans+back+view",
            alt: "Black jeans back view",
          },
        ],
      },
      {
        name: "Grey",
        value: "#808080",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+jeans+on+model",
            alt: "Grey jeans front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+jeans+back+view",
            alt: "Grey jeans back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "28/30", available: true },
      { name: "28/32", available: true },
      { name: "30/30", available: true },
      { name: "30/32", available: true },
      { name: "32/30", available: true },
      { name: "32/32", available: true },
      { name: "34/30", available: true },
      { name: "34/32", available: true },
      { name: "36/32", available: false },
    ],
    images: [
      {
        url: "/placeholder.svg?height=600&width=450&query=blue+denim+jeans+on+model",
        alt: "Blue denim jeans front view",
      },
    ],
    category: "kille",
    subcategory: "jeans",
  },
  {
    id: 3,
    name: 'HOODIE "LUCAS"',
    price: 120,
    currency: "kr",
    colors: [
      {
        name: "Grey Melange",
        value: "#C0C0C0",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+hoodie+on+model",
            alt: "Grey hoodie front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+hoodie+back+view",
            alt: "Grey hoodie back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=black+hoodie+on+model",
            alt: "Black hoodie front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=black+hoodie+back+view",
            alt: "Black hoodie back view",
          },
        ],
      },
      {
        name: "Navy",
        value: "#000080",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=navy+hoodie+on+model",
            alt: "Navy hoodie front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=navy+hoodie+back+view",
            alt: "Navy hoodie back view",
          },
        ],
      },
      {
        name: "Green",
        value: "#008000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=green+hoodie+on+model",
            alt: "Green hoodie front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=green+hoodie+back+view",
            alt: "Green hoodie back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "XS", available: false },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: false },
    ],
    images: [
      {
        url: "/placeholder.svg?height=600&width=450&query=grey+hoodie+on+model",
        alt: "Grey hoodie front view",
      },
    ],
    category: "kille",
    subcategory: "hoodies",
  },
  {
    id: 4,
    name: 'BASIC T-SHIRT "MARLON"',
    price: 30,
    salePrice: 20,
    isSale: true,
    currency: "kr",
    colors: [
      {
        name: "White",
        value: "#FFFFFF",
        images: [
          {
            url: "/white-t-shirt-model.png",
            alt: "White t-shirt front view",
          },
          {
            url: "/white-t-shirt-back-view.png",
            alt: "White t-shirt back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/black-t-shirt-model.png",
            alt: "Black t-shirt front view",
          },
          {
            url: "/black-t-shirt-back.png",
            alt: "Black t-shirt back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "XS", available: true },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: true },
    ],
    images: [
      {
        url: "/white-t-shirt-model.png",
        alt: "White t-shirt front view",
      },
    ],
    category: "kille",
    subcategory: "t-shirts",
  },
  {
    id: 5,
    name: 'CARGO PANTS "FELIX"',
    price: 200,
    currency: "kr",
    colors: [
      {
        name: "Beige",
        value: "#F5F5DC",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=beige+cargo+pants+on+model",
            alt: "Beige cargo pants front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=beige+cargo+pants+back+view",
            alt: "Beige cargo pants back view",
          },
        ],
      },
      {
        name: "Olive",
        value: "#556B2F",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=olive+cargo+pants+on+model",
            alt: "Olive cargo pants front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=olive+cargo+pants+back+view",
            alt: "Olive cargo pants back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=black+cargo+pants+on+model",
            alt: "Black cargo pants front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=black+cargo+pants+back+view",
            alt: "Black cargo pants back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "28/30", available: true },
      { name: "28/32", available: true },
      { name: "30/30", available: true },
      { name: "30/32", available: true },
      { name: "32/30", available: true },
      { name: "32/32", available: true },
      { name: "34/30", available: true },
      { name: "34/32", available: true },
    ],
    images: [
      {
        url: "/placeholder.svg?height=600&width=450&query=beige+cargo+pants+on+model",
        alt: "Beige cargo pants front view",
      },
    ],
    category: "kille",
    subcategory: "byxor",
  },
  {
    id: 6,
    name: 'SWEATSHIRT "NOAH"',
    price: 100,
    currency: "kr",
    isNew: true,
    colors: [
      {
        name: "Blue",
        value: "#0000FF",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=blue+sweatshirt+on+model",
            alt: "Blue sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=blue+sweatshirt+back+view",
            alt: "Blue sweatshirt back view",
          },
        ],
      },
      {
        name: "Grey",
        value: "#808080",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+sweatshirt+on+model",
            alt: "Grey sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=grey+sweatshirt+back+view",
            alt: "Grey sweatshirt back view",
          },
        ],
      },
      {
        name: "Black",
        value: "#000000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=black+sweatshirt+on+model",
            alt: "Black sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=black+sweatshirt+back+view",
            alt: "Black sweatshirt back view",
          },
        ],
      },
      {
        name: "Red",
        value: "#FF0000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=red+sweatshirt+on+model",
            alt: "Red sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=red+sweatshirt+back+view",
            alt: "Red sweatshirt back view",
          },
        ],
      },
      {
        name: "Green",
        value: "#008000",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=green+sweatshirt+on+model",
            alt: "Green sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=green+sweatshirt+back+view",
            alt: "Green sweatshirt back view",
          },
        ],
      },
      {
        name: "Yellow",
        value: "#FFFF00",
        images: [
          {
            url: "/placeholder.svg?height=600&width=450&query=yellow+sweatshirt+on+model",
            alt: "Yellow sweatshirt front view",
          },
          {
            url: "/placeholder.svg?height=600&width=450&query=yellow+sweatshirt+back+view",
            alt: "Yellow sweatshirt back view",
          },
        ],
      },
    ],
    sizes: [
      { name: "XS", available: true },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: true },
    ],
    images: [
      {
        url: "/placeholder.svg?height=600&width=450&query=blue+sweatshirt+on+model",
        alt: "Blue sweatshirt front view",
      },
    ],
    category: "kille",
    subcategory: "sweatshirts",
  },
]

// Helper function to get all unique sizes from products
export function getAllSizes() {
  const sizesSet = new Set<string>()

  products.forEach((product) => {
    product.sizes.forEach((size) => {
      if (size.available) {
        sizesSet.add(size.name)
      }
    })
  })

  return Array.from(sizesSet).sort((a, b) => {
    // Custom sorting for sizes
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]
    const aIndex = sizeOrder.indexOf(a)
    const bIndex = sizeOrder.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }

    return a.localeCompare(b)
  })
}

// Helper function to get all unique colors from products
export function getAllColors() {
  const colorsMap = new Map<string, { name: string; value: string }>()

  products.forEach((product) => {
    product.colors.forEach((color) => {
      colorsMap.set(color.name, { name: color.name, value: color.value })
    })
  })

  return Array.from(colorsMap.values())
}

// Helper function to get price range
export function getPriceRange() {
  let min = Number.POSITIVE_INFINITY
  let max = 0

  products.forEach((product) => {
    const price = product.salePrice || product.price
    if (price < min) min = price
    if (price > max) max = price
  })

  return [min, max] as [number, number]
}
