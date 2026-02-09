"use client";

import { useMemo, useState } from "react";
import { Package, Truck, MapPin, AlertTriangle } from "lucide-react";
import DriverSelectModal from "./DriverSelectModal";
import OrderProgress from "../../componenets/OrderProgress";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export default function ShipmentLayout({ order }: { order: any }) {
  const [open, setOpen] = useState(false);

  // UI-only shipment timeline (dynamic based on status)
  const events = useMemo(() => {
    const base = [
      {
        title: "Order Placed",
        time: "10 Jun 2024 • 14:00",
        desc: "Shipment information received by seller",
        icon: Package,
        done: true,
      },
      {
        title: "Preparing to ship",
        time: "10 Jun 2024 • 14:30",
        desc: "Seller is preparing your order",
        icon: Package,
        done: order.status !== "pending",
      },
      {
        title: "Picked up",
        time: "10 Jun 2024 • 15:55",
        desc: "Shipment picked up by carrier",
        icon: Truck,
        done: order.status === "shipped" || order.status === "delivered",
      },
      {
        title: "Delivered",
        time: "11 Jun 2024 • 12:20",
        desc: "Delivered to destination",
        icon: MapPin,
        done: order.status === "delivered",
      },
    ];
    return base;
  }, [order.status]);

  const statusChip = getStatusChip(order.status);
const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* address card */}
      <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {order.shippingAddress?.address1 || "Address"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {formatAddress(order.shippingAddress)}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusChip.cls}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusChip.dot}`} />
            {statusChip.label}
          </span>
        </div>

        {/* progress mini bar */}
        <div className="mt-4">
    <OrderProgress status={order.status}  />
        </div>

        {/* warning box (optional) */}
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>
              High volume: During peak seasons, there can be delays in shipping.
            </p>
          </div>
        </div>

        {/* Create label button */}
        <div className="mt-4 flex items-center justify-between">
          <button className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:text-gray-900">
            View carrier details
          </button>

          <button
            onClick={() => setOpen(true)}
            className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Create Shipping Label →
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Shipment Status
        </h2>

        <div className="mt-4 space-y-4">
          {events.map((e, idx) => {
            const Icon = e.icon;
            return (
              <div key={idx} className="flex gap-3">
                <div
                  className={`mt-0.5 h-9 w-9 rounded-2xl ring-1 grid place-items-center ${
                    e.done
                      ? "bg-gray-900 text-white ring-gray-900"
                      : "bg-white text-gray-400 ring-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        e.done ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {e.title}
                    </p>
                    <p className="text-xs text-gray-500">{e.time}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{e.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver selector modal (UI-only) */}
<DriverSelectModal
  open={open}
  onClose={() => setOpen(false)}
  orderId={order._id}   // ✅ pass real order id
/>    </div>
  );
}

function formatAddress(a: any) {
  if (!a) return "N/A";
  const parts = [a.address1, a.address2, a.city, a.state, a.zip, a.country].filter(
    Boolean,
  );
  return parts.join(", ");
}

function getStatusChip(status: OrderStatus) {
  if (status === "pending")
    return { label: "In Progress", cls: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-500" };
  if (status === "paid")
    return { label: "Ready", cls: "bg-yellow-50 text-yellow-800 ring-yellow-200", dot: "bg-yellow-500" };
  if (status === "shipped")
    return { label: "In Transit", cls: "bg-purple-50 text-purple-700 ring-purple-200", dot: "bg-purple-500" };
  if (status === "delivered")
    return { label: "Delivered", cls: "bg-green-50 text-green-700 ring-green-200", dot: "bg-green-500" };
  return { label: "Cancelled", cls: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" };
}

function ProgressRail({ status }: { status: OrderStatus }) {
  const step =
    status === "pending" ? 1 : status === "paid" ? 2 : status === "shipped" ? 3 : status === "delivered" ? 4 : 1;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Order</span>
        <span>Prepare</span>
        <span>Ship</span>
        <span>Deliver</span>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gray-900"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
