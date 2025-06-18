import { Api } from "@enadhq/commerce/brink";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  Building,
  CheckCircle,
  Clock,
  Edit,
  MessageSquare,
  Package,
  RefreshCcw,
  ShoppingCart,
  Truck,
  User,
  UserRoundCheck,
  UserRoundCog,
  UserX,
  XCircle,
} from "lucide-react";

interface OrderHistoryTimelineProps {
  orderHistory: Api.BrinkOrderHistory;
}

export function OrderHistoryTimeline({
  orderHistory,
}: OrderHistoryTimelineProps) {
  // Sort history by timestamp (newest first)
  const sortedHistory = [...orderHistory.history]
    .filter((entry) => entry.type !== "REMOVE_CUSTOM_STATE")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const getIcon = (entry: Api.BrinkOrderHistoryEntry) => {
    const { type, operation, operationId } = entry;

    switch (type) {
      case "ADD_COMMENT":
        return <MessageSquare className="h-5 w-5" />;
      case "ORDER_APPROVED":
        return <CheckCircle className="h-5 w-5" />;
      case "ORDER_DECLINED":
        return <XCircle className="h-5 w-5" />;
      case "ORDER_CREATED":
        return <ShoppingCart className="h-5 w-5" />;
      case "ORDER_MODIFIED":
        return <Edit className="h-5 w-5" />;
      case "STATUS_CHANGED":
        return <AlertCircle className="h-5 w-5" />;
      case "SHIPPING_UPDATED":
        return <Truck className="h-5 w-5" />;
      case "ORDER_SHIPPED":
        return <Truck className="h-5 w-5" />;
      case "ORDER_DELIVERED":
        return <Package className="h-5 w-5" />;
      case "OPERATION_CREATED":
        if (operation === "CANCELLATION") return <Ban className="h-5 w-5" />;
        return <Clock className="h-5 w-5" />;
      case "OPERATION_STARTED":
        return <ArrowRight className="h-5 w-5" />;
      case "OPERATION_COMPLETED":
        return <CheckCircle className="h-5 w-5" />;
      case "CANCEL_PAYMENT":
        return <Ban className="h-5 w-5" />;
      case "ADD_CUSTOM_STATE":
        if (operationId === "awaiting_customer_action")
          return <UserRoundCog className="h-5 w-5" />;
        if (operationId === "customer_declined")
          return <UserX className="h-5 w-5" />;
        return <UserRoundCheck className="h-5 w-5" />;
      default:
        return <RefreshCcw className="h-5 w-5" />;
    }
  };

  const getIconColor = (entry: Api.BrinkOrderHistoryEntry) => {
    const { type, operation, status, operationId } = entry;

    // Handle cancellation flow with special colors
    if (operation === "CANCELLATION") {
      if (status === "SKIPPED") return "text-gray-600 bg-gray-100";
      if (type === "OPERATION_COMPLETED") return "text-green-600 bg-green-100";
      return "text-red-600 bg-red-100";
    }

    switch (type) {
      case "ADD_COMMENT":
        return "text-blue-600 bg-blue-100";
      case "ORDER_APPROVED":
        return "text-green-600 bg-green-100";
      case "ORDER_DECLINED":
        return "text-red-600 bg-red-100";
      case "ORDER_CREATED":
        return "text-purple-600 bg-purple-100";
      case "ORDER_MODIFIED":
        return "text-amber-600 bg-amber-100";
      case "STATUS_CHANGED":
        return "text-orange-600 bg-orange-100";
      case "SHIPPING_UPDATED":
      case "ORDER_SHIPPED":
        return "text-indigo-600 bg-indigo-100";
      case "ORDER_DELIVERED":
        return "text-emerald-600 bg-emerald-100";
      case "ADD_CUSTOM_STATE":
        if (operationId === "awaiting_customer_action")
          return "bg-purple-100 text-purple-800";
        if (operationId === "customer_declined")
          return "text-red-600 bg-red-100";
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTitle = (entry: Api.BrinkOrderHistoryEntry) => {
    const { type, operation, status } = entry;

    // Handle cancellation flow
    if (operation === "CANCELLATION") {
      switch (type) {
        case "OPERATION_CREATED":
          return "Cancellation Requested";
        case "OPERATION_STARTED":
          return "Cancellation Process Started";
        case "CANCEL_PAYMENT":
          return `Payment Cancellation ${
            status === "SKIPPED" ? "Skipped" : "Processed"
          }`;
        case "OPERATION_COMPLETED":
          return "Order Cancellation Completed";
        default:
          return "Cancellation Action";
      }
    }

    switch (type) {
      case "ADD_COMMENT":
        return "Comment Added";
      case "ORDER_APPROVED":
        return "Order Approved";
      case "ORDER_DECLINED":
        return "Order Declined";
      case "ORDER_CREATED":
        return "Order Created";
      case "ORDER_MODIFIED":
        return "Order Modified";
      case "STATUS_CHANGED":
        return `Status Changed to ${
          entry.status !== "NONE" ? entry.status : "Updated"
        }`;
      case "SHIPPING_UPDATED":
        return "Shipping Information Updated";
      case "ORDER_SHIPPED":
        return "Order Shipped";
      case "ORDER_DELIVERED":
        return "Order Delivered";
      case "ADD_CUSTOM_STATE":
        return "Status Updated";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case "CLIENT":
        return <User className="h-3 w-3" />;
      case "AGENT":
        return <User className="h-3 w-3" />;
      case "SYSTEM":
        return <Building className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getOperationCustomState = (state: string) => {
    switch (state) {
      case "customer_declined":
        return "Customer Declined";
      case "customer_approved":
        return "Customer Approved";
      case "awaiting_customer_action":
        return "Awaiting Customer Action";
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: any) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-0">
      {sortedHistory.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No history available for this order
        </div>
      ) : (
        <div className="relative">
          {/* Timeline connector line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-muted" />

          {/* Timeline events */}
          <div className="space-y-6">
            {sortedHistory.map((entry, index) => (
              <div
                key={entry.operationId + "-" + index}
                className="relative flex gap-4 pt-2"
              >
                <div
                  className={`z-10 flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full ${getIconColor(
                    entry
                  )}`}
                >
                  {getIcon(entry)}
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium">{getTitle(entry)}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>

                  {entry.actor && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted/50">
                          {getActorIcon(entry.actor.type)}
                        </span>
                        {entry.actor.name}
                      </span>
                      <span className="text-xs">({entry.actor.type})</span>
                    </div>
                  )}

                  {!entry.actor && entry.operation === "CANCELLATION" && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted/50">
                          <Building className="h-3 w-3" />
                        </span>
                        System
                      </span>
                    </div>
                  )}

                  {entry.message && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {entry.message}
                    </div>
                  )}

                  {entry.operation === "CUSTOM_STATE" && (
                    <div className="mt-1 text-sm bg-muted/30 p-2 rounded-md">
                      {getOperationCustomState(entry.operationId)}
                    </div>
                  )}

                  {entry.comment && entry.comment.text && (
                    <div className="mt-1 text-sm bg-muted/30 p-2 rounded-md">
                      {entry.comment.text}
                    </div>
                  )}

                  {entry.reason &&
                    (entry.reason.cause || entry.reason.code) && (
                      <div className="mt-1 text-sm bg-muted/30 p-2 rounded-md">
                        <strong>Reason: </strong>
                        {entry.reason.cause || entry.reason.code}
                      </div>
                    )}

                  {entry.status !== "NONE" && (
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        Status: {entry.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
