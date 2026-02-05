"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateOrderStatus } from "@/lib/actions/order-action";
import ConfirmModal from "@/app/_componets/CofirmModal";

export default function ShippingTopBar({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onCancelConfirm = () => {
    setError(null);
    startTransition(async () => {
      const res = await handleUpdateOrderStatus(id, { status: "cancelled" });

      if (!res.success) {
        setError(res.message);
        return;
      }

      setOpen(false);
      router.refresh(); // ✅ fetch latest status
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/orders/${id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-200 hover:bg-gray-50"
            aria-label="Back"
          >
            ←
          </Link>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              SHP-{String(id).slice(-4).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500">
              Shipping date • Order ID{" "}
              <span className="font-semibold text-gray-900">
                {String(id).slice(-6).toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50"
          >
            Cancel Order
          </button>

          <button
            className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Notify Customer
          </button>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="Cancel Order?"
        description="This will cancel the order and stop shipping actions."
        confirmText={pending ? "Cancelling..." : "Yes, cancel"}
        cancelText="No, keep it"
        disabled={pending}
        error={error}
        onClose={() => {
          if (!pending) setOpen(false);
        }}
        onConfirm={onCancelConfirm}
      />
    </>
  );
}
