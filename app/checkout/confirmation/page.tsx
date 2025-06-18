"use server"

import Confirmation from "@/components/commerce/confirmation"
import { Params } from "next/dist/server/request/params"

export default async function CheckoutPage(props: {
  params: Promise<Params>
  searchParams: Promise<any>
}) {
  const searchParams = await props.searchParams

  return <Confirmation orderId={searchParams?.orderId} />
}
