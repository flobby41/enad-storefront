import { handleLoginEnadUser } from '@enadhq/commerce/backend'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return handleLoginEnadUser(request)
}
