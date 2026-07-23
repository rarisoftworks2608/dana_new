import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiUserCheck } from 'react-icons/fi';

const STYLES = {
  preview: { bg: 'bg-blue-50', border: 'border-blue-200', icon: FiUserCheck, iconColor: 'text-blue-600' },
  success: { bg: 'bg-green-50', border: 'border-green-200', icon: FiCheckCircle, iconColor: 'text-green-600' },
  duplicate: { bg: 'bg-amber-50', border: 'border-amber-200', icon: FiAlertTriangle, iconColor: 'text-amber-600' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: FiXCircle, iconColor: 'text-red-600' },
};

export default function ScanResultCard({ result, processing, onConfirm, onDismiss }) {
  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key={result.timestamp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`rounded-2xl border-2 p-6 ${STYLES[result.status].bg} ${STYLES[result.status].border}`}
        >
          <div className="flex items-start gap-4">
            <span className={`text-3xl shrink-0 ${STYLES[result.status].iconColor}`}>
              {(() => { const Icon = STYLES[result.status].icon; return <Icon />; })()}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-lg text-slate-800 mb-1">{result.title}</p>
              <p className="text-sm text-slate-600 mb-3">{result.message}</p>

              {result.profile && (
                <div className="bg-white/70 rounded-xl p-4 grid sm:grid-cols-2 gap-2 text-sm">
                  <p><span className="text-slate-400">Reg. ID:</span> <span className="font-semibold">{result.profile.registrationId}</span></p>
                  <p><span className="text-slate-400">Name:</span> <span className="font-semibold">{result.profile.fullName}</span></p>
                  <p><span className="text-slate-400">Company:</span> <span className="font-semibold">{result.profile.company}</span></p>
                  <p><span className="text-slate-400">Type:</span> <span className="font-semibold">{result.profile.registrationType}</span></p>
                  <p><span className="text-slate-400">Mobile:</span> <span className="font-semibold">{result.profile.mobile}</span></p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {result.status === 'preview' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onConfirm(result.qrToken)}
                      disabled={processing}
                      className="w-full sm:flex-1 order-1 rounded-full bg-green-600 text-white font-semibold py-3 sm:py-2.5 text-sm hover:bg-green-700 disabled:opacity-60"
                    >
                      {processing ? 'Checking in...' : 'Confirm Check-In'}
                    </button>
                    <button
                      type="button"
                      onClick={onDismiss}
                      disabled={processing}
                      className="w-full sm:w-auto order-2 rounded-full border border-slate-300 text-slate-600 font-semibold py-3 sm:py-2.5 px-5 text-sm hover:bg-slate-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="w-full sm:w-auto rounded-full border border-slate-300 text-slate-600 font-semibold py-3 sm:py-2.5 px-5 text-sm hover:bg-slate-50"
                  >
                    Scan Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
