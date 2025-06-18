"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Api, changeOrderCustomState } from "@enadhq/commerce/brink";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function OrderDecision({ order }: { order: Api.BrinkOrder }) {
  const params = useParams();
  const router = useRouter();
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const currentCustomStates = order.status?.customStates.map((s) => s.id) || [];

  const handleApproveOrder = async () => {
    const statesToRemove = ["awaiting_customer_action", "customer_declined"];
    const currentStates = order.status?.customStates.map((s) => s.id) || [];

    startUpdateTransition(() => {
      toast.promise(
        (async () => {
          // Lägg till "approved" om inte redan satt
          if (!currentStates.includes("customer_approved")) {
            await changeOrderCustomState("customer_approved", order.id, "add");
          }

          // Ta bort irrelevanta states
          await Promise.all(
            statesToRemove.map((state) =>
              currentStates.includes(state)
                ? changeOrderCustomState(state, order.id, "remove")
                : Promise.resolve()
            )
          );

          router.refresh();
        })(),
        {
          loading: "Approving order...",
          success: "Order approved!",
          error: (err) => err.message || "Something went wrong",
        }
      );
    });
  };

  const handleDeclineOrder = async () => {
    const statesToRemove = ["awaiting_customer_action", "customer_approved"];
    const currentStates = order.status?.customStates.map((s) => s.id) || [];

    startUpdateTransition(() => {
      toast.promise(
        (async () => {
          // Lägg till declined om den inte redan finns
          if (!currentStates.includes("customer_declined")) {
            await changeOrderCustomState("customer_declined", order.id, "add");
          }

          // Ta bort eventuella tidigare state
          await Promise.all(
            statesToRemove.map((state) =>
              currentStates.includes(state)
                ? changeOrderCustomState(state, order.id, "remove")
                : Promise.resolve()
            )
          );

          setShowDeclineDialog(false);
          router.refresh();
        })(),
        {
          loading: "Declining order...",
          success: "Order declined!",
          error: (err) => err.message || "Something went wrong",
        }
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Decision</CardTitle>
        <CardDescription>
          Approve or decline this purchase order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Please review the order details carefully before making your decision.
          Once approved, the order will be processed and sent to our fulfillment
          team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {!currentCustomStates.includes("customer_approved") && (
            <Button className="flex-1" onClick={handleApproveOrder}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Order
            </Button>
          )}

          <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
            {!currentCustomStates.includes("customer_declined") && (
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline Order
                </Button>
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Decline Order</DialogTitle>
                <DialogDescription>
                  Please provide a reason for declining this order. This
                  feedback will be sent to your agent.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Enter your reason for declining this order..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                rows={4}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeclineDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeclineOrder}>
                  Decline Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Request Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
