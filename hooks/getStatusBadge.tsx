import { Badge } from "@/components/ui/badge";
import { Package, TruckIcon } from "lucide-react";

export const getStatusBadge = (status: string[]) => {
  if (status.includes("PLACED")) {
    return (
      <Badge className="rounded-none bg-blue-50 text-blue-500 hover:bg-yellow-100">
        <Package className="h-5 w-5 mr-1" />
        Placed
      </Badge>
    );
  } else if (status.includes("FULLY_DELIVERED")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none border-0 bg-green-100 text-green-800 hover:bg-green-100"
      >
        <TruckIcon className="h-5 w-5 mr-1" />
        Delivered
      </Badge>
    );
  } else if (status.includes("RELEASED")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-blue-100 text-blue-800 hover:bg-blue-100"
      >
        Processing
      </Badge>
    );
  } else if (status.includes("PARTIALLY_DELIVERED")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-green-100 text-green-800 hover:bg-green-100"
      >
        Partially Delivered
      </Badge>
    );
  } else if (status.includes("awaiting_customer_action")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-purple-100 text-purple-800 hover:bg-purple-100"
      >
        Awaiting Customer Action
      </Badge>
    );
  } else if (status.includes("customer_approved")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-green-100 text-green-800 hover:bg-green-100"
      >
        Customer Approved
      </Badge>
    );
  } else if (status.includes("CANCELLED")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-red-100 text-red-800 hover:bg-red-100"
      >
        Cancelled
      </Badge>
    );
  } else if (status.includes("customer_declined")) {
    return (
      <Badge
        variant="outline"
        className="rounded-none bg-red-100 text-red-800 hover:bg-red-100"
      >
        Customer Declined
      </Badge>
    );
  } else {
    return <Badge variant="outline">{status}</Badge>;
  }
};
