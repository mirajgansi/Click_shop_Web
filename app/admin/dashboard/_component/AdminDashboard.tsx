"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type KPI = {
  title: string;
  value: string;
  // delta: string;
  positive?: boolean;
};

type Props = {
  initial: any;
  user: any; 
};
function Sparkline({ dataKey = "value", data }: { dataKey?: string; data: any[] }) {
  return (
    <div className="mt-3 h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            strokeWidth={2}
            dot={false}
            stroke="#94A3B8" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function getGreeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good Morning 👋";
  if (h < 18) return "Good Afternoon 👋";
  return "Good Evening 👋";
}
const pieColors = ["#F59E0B", "#60A5FA", "#A855F7", "#22C55E", "#FB7185"];

function TrendPill({ positive = true, 
  // value
 }: { positive?: boolean;
  //  value: string
   }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
      ].join(" ")}
    >
      <span className={positive ? "text-green-600" : "text-red-600"}>{positive ? "↗" : "↘"}</span>
      {/* {value} */}
    </span>
  );
}

function Card({
  title,
  right,
  children,
  className = "",
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"rounded-2xl border border-gray-100 bg-white p-4 shadow-sm " + className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </div>
  );
}

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${Math.round(n)}`;
}

function labelFromEarningsId(id: any) {
  if (!id) return "";
  if (id.day) return `${id.month}/${id.day}`;
  if (id.week) return `W${id.week}`;
  if (id.month) return `${id.month}/${String(id.year).slice(-2)}`;
  return "";
}

export default function DashboardClient({ initial, user }: Props) {
  const [rangeMode, setRangeMode] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

    const greeting = getGreeting(new Date());

  const name =
    user?.username ||
    user?.name ||
    user?.fullName ||
    user?.email?.split?.("@")?.[0] ||
    "Admin";

  const ok = initial?.success;

  const kpiData = initial?.kpis ?? { revenue: 0, orders: 0, avgOrderValue: 0, customers: 0 };
  const earningsRaw = Array.isArray(initial?.earnings) ? initial.earnings : [];
  const categories = Array.isArray(initial?.categories) ? initial.categories : [];
  const topProducts = Array.isArray(initial?.topProducts) ? initial.topProducts : [];
  const drivers = Array.isArray(initial?.drivers) ? initial.drivers : [];

  // chart: convert backend format -> { day: string, value: number }
  const earnings = useMemo(() => {
    return earningsRaw.map((r: any) => ({
      day: labelFromEarningsId(r?._id),
      value: Number(r?.value) || 0,
    }));
  }, [earningsRaw]);

  // KPI cards from real data (you can change titles)
  const kpis: KPI[] = useMemo(() => {
    return [
      {
        title: "Total Revenue",
        value: `₹.${formatMoney(Number(kpiData.revenue) || 0)}`,
        delta: "—",
        positive: true,
      },
      {
        title: "Avg. Transaction Value",
        value: `₹.${formatMoney(Number(kpiData.avgOrderValue) || 0)}`,
        delta: "—",
        positive: true,
      },
      {
        title: "Total Orders",
        value: String(Number(kpiData.orders) || 0),
        delta: "—",
        positive: true,
      },
      {
        title: "Customers",
        value: String(Number(kpiData.customers) || 0),
        delta: "—",
        positive: true,
      },
    ];
  }, [kpiData]);


const revenueSpark = useMemo(() => earnings, [earnings]);

const avgOrderSpark = useMemo(() => {
  // approximate: avg per point (avoid divide by 0)
  const values = earnings.map((e: any) => Number(e.value) || 0);
  const max = Math.max(1, ...values);
  // normalize so line exists even for small numbers
  return values.map((v:any, i:any) => ({ day: earnings[i]?.day, value: (v / max) * 100 }));
}, [earnings]);

const countSpark = useMemo(() => {
  // create a small line using index (works even if you don't have per-day counts yet)
  return earnings.map((e: any, i: number) => ({ day: e.day, value: i + 1 }));
}, [earnings]);

  // Drivers card UI expects: {name, tag, sales, change, up}
  const driverCards = useMemo(() => {
    // sort by delivered desc
    const sorted = [...drivers].sort((a: any, b: any) => (b.delivered || 0) - (a.delivered || 0));
    const topId = sorted[0]?.driverId;

    return sorted.slice(0, 6).map((d: any) => ({
      name: d?.name || d?.email || "Driver",
      tag: d?.driverId === topId ? "Top Driver" : "",
      sales: `Delivered: ${d?.delivered ?? 0} / Assigned: ${d?.assigned ?? 0}`,
      change: `${Number(d?.deliveryRate ?? 0).toFixed(1)}%`,
      up: Number(d?.deliveryRate ?? 0) >= 70,
    }));
  }, [drivers]);

  // Top products card UI expects: {name, pcs, share, up}
  const productCards = useMemo(() => {
    return topProducts.slice(0, 6).map((p: any) => ({
      name: p?.name || "Product",
      pcs: `${p?.qty ?? 0} Sold`,
      share: `${Number(p?.share ?? 0).toFixed(1)}%`,
      up: true,
    }));
  }, [topProducts]);

  const earningsTotal = useMemo(() => {
    return earnings.reduce((s: number, x: any) => s + (Number(x.value) || 0), 0);
  }, [earnings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {!ok ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {initial?.message || "Failed to load dashboard analytics"}
          </div>
        ) : null}

        {/* Top row */}
        <div className="grid gap-4 md:grid-cols-12">
          {/* Welcome card */}
          <div className="md:col-span-3">
            <div className="relative h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">{greeting}</div>
              <div className="mt-1 text-lg font-bold text-gray-900">{name}</div>

              <p className="mt-2 text-sm text-gray-500">
                Here is your weekly <br /> overview report
              </p>


            </div>
          </div>
          {/* KPI cards */}
          <div className="md:col-span-9">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">{k.title}</div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="text-2xl font-bold text-gray-900">{k.value}</div>
                    <TrendPill positive={k.positive}
                    //  value={k.delta}
                     />
                  </div>
                  {(() => {
                    if (k.title === "Total Revenue") return <Sparkline data={revenueSpark} />;
                    if (k.title === "Avg. Transaction Value") return <Sparkline data={avgOrderSpark} />;
                    if (k.title === "Total Orders") return <Sparkline data={countSpark} />;
                    if (k.title === "Customers") return <Sparkline data={countSpark} />;
                    return <div className="mt-3 h-10 w-full rounded-lg bg-gray-50" />;
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle row */}
        <div className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <span>Overall Earnings</span>
                  <span className="text-xs font-medium text-gray-400">
                    - {rangeMode === "Daily" ? "This Week" : rangeMode}
                  </span>
                  <span className="ml-1 text-sm font-bold text-green-600">
                    Rs{formatMoney(earningsTotal)}
                  </span>
                </div>
              }
              right={
                <select
                  value={rangeMode}
                  onChange={(e) => setRangeMode(e.target.value as any)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              }
              className="p-5"
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earnings}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                      labelStyle={{ fontWeight: 700 }}
                    />
                    <Line type="monotone" dataKey="value" strokeWidth={3} dot={false} stroke="#F97316" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Donut category chart */}
          <div className="md:col-span-4">
            <Card
              title="Merchandise Category"
              right={<span className="text-xs text-gray-400">in selected range</span>}
              className="p-5"
            >
              <div className="flex items-center justify-center">
                <div className="h-56 w-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={2}
                      >
                        {categories.map((_: any, idx: number) => (
                          <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                {categories.map((c: any, idx: number) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                      />
                      <span className="text-gray-700">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{Number(c.value).toFixed(2)}%</span>
                      <span className="text-green-600">↗</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-4 grid gap-4 md:grid-cols-12">
          {/* Drivers Analytics (replaces Stores) */}
          <div className="md:col-span-5">
            <Card title="Drivers Analytics" right={<span className="text-xs text-gray-400">in selected range</span>} className="p-5">
              <div className="space-y-3">
                {driverCards.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{s.name}</div>
                        {s.tag ? (
                          <span
                            className={[
                              "rounded-full px-2 py-1 text-xs font-semibold",
                              s.tag.includes("Top") ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700",
                            ].join(" ")}
                          >
                            {s.tag}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{s.sales}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{s.change}</span>
                      <span className={s.up ? "text-green-600" : "text-red-600"}>{s.up ? "↗" : "↘"}</span>
                    </div>
                  </div>
                ))}

                {!driverCards.length ? (
                  <div className="rounded-xl border border-gray-100 bg-white p-3 text-sm text-gray-500">
                    No driver assignments found in this date range.
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="md:col-span-4">
            <Card title="Top Selling Products" right={<span className="text-xs text-gray-400">in selected range</span>} className="p-5">
              <div className="space-y-3">
                {productCards.map((p:any) => (
                  <div key={p.name} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600">
                        {p.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.pcs}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-800">{p.share}</div>
                      <div className={p.up ? "text-green-600" : "text-red-600"}>{p.up ? "↗" : "↘"}</div>
                    </div>
                  </div>
                ))}

                {!productCards.length ? (
                  <div className="rounded-xl border border-gray-100 bg-white p-3 text-sm text-gray-500">
                    No sales data found in this date range.
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
       
        </div>
      </div>
    </div>
  );
}
