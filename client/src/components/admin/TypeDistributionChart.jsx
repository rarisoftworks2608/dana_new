import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#003B8E', '#0057D8', '#F5B301', '#64748B'];

export default function TypeDistributionChart({ byType }) {
  const data = Object.entries(byType || {}).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <p className="text-slate-400 text-sm text-center py-12">No registration data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
