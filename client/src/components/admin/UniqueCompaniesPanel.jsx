import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function UniqueCompaniesPanel({ uniqueCompaniesByType, totalUniqueCompanies, companyListByType }) {
  const [type, setType] = useState('Attendee');
  const [showList, setShowList] = useState(false);

  const attendeeCount = uniqueCompaniesByType?.Attendee ?? 0;
  const exhibitorCount = uniqueCompaniesByType?.Exhibitor ?? 0;
  const count = uniqueCompaniesByType?.[type] ?? 0;
  const list = companyListByType?.[type] ?? [];

  return (
    <div className="card p-6">
      <h3 className="font-heading font-bold text-primary-dark mb-2">Unique Companies</h3>
      <p className="text-sm text-slate-500 mb-4">
        Total unique companies (Attendee + Exhibitor combined):{' '}
        <span className="font-bold text-primary-dark">{totalUniqueCompanies ?? '—'}</span>
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setShowList(false); }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none bg-white"
        >
          <option value="Attendee">Attendee ({attendeeCount})</option>
          <option value="Exhibitor">Exhibitor ({exhibitorCount})</option>
        </select>

        <button
          type="button"
          onClick={() => setShowList((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          {showList ? <>Hide List <FiChevronUp /></> : <>View List ({count}) <FiChevronDown /></>}
        </button>
      </div>

      {showList && (
        list.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No companies yet.</p>
        ) : (
          <ul className="mt-4 max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200">
            {list.map((name) => (
              <li key={name} className="px-4 py-2.5 text-sm text-slate-700">{name}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
