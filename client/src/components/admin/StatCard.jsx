export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/15 text-accent-light',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${accentClasses[accent]}`}>
        <Icon />
      </div>
      <div>
        <p className="text-2xl font-heading font-extrabold text-primary-dark">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
