import { handleDeleteAccount } from '@enadhq/commerce/backend'

export async function POST() {
  return handleDeleteAccount()
}
