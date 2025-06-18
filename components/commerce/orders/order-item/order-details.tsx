import ReOrder from "@/components/re-order";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadge } from "@/hooks/getStatusBadge";
import { Api } from "@enadhq/commerce/brink";
import { localizedPrice } from "@enadhq/commerce/storefront";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderHistoryTimeline } from "../order-history/order-history-timeline";

export default function OrderDetails({
  order,
  orderHistory,
  market,
}: {
  order: Api.BrinkOrder;
  orderHistory: Api.BrinkOrderHistory;
  market: any;
}) {
  return (
    <div className="container mx-auto lg:px-6 px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/account/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold uppercase">
          Order #{order?.reference}
        </h1>
        <div className="ml-4">{getStatusBadge(order?.status?.orderStates)}</div>
        {order?.status?.customStates?.length ? (
          <div>
            {order?.status?.customStates.map((state) => (
              <span key={state.id} className="ml-2">
                {getStatusBadge([state?.id])}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* {!order.status?.orderStates.includes("CANCELLED") &&
            order?.attributes?.merchantReference2 && (
              <OrderDecision order={order} />
            )} */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Items
                <ReOrder
                  market={market}
                  order={order}
                  buttonText={"Beställ igen"}
                  buttonClassName="border-none bg-black text-white w-auto px-3 py-2 h-auto"
                  disableToolTip
                />
              </CardTitle>
              <CardDescription>
                Products included in this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.orderLines?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.productVariantId}</TableCell>
                      <TableCell className="text-right">
                        {localizedPrice(
                          item.totalPriceAmount,
                          false,
                          market.language,
                          market.currency
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>
                Special instructions from your agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md">
                {mockOrder.notes || "No special instructions provided."}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>
                Timeline of events for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderHistoryTimeline orderHistory={orderHistory} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date(order.date).toLocaleString("sv-SE")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <div className="flex">
                  <span>{getStatusBadge(order?.status?.orderStates)}</span>
                  {order?.status?.customStates?.length ? (
                    <div>
                      {order?.status?.customStates.map((state) => (
                        <span key={state.id} className="ml-2">
                          {getStatusBadge([state?.id])}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frakt</span>
                  {localizedPrice(
                    order?.totals.shippingTotal,
                    false,
                    market.language,
                    market.currency
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delsumma</span>
                  {localizedPrice(
                    order?.totals.subTotal,
                    false,
                    market.language,
                    market.currency
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rabatt</span>
                  {localizedPrice(
                    order?.totals.discountTotal,
                    false,
                    market.language,
                    market.currency
                  )}
                </div>
                {order?.totals?.discountTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    {localizedPrice(
                      order?.totals.discountTotal,
                      false,
                      market.language,
                      market.currency
                    )}
                  </div>
                )}
                {order?.totals.giftCardTotal > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="mr-1">Giftcard:</span>
                    {localizedPrice(
                      order?.totals.giftCardTotal,
                      false,
                      market.language,
                      market.currency
                    )}
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  {localizedPrice(
                    order?.totals.grandTotal,
                    false,
                    market.language,
                    market.currency
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-medium">
                  {order?.billingAddress?.givenName}{" "}
                  {order?.billingAddress?.familyName}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {order?.billingAddress?.streetAddress},{" "}
                    {order?.billingAddress?.postalCode},{" "}
                    {order?.billingAddress?.city},{" "}
                    {order?.billingAddress?.country}
                  </div>
                  <p>{order?.billingAddress?.telephoneNumber}</p>
                  <p>{order?.billingAddress?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-medium">
                  {order?.shippingAddress?.givenName}{" "}
                  {order?.shippingAddress?.familyName}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {order?.shippingAddress?.streetAddress},{" "}
                    {order?.shippingAddress?.postalCode},{" "}
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.country}
                  </div>
                  <p>{order?.shippingAddress?.telephoneNumber}</p>
                  <p>{order?.shippingAddress?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Your Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium text-lg">
                  {mockOrder.agent.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Account Manager
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <a
                    href={`mailto:${mockOrder.agent.email}`}
                    className="text-primary hover:underline"
                  >
                    {mockOrder.agent.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <a
                    href={`tel:${mockOrder.agent.phone}`}
                    className="text-primary hover:underline"
                  >
                    {mockOrder.agent.phone}
                  </a>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Contact Agent
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
