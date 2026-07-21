import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailyTrendChart({ dailyTrend }) {
  const data = (dailyTrend || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    count: d.count,
  }));

  if (data.length === 0) {
    return <p className="text-slate-400 text-sm text-center py-12">No registration trend yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0057D8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#0057D8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#0057D8" fill="url(#colorCount)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
