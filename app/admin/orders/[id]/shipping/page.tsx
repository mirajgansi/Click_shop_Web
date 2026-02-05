import Link from "next/link";
import ShipmentLayout from "./components/ShipmentLayout";
import ShippingTopBar from "./components/ShippingTopBar";

// UI-only mock (replace later with handleGetOrderById)
const mockOrder = {
  _id: "ORDER-12567",
  status: "shipped" as const, // try: pending | paid | shipped | delivered | cancelled
  shippingAddress: {
    userName: "Bagus Fikri",
    phone: "+977-9800000000",
    address1: "2118 Thornridge Cir",
    city: "Syracuse",
    state: "CT",
    zip: "35624",
    country: "Nepal",
  },
  items: [{ quantity: 2 }],
};

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Later: const res = await handleGetOrderById(id)
  // For now UI-only:
  const order = { ...mockOrder, _id: id };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-6 py-5">
        {/* Top bar */}
  <ShippingTopBar id={id} />

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT panel */}
          <div className="lg:col-span-5">
            <ShipmentLayout order={order}/>
          </div>

          {/* RIGHT map */}
          <div className="lg:col-span-7">
            <div className="h-[720px] w-full overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100">
              {/* Map placeholder (UI only) */}
              <div className="relative h-full w-full bg-gray-100">
                <div className="absolute inset-0 grid place-items-center text-gray-500">
                  <div className="text-center">
                    <p className="text-sm font-semibold">Map (UI placeholder)</p>
                    <p className="mt-1 text-xs">
                      Later you can embed Mapbox/Google Maps here.
                    </p>
                  </div>
                </div>

                {/* fake tooltip card */}
                <div className="absolute bottom-6 left-6 rounded-2xl bg-gray-900 px-4 py-3 text-white shadow-lg">
                  <p className="text-xs text-white/80">MSW Warehouse</p>
                  <p className="text-sm font-semibold">741 Nicolette Freeway</p>
                  <p className="text-xs text-white/80">15:32 • GMT +5:45</p>
                </div>

                {/* map controls */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                  <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold ring-1 ring-gray-200">
                    Satellite View
                  </button>
                  <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold ring-1 ring-gray-200">
                    Map View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
