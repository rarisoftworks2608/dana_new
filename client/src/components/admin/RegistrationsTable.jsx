import { FiEdit2, FiTrash2, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function RegistrationsTable({ registrations, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return <p className="text-center text-slate-400 py-16">No registrations found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-3 pr-4 font-semibold">Reg. ID</th>
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Company</th>
            <th className="py-3 pr-4 font-semibold">Type</th>
            <th className="py-3 pr-4 font-semibold">Contact</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 pr-4 font-semibold text-primary">{r.registration_id}</td>
              <td className="py-3 pr-4">
                <p className="font-medium text-slate-800">{r.full_name}</p>
              </td>
              <td className="py-3 pr-4">{r.company}</td>
              <td className="py-3 pr-4">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {r.registration_type}
                </span>
              </td>
              <td className="py-3 pr-4">
                <p>{r.email}</p>
                <p className="text-xs text-slate-400">{r.mobile}</p>
              </td>
              <td className="py-3 pr-4">
                {r.checked_in_at ? (
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <FiCheckCircle /> Checked In
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold">
                    <FiClock /> Pending
                  </span>
                )}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(r)} aria-label={`Edit ${r.full_name}`} className="p-2 rounded-lg hover:bg-primary/10 text-primary">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => onDelete(r)} aria-label={`Delete ${r.full_name}`} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
