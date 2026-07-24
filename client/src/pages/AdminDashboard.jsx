import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiSearch, FiDownload, FiFileText } from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';
import StatCard from '../components/admin/StatCard';
import TypeDistributionChart from '../components/admin/TypeDistributionChart';
import CompanyDistributionChart from '../components/admin/CompanyDistributionChart';
import DailyTrendChart from '../components/admin/DailyTrendChart';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import EditRegistrationModal from '../components/admin/EditRegistrationModal';
import {
  getDashboardStats, getRegistrations, updateRegistration, deleteRegistration, downloadExport,
} from '../services/api';
import { REGISTRATION_TYPES } from '../utils/eventData';

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [checkedIn, setCheckedIn] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await getDashboardStats();
      setStats(data.data);
    } catch {
      toast.error('Failed to load dashboard stats');
    }
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRegistrations({
        search: search || undefined,
        type: type || undefined,
        checkedIn: checkedIn || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setRegistrations(data.data);
      setTotal(data.pagination.total);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, [search, type, checkedIn, page]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadRegistrations(); }, [loadRegistrations]);

  const handleSave = async (id, formData) => {
    setSaving(true);
    try {
      await updateRegistration(id, formData);
      toast.success('Registration updated');
      setEditing(null);
      loadRegistrations();
      loadStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (registration) => {
    if (!window.confirm(`Delete registration ${registration.registration_id} (${registration.full_name})? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteRegistration(registration._id);
      toast.success('Registration deleted');
      loadRegistrations();
      loadStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleExport = async (format) => {
    try {
      await downloadExport(format);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Export failed');
    }
  };

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={FiUsers} label="Total Registrations" value={stats?.total ?? '—'} accent="primary" />
        <StatCard icon={FiCalendar} label="Today's Registrations" value={stats?.today ?? '—'} accent="accent" />
        <StatCard icon={FiCheckCircle} label="Checked In" value={stats?.checkedIn ?? '—'} accent="green" />
        <StatCard icon={FiClock} label="Pending Check-In" value={stats?.pending ?? '—'} accent="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-heading font-bold text-primary-dark mb-4">Category-wise Registrations</h3>
          <TypeDistributionChart byType={stats?.byType} />
        </div>
        <div className="card p-6">
          <h3 className="font-heading font-bold text-primary-dark mb-4">Unique Companies — Attendee vs Exhibitor</h3>
          <CompanyDistributionChart
            uniqueCompaniesByType={stats?.uniqueCompaniesByType}
            totalUniqueCompanies={stats?.totalUniqueCompanies}
          />
        </div>
        <div className="card p-6">
          <h3 className="font-heading font-bold text-primary-dark mb-4">Daily Registration Trend</h3>
          <DailyTrendChart dailyTrend={stats?.dailyTrend} />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h3 className="font-heading font-bold text-primary-dark">Registrations</h3>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => handleExport('excel')} className="inline-flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
              <FiDownload /> Excel
            </button>
            <button type="button" onClick={() => handleExport('csv')} className="inline-flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
              <FiFileText /> CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, mobile, company, or registration ID"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 focus:border-primary outline-none"
            />
          </div>
          <select
            value={type}
            onChange={(e) => { setPage(1); setType(e.target.value); }}
            className="rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none bg-white"
          >
            <option value="">All Types</option>
            {REGISTRATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={checkedIn}
            onChange={(e) => { setPage(1); setCheckedIn(e.target.value); }}
            className="rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none bg-white"
          >
            <option value="">All Status</option>
            <option value="true">Checked In</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <RegistrationsTable
          registrations={registrations}
          loading={loading}
          onEdit={setEditing}
          onDelete={handleDelete}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500">Page {page} of {totalPages} ({total} total)</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <EditRegistrationModal
        registration={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
      />
    </AdminLayout>
  );
}
