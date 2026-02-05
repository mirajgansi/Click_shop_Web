"use client";

import { useMemo, useState } from "react";
import { X, Search, Truck } from "lucide-react";

const mockDrivers = [
  { id: "d1", name: "Suman Karki", phone: "98xxxxxxx1", vehicle: "Bike", available: true },
  { id: "d2", name: "Aayush Shrestha", phone: "98xxxxxxx2", vehicle: "Van", available: true },
  { id: "d3", name: "Bikash Rai", phone: "98xxxxxxx3", vehicle: "Truck", available: false },
  { id: "d4", name: "Nisha Thapa", phone: "98xxxxxxx4", vehicle: "Bike", available: true },
];

export default function DriverSelectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const drivers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockDrivers;
    return mockDrivers.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.phone.toLowerCase().includes(s) ||
        d.vehicle.toLowerCase().includes(s),
    );
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white ring-1 ring-gray-200 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-900">Create Shipping Label</p>
            <p className="text-sm text-gray-500">Select a driver (UI only)</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl grid place-items-center hover:bg-gray-50 ring-1 ring-gray-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search driver by name, phone, vehicle..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="mt-4 space-y-2 max-h-[320px] overflow-auto pr-1">
            {drivers.map((d) => (
              <button
                key={d.id}
                disabled={!d.available}
                onClick={() => setSelected(d.id)}
                className={`w-full text-left rounded-2xl p-4 ring-1 transition ${
                  selected === d.id
                    ? "ring-gray-900 bg-gray-50"
                    : "ring-gray-200 hover:bg-gray-50"
                } ${!d.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                    <p className="text-sm text-gray-600">{d.phone} • {d.vehicle}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      d.available
                        ? "bg-green-50 text-green-700 ring-green-200"
                        : "bg-gray-50 text-gray-600 ring-gray-200"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${d.available ? "bg-green-500" : "bg-gray-400"}`} />
                    {d.available ? "Available" : "Busy"}
                  </span>
                </div>
              </button>
            ))}

            {!drivers.length ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-gray-100">
                No drivers found.
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                // UI only: no backend
                alert("Shipping label created (UI only).");
                onClose();
              }}
              disabled={!selected}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              <Truck className="h-4 w-4" />
              Confirm Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
