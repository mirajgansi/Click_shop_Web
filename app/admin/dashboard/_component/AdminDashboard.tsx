"use client";

import React from "react";
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
  delta: string;
  positive?: boolean;
};

const kpis: KPI[] = [
  { title: "Total Revenue", value: "203k", delta: "12.8%", positive: true },
  { title: "Avg. Transaction Value", value: "3.4k", delta: "1.5%", positive: true },
  { title: "Avg. Footfall", value: "683", delta: "0.5%", positive: true },
  { title: "Avg. Units Per Customer", value: "12", delta: "3.4%", positive: true },
];

const earnings = [
  { day: "Mon", value: 22000 },
  { day: "Tue", value: 65000 },
  { day: "Wed", value: 18000 },
  { day: "Thu", value: 98000 },
  { day: "Fri", value: 21000 },
  { day: "Sat", value: 45000 },
  { day: "Sun", value: 88000 },
];

const categories = [
  { name: "Snacks", value: 45.37 },
  { name: "Beverages", value: 28.19 },
  { name: "Pulse", value: 13.69 },
  { name: "Cooking oil & ghee", value: 13.69 },
  { name: "Meat and fish", value: 13.69 },
];

// Donut colors (feel free to change)
const pieColors = ["#F59E0B", "#60A5FA", "#A855F7", "#22C55E", "#FB7185"];

const stores = [
  { name: "Koramangala", tag: "Best Performing", sales: "$ 896.3", change: "23%", up: true },
  { name: "Indira Nagar", tag: "", sales: "$ 683.3", change: "3.8%", up: false },
  { name: "Whitefield", tag: "Low Performing", sales: "$ 569.3", change: "8.2%", up: false },
];

const skus = [
  { name: "Wai wai", pcs: "481 Pcs", share: "16%", up: true },
  { name: "Real juice", pcs: "351 Pcs", share: "34%", up: true },
  { name: "Coffee", pcs: "281 Pcs", share: "7.3%", up: false },
  { name: "Rice", pcs: "267 Pcs", share: "14.7%", up: true },
];

function TrendPill({ positive = true, value }: { positive?: boolean; value: string }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
      ].join(" ")}
    >
      <span className={positive ? "text-green-600" : "text-red-600"}>{positive ? "↗" : "↘"}</span>
      {value}
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Top row */}
        <div className="grid gap-4 md:grid-cols-12">
          {/* Welcome card */}
          <div className="md:col-span-3">
            <div className="relative h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">Good Afternoon 👋</div>
              <div className="mt-1 text-lg font-bold text-gray-900">Adam</div>
              <p className="mt-2 text-sm text-gray-500">
                Here is your weekly <br /> overview report
              </p>

              <button className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                View report
              </button>

              <div className="pointer-events-none absolute right-3 top-3 text-4xl opacity-10">📊</div>
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
                    <TrendPill positive={k.positive} value={k.delta} />
                  </div>

                  {/* tiny sparkline-ish bar */}
                  <div className="mt-3 h-8 w-full rounded-lg bg-gray-50" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle row */}
        <div className="mt-4 grid gap-4 md:grid-cols-12">
          {/* Overall Earnings line chart */}
          <div className="md:col-span-8">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <span>Overall Earnings</span>
                  <span className="text-xs font-medium text-gray-400">- This Week</span>
                  <span className="ml-1 text-sm font-bold text-green-600">$48.9k</span>
                </div>
              }
              right={
                <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
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
                    <Line
                      type="monotone"
                      dataKey="value"
                      strokeWidth={3}
                      dot={false}
                      // don’t set explicit colors if you want to keep it neutral;
                      // but line needs a stroke to show: using a safe default
                      stroke="#F97316"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Donut category chart */}
          <div className="md:col-span-4">
            <Card title="Merchandise Category" right={<span className="text-xs text-gray-400">in last 30 days</span>} className="p-5">
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
                        {categories.map((_, idx) => (
                          <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                {categories.map((c, idx) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                      />
                      <span className="text-gray-700">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{c.value.toFixed(2)}%</span>
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
          {/* Stores Analytics */}
          <div className="md:col-span-5">
            <Card title="Stores Analytics" right={<span className="text-xs text-gray-400">in last 7 days</span>} className="p-5">
              <div className="space-y-3">
                {stores.map((s) => (
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
                              s.tag.includes("Best") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
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
              </div>
            </Card>
          </div>

          {/* Top Performing SKUs */}
          <div className="md:col-span-4">
            <Card title="Top Performing SKUs" right={<span className="text-xs text-gray-400">in last 7 days</span>} className="p-5">
              <div className="space-y-3">
                {skus.map((p) => (
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
              </div>
            </Card>
          </div>

          {/* (Optional) Extra card area like screenshot spacing */}
          <div className="md:col-span-3">
            <div className="h-full rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-400">
              You can place another widget here (recent orders, drivers, low stock, etc.)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
