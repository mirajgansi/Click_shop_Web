"use client";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const steps = [
  { key: "pending", label: "Review order" },
  { key: "paid", label: "Preparing order" },
  { key: "shipped", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
] as const;

function stepIndex(status: OrderStatus) {
  if (status === "cancelled") return 0;
  const idx = steps.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderProgress({ status }: { status: OrderStatus }) {
  const current = stepIndex(status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full ring-1 flex items-center justify-center text-sm font-bold ${
                  i <= current
                    ? "bg-gray-900 text-white ring-gray-900"
                    : "bg-white text-gray-500 ring-gray-200"
                }`}
              >
                {i + 1}
              </div>

              <div className="min-w-0">
                <p className={`text-sm font-semibold ${i <= current ? "text-gray-900" : "text-gray-500"}`}>
                  {s.label}
                </p>
              </div>
            </div>

            {i !== steps.length - 1 ? (
              <div className="mt-3 h-1 w-full rounded-full bg-gray-100">
                <div
                  className={`h-1 rounded-full ${
                    i < current ? "w-full bg-gray-900" : "w-0 bg-gray-900"
                  }`}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {status === "cancelled" ? (
        <p className="mt-3 text-sm font-semibold text-red-600">
          This order is cancelled.
        </p>
      ) : null}
    </div>
  );
}
