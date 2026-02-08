"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function formatMoney(n: any) {
  const num = Number(n ?? 0);
  return `Rs ${num.toFixed(2)}`;
}

function formatDate(d: any) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "pending").toLowerCase();

  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  if (s === "delivered") return <span className={`${base} bg-green-100 text-green-700`}>Delivered</span>;
  if (s === "cancelled") return <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>;
  if (s === "shipped") return <span className={`${base} bg-blue-100 text-blue-700`}>Shipped</span>;
  if (s === "processing") return <span className={`${base} bg-yellow-100 text-yellow-700`}>pending</span>;
  return <span className={`${base} bg-gray-100 text-gray-700`}>{status ?? "Pending"}</span>;
}

export default function OrdersList({ orders }: { orders: any[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((o) => {
      const id = String(o?._id ?? o?.id ?? "").toLowerCase();
      const status = String(o?.status ?? "").toLowerCase();
      const total = String(o?.total ?? o?.totalAmount ?? o?.grandTotal ?? "").toLowerCase();
      return id.includes(query) || status.includes(query) || total.includes(query);
    });
  }, [q, orders]);

  if (!orders?.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <p className="text-lg font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-gray-500">When you place an order, it will show up here.</p>
        <Link
          href="/user/products"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:opacity-90"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Orders</p>
            <p className="text-xs text-gray-500">{filtered.length} result(s)</p>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order id, status, total..."
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-black/40 sm:w-80"
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-12 gap-2 border-b bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
          <div className="col-span-5">Order</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="divide-y">
          {filtered.map((o) => {
            const id = o?._id ?? o?.id;
            const createdAt = o?.createdAt ?? o?.date;
            const total = o?.total ?? o?.totalAmount ?? o?.grandTotal ?? 0;
            const status = o?.status;

            return (
              <Link
                key={String(id)}
                href={id ? `/user/my_orders/${id}` : "#"}
                className="grid grid-cols-12 gap-2 px-4 py-4 hover:bg-black/5"
              >
                <div className="col-span-5">
                  <p className="text-sm font-semibold text-gray-900">
                    Order #{String(id).slice(-8)}
                  </p>
                  <p className="text-xs text-gray-500">Tap to view details</p>
                </div>

                <div className="col-span-3 text-sm text-gray-700">{formatDate(createdAt)}</div>
                <div className="col-span-2 text-sm font-semibold text-gray-900">{formatMoney(total)}</div>
                <div className="col-span-2">
                  <StatusBadge status={status} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
