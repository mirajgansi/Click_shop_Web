export default function StatCard({
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