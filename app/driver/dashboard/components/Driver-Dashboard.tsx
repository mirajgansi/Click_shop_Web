"use client";

import { useEffect, useMemo, useState } from "react";
import { getDriverDetail, getDriverStatsById } from "@/lib/api/driver"; // adjust path
import { useAuth } from "@/context/AuthContext"; // if you have current user here
import { handleGetMyAssignedOrders } from "@/lib/actions/order-action";

function formatDate(d?: string) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      {sub ? <p className="mt-2 text-sm text-gray-600">{sub}</p> : null}
    </div>
  );
}

export default  function DriverDashboardPage() {
  const { user } = useAuth() as any; 
  const driverId = user?._id;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [assigned, setAssigned] = useState<number>(0);
  const [delivered, setDelivered] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<string>("—");
  const [driverName, setDriverName] = useState<string>("Driver");
const [activityType, setActivityType] = useState<string>("—");
const [activityOrderId, setActivityOrderId] = useState<string | null>(null);

  
  const lastActivityLabel = useMemo(() => {
    return lastActivity === "—" ? "No activity info available" : `Last seen: ${lastActivity}`;
  }, [lastActivity]);

useEffect(() => {
  const run = async () => {
    try {
      setLoading(true);
      setErr(null);

      if (!driverId) {
        setErr("Driver id not found. Please login again.");
        return;
      }

      const ordersRes: any = await handleGetMyAssignedOrders({ page: 1, size: 200 });

      if (ordersRes?.success === false) {
        throw new Error(ordersRes.message || "Failed to load assigned orders");
      }

      const odata = ordersRes?.data ?? ordersRes;
      const meta = odata?.pagination || odata?.meta || {};

      const list =
        odata?.orders ||
        odata?.items ||
        (Array.isArray(odata) ? odata : []) ||
        [];

      const totalAssigned = Number(meta?.total ?? odata?.total ?? list.length ?? 0);
      setAssigned(totalAssigned);

      const deliveredCount = list.filter((o: any) => o.status === "delivered").length;
      setDelivered(deliveredCount);

      const getOrderTime = (o: any) =>
        new Date(o.updatedAt || o.createdAt || 0).getTime();

      const lastOrder = [...list]
        .filter((o: any) => o.createdAt || o.updatedAt)
        .sort((a: any, b: any) => getOrderTime(b) - getOrderTime(a))[0];

      if (lastOrder) {
        const when = lastOrder.updatedAt || lastOrder.createdAt;
        setLastActivity(formatDate(when));
        setActivityOrderId(lastOrder._id || null);

        if (lastOrder.status === "delivered") setActivityType("Delivered");
        else if (lastOrder.status === "shipped" || lastOrder.status === "pending")
          setActivityType("Assigned/Updated");
        else setActivityType(`Status: ${lastOrder.status}`);
      } else {
        setLastActivity("—");
        setActivityType("—");
        setActivityOrderId(null);
      }

      const detailRes: any = await getDriverDetail(driverId);
      const detail = detailRes?.data ?? detailRes;
      setDriverName(detail?.name || detail?.username || "Driver");
    } catch (e: any) {
      setErr(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  run();
}, [driverId]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : `Welcome, ${driverName}`}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{lastActivityLabel}</p>
          </div>

        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700  items-center ">
            {err}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Orders Assigned"
            value={loading ? "—" : assigned}
            sub="All orders assigned to you"
          />
          <StatCard
            title="Total Delivered"
            value={loading ? "—" : delivered}
            sub="Orders you have completed"
          />

        </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
  <p className="text-sm font-semibold text-gray-800">My Last Activity</p>

  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-xs text-gray-500">Activity</p>
      <p className="text-lg font-bold text-gray-900">{activityType}</p>

      <p className="mt-1 text-sm text-gray-600">
        {lastActivity === "—" ? "No recent order activity found." : lastActivity}
      </p>

      {activityOrderId ? (
        <p className="mt-1 text-xs text-gray-500">
          Order: <span className="font-semibold">{activityOrderId}</span>
        </p>
      ) : null}
    </div>

    {activityOrderId ? (
      <a
        href={`/driver/orders/${activityOrderId}`}
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
      >
        View Order
      </a>
    ) : null}
  </div>
</div>

      </div>
    </div>
  );
}
