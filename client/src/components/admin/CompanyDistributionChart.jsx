import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Matches the Attendee/Exhibitor QR background colors (server/src/utils/qrService.js)
// so the same type reads as the same color everywhere in the app.
const COLORS = { Attendee: '#0057D8', Exhibitor: '#F97316' };

export default function CompanyDistributionChart({ uniqueCompaniesByType, totalUniqueCompanies }) {
  const data = Object.entries(uniqueCompaniesByType || {})
    .map(([name, value]) => ({ name, value }))
    .filter((entry) => entry.value > 0);

  if (data.length === 0) {
    return <p className="text-slate-400 text-sm text-center py-12">No company data yet.</p>;
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-2">
        Total unique companies: <span className="font-bold text-primary-dark">{totalUniqueCompanies ?? '—'}</span>
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#64748B'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 mt-2">
        Note: &ldquo;Total unique companies&rdquo; above counts each company once. The Attendee/Exhibitor
        counts in the chart count a company separately for each type it registered under — so a
        company that registered as both an Attendee and an Exhibitor is counted in both slices,
        which is why the two slices can add up to more than the total.
      </p>
    </div>
  );
}
