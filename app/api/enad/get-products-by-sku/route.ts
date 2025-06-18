import { getProductsBySkuHandler } from '@enadhq/commerce/backend'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return getProductsBySkuHandler(request)
}
