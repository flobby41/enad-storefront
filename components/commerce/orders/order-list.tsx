"use client";

import ReOrder from "@/components/re-order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getStatusBadge } from "@/hooks/getStatusBadge";
import {
  getBrinkOrdersByEmail,
  getBrinkOrdersByMerchantRef,
} from "@enadhq/commerce/brink";
import { EnadUser } from "@enadhq/commerce/enad";
import { localizedPrice } from "@enadhq/commerce/storefront";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OrderListProps {
  user: EnadUser;
  market: any;
}

export default function OrderList({ user, market }: OrderListProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>(
    user?.organisations?.[0]?.id
  );
  const selectedCompanyData = user?.organisations?.find(
    (org) => org.id === selectedCompany
  );

  function useOrdersById() {
    return useQuery({
      enabled: !!selectedCompany,
      queryFn: () =>
        getBrinkOrdersByMerchantRef(
          selectedCompanyData?.external_ref ||
            selectedCompanyData?.organisation_number.replace("-", "") ||
            ""
        ),
      queryKey: [selectedCompany, "ref"],
    });
  }

  const { data: ordersById, error, isLoading, refetch } = useOrdersById();

  function useOrdersByEmail() {
    return useQuery({
      enabled: !!user?.email,
      queryFn: () => getBrinkOrdersByEmail(user?.email || ""),
      queryKey: [user?.email, "email"],
    });
  }

  const { data: ordersByEmail } = useOrdersByEmail();

  function handleChangeCompany(e: string) {
    setSelectedCompany(e);
    refetch();
  }

  // Merge orders from both sources, removing duplicates by reference
  const mergedOrders = [
    ...(ordersByEmail?.orderSummaries ?? []),
    ...(ordersById?.orderSummaries ?? []),
  ];

  const orders = mergedOrders.filter(
    (order, index, self) =>
      self.findIndex((o) => o.reference === order.reference) === index
  );

  const [statusFilter, setStatusFilter] = useState("ALL");

  function filterOrdersByStatus(orders: any[], status: string) {
    if (status === "ALL") return orders;
    if (status === "PLACED")
      return orders.filter((order) =>
        order.status?.orderStates?.includes("PLACED")
      );
    if (status === "DELIVERED")
      return orders.filter((order) =>
        order.status?.orderStates?.includes("FULLY_DELIVERED")
      );
    if (status === "DECLINED")
      return orders.filter((order) =>
        order.status?.orderStates?.includes("DECLINED")
      );
    return orders;
  }

  return (
    <div className="lg:px-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/account/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold uppercase">Mina ordrar</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="sr-only">
              <CardTitle className="mb-4"></CardTitle>
              <CardDescription></CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Filter by company:
                </span>
                <Select
                  value={selectedCompany}
                  onValueChange={handleChangeCompany}
                >
                  <SelectTrigger className="w-[180px] rounded-none">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.organisations?.map((org) => (
                      <SelectItem value={org.id} key={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Filter by status:
                </span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Orders</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="DECLINED">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7} className="text-center py-6">
                      <Skeleton className="h-7 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : orders && orders.length > 0 ? (
                filterOrdersByStatus(orders, statusFilter)
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((order) => (
                    <TableRow key={order.reference}>
                      <TableCell className="font-medium">
                        #{order.reference}
                      </TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleString("sv-SE")}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status?.orderStates)}
                        {order?.status?.customStates?.length ? (
                          <div>
                            {order?.status?.customStates.map((state) => (
                              <span key={state.id} className="ml-2">
                                {getStatusBadge([state?.id])}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right">
                        {localizedPrice(
                          order.totals?.grandTotal,
                          false,
                          market.language,
                          market.currency
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ReOrder market={market} order={order} />

                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/account/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>

                          {/* {order.status?.orderStates?.includes("PLACED") && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-green-600 border-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-600 border-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Decline</span>
                            </Button>
                          </>
                        )} */}

                          {/* <Button
                          variant="outline"
                          size="icon"
                          className="text-blue-600 border-blue-600"
                        >
                          <Clock className="h-4 w-4" />
                          <span className="sr-only">Track</span>
                        </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No orders found matching the selected filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
