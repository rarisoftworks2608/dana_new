import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiXCircle, FiUser, FiBriefcase, FiMail, FiPhone, FiTag } from 'react-icons/fi';
import { verifyRegistration } from '../services/api';
import danaAnandLogo from '../assets/logo-dana-anand.webp';

const TYPE_STYLES = {
  Attendee: 'bg-blue-100 text-blue-700',
  Exhibitor: 'bg-orange-100 text-orange-700',
  Dana: 'bg-yellow-100 text-yellow-800',
};

export default function VerifyBadge() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, data: null });

    verifyRegistration(token)
      .then(({ data }) => {
        if (!cancelled) setState({ loading: false, error: null, data: data.data });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err?.response?.data?.message || 'Invalid or unrecognized QR code.';
        setState({ loading: false, error: message, data: null });
      });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-8 sm:p-10 text-center">
        <img src={danaAnandLogo} alt="Dana | Anand" className="h-10 w-auto mx-auto mb-6 select-none" />

        {state.loading && (
          <div className="py-10">
            <div className="w-10 h-10 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 text-sm mt-4">Verifying QR code...</p>
          </div>
        )}

        {!state.loading && state.error && (
          <div className="py-6">
            <FiXCircle className="text-red-500 mx-auto mb-3" size={48} />
            <h1 className="font-heading font-bold text-xl text-primary-dark mb-1">Invalid QR Code</h1>
            <p className="text-slate-500 text-sm">{state.error}</p>
          </div>
        )}

        {!state.loading && state.data && (
          <div>
            {state.data.status === 'cancelled' ? (
              <FiXCircle className="text-red-500 mx-auto mb-3" size={48} />
            ) : (
              <FiCheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            )}

            <h1 className="font-heading font-bold text-xl text-primary-dark mb-1">
              {state.data.status === 'cancelled' ? 'Registration Cancelled' : 'Registered for'}
            </h1>
            {state.data.status !== 'cancelled' && (
              <p className="text-slate-500 text-sm mb-5">Dana Supplier Technology Day 2026</p>
            )}

            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <FiUser className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="font-semibold text-slate-800">{state.data.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-semibold text-slate-800 break-all">{state.data.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Mobile</p>
                  <p className="font-semibold text-slate-800">{state.data.mobile}</p>
                </div>
              </div>

              {state.data.company && (
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Company</p>
                    <p className="font-semibold text-slate-800">{state.data.company}</p>
                  </div>
                </div>
              )}

              {state.data.vendorName && (
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Vendor Name</p>
                    <p className="font-semibold text-slate-800">{state.data.vendorName}</p>
                  </div>
                </div>
              )}

              {Array.isArray(state.data.interestedAreas) && state.data.interestedAreas.length > 0 && (
                <div className="flex items-start gap-3">
                  <FiTag className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Interested Technology Areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {state.data.interestedAreas.map((area) => (
                        <span key={area} className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-400">Registration ID</span>
                <span className="font-mono text-sm font-semibold text-primary">{state.data.registrationId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Registering As</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_STYLES[state.data.registrationType] || 'bg-slate-200 text-slate-700'}`}>
                  {state.data.registrationType}
                </span>
              </div>

              {state.data.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Registered On</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {new Date(state.data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            <div className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              state.data.isCheckedIn ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {state.data.isCheckedIn ? (
                <><FiCheckCircle /> Checked in at venue</>
              ) : (
                <><FiClock /> Not checked in yet</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
