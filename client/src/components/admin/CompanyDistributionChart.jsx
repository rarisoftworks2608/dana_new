import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Matches the Attendee/Exhibitor QR background colors (server/src/utils/qrService.js)
// so the same type reads as the same color everywhere in the app.
const COLORS = { Attendee: '#0057D8', Exhibitor: '#F97316' };

export default function CompanyDistributionChart({ uniqueCompaniesByType }) {
  const data = Object.entries(uniqueCompaniesByType || {})
    .map(([name, value]) => ({ name, value }))
    .filter((entry) => entry.value > 0);

  if (data.length === 0) {
    return <p className="text-slate-400 text-sm text-center py-12">No company data yet.</p>;
  }

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#64748B'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 top-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '56px' }}>
        <p className="text-2xl font-heading font-extrabold text-primary-dark">{total}</p>
        <p className="text-xs text-slate-500">Companies</p>
      </div>
    </div>
  );
}
