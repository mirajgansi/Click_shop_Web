import Image from "next/image";
import Link from "next/link";
import { handleGetOrderById } from "@/lib/actions/order-action";
import { OrderStatusPill } from "../componets/OrderStatusPill"; // adjust path
import OrderProgress from "./componenets/OrderProgress";
import UpdateOrderStatusPanel from "./componenets/UpdateOrderStatusPanel";


function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function formatAddress(a: any) {
  if (!a) return "N/A";
  const parts = [
    a.address1,
    a.address2,
    a.city,
    a.state,
    a.zip,
    a.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "N/A";
}

function countItems(items: any[]) {
  return (items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await handleGetOrderById(id);

  if (!res.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-100">
            <p className="text-red-600">Failed to load order: {res.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const order: any = res.data;
  const items = order?.items ?? [];
  const addr = order?.shippingAddress;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-200 hover:bg-gray-50"
              aria-label="Back"
            >
              ←
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Order-{String(order._id).slice(-5).toUpperCase()}
                </h1>
                <OrderStatusPill type="payment" value={order.paymentStatus} />
                <OrderStatusPill type="order" value={order.status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Order date{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}{" "}
                • Purchased via online store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50">
              Report
            </button>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50">
              Duplicate
            </button>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50">
              Share Order
            </button>
          </div>
        </div>

        {/* Layout: left main + right sidebar */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Progress / actions */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Estimated arrival:{" "}
                  <span className="font-semibold text-gray-900">
                    {addr?.city ? `1st to 3rd of February` : "N/A"}
                  </span>
                </div>

<Link
  href={`/admin/orders/${order._id}/shipping`}
  className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
>
  Create Shipping Label →
</Link>
              </div>

              <div className="mt-4">
                <OrderProgress status={order.status} />
              </div>

              <div className="mt-4">
                <button className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:text-gray-900">
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-3xl bg-white ring-1 ring-gray-100">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Products
                </h2>
                <div className="flex items-center gap-2">
                  <OrderStatusPill type="order" value={order.status} />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((it: any, idx: number) => (
                  <div key={idx} className="flex gap-4 px-5 py-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                      <Image
                        src={buildImageUrl(it.image)}
                        alt={it.name || "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {it.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {it.quantity} • Price: {money(it.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {money(it.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}

                {!items.length ? (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    No items found
                  </div>
                ) : null}
              </div>
            </div>

            {/* Payment details */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Payment Details
                </h2>
                <OrderStatusPill type="payment" value={order.paymentStatus} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <KeyVal label="Subtotal" value={money(order.subtotal)} />
                <KeyVal label="Items" value={`${countItems(items)} items`} />
                <KeyVal label="Shipping Fee" value={money(order.shippingFee)} />
                <KeyVal
                  label="Total"
                  value={money(order.total)}
                  strong
                />
              </div>

              {/* admin update */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <UpdateOrderStatusPanel
                  orderId={order._id}
                  currentStatus={order.status}
                  currentPayment={order.paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Note */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Order Note
                </h3>
                <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                  ✎
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {order.notes || "No note added."}
              </p>
            </div>

            {/* Customer */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Customer
                </h3>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gray-100" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {addr?.userName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Total: {countItems(items)} items
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Shipping Address
                </h3>
                <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                  ✎
                </button>
              </div>

              {/* map placeholder */}
              <div className="mt-4 h-32 w-full rounded-2xl bg-gray-100" />

              <p className="mt-3 text-sm font-semibold text-gray-900">
                {addr?.userName || "N/A"}
              </p>
              <p className="mt-1 text-sm text-gray-600">{formatAddress(addr)}</p>

              <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                View on Map
              </button>
            </div>

            {/* Contact */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h3>
                <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                  ✎
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="inline-flex items-center rounded-2xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
                  📞 <span className="ml-2">{addr?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-10" />
      </div>
    </div>
  );
}

function KeyVal({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? "font-bold text-gray-900" : "font-semibold text-gray-900"}>
        {value}
      </span>
    </div>
  );
}
