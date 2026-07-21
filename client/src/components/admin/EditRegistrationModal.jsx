import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { REGISTRATION_TYPES } from '../../utils/eventData';

export default function EditRegistrationModal({ registration, onClose, onSave, saving }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (registration) {
      reset({
        full_name: registration.full_name,
        email: registration.email,
        mobile: registration.mobile,
        company: registration.company,
        registration_type: registration.registration_type,
        vendor_name: registration.vendor_name || '',
        status: registration.status,
      });
    }
  }, [registration, reset]);

  if (!registration) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-primary-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700" aria-label="Close">
          <FiX size={22} />
        </button>
        <h2 className="font-heading font-bold text-xl text-primary-dark mb-6">
          Edit Registration — {registration.registration_id}
        </h2>

        <form onSubmit={handleSubmit((data) => onSave(registration.id, data))} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input {...register('full_name')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile</label>
            <input {...register('mobile')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Company</label>
            <input {...register('company')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Type</label>
              <select {...register('registration_type')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none bg-white">
                {REGISTRATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select {...register('status')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none bg-white">
                <option value="registered">Registered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Vendor Name</label>
            <input {...register('vendor_name')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary outline-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-slate-300 py-2.5 font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary !py-2.5 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
