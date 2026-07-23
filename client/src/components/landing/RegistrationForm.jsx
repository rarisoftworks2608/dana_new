import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiDownload, FiX, FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';
import { registerAttendee } from '../../services/api';
import { REGISTRATION_TYPES, TECHNOLOGY_INTEREST_OPTIONS } from '../../utils/eventData';
import bgGradient from '../../assets/bg-gradient.webp';

async function downloadRegistrationPdf(result) {
  // Loaded on demand (only when someone actually downloads a confirmation)
  // instead of bundled into the main landing-page chunk every visitor pays
  // for - jsPDF pulls in html2canvas as an optional dependency, adding
  // ~130KB gzip that most visitors never need.
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(0, 59, 142);
  doc.rect(0, 0, pageWidth, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Dana Supplier Technology Day 2026', pageWidth / 2, 42, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Registration Confirmed', pageWidth / 2, 64, { align: 'center' });

  let y = 130;
  const labelX = 70;
  const valueX = 230;

  const row = (label, value) => {
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(label, labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value ?? ''), valueX, y);
    y += 26;
  };

  row('Registration ID:', result.registrationId);
  row('Full Name:', result.fullName);
  row('Email:', result.email);
  row('Registering As:', result.registrationType);

  if (result.qrCodeImage) {
    y += 14;
    const qrSize = 190;
    const qrX = (pageWidth - qrSize) / 2;
    doc.addImage(result.qrCodeImage, 'PNG', qrX, y, qrSize, qrSize);
    y += qrSize + 22;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text('Show this QR code (printed or on your phone) at the venue for quick check-in.', pageWidth / 2, y, { align: 'center' });
    y += 34;
  }

  doc.setTextColor(70, 70, 70);
  doc.setFontSize(10);
  doc.text('Event Date: 28 July 2026, 10:00 AM – 05:30 PM IST', pageWidth / 2, y, { align: 'center' });
  y += 16;
  doc.text('Venue: DAIPL, Chakan, Pune', pageWidth / 2, y, { align: 'center' });

  doc.save(`${result.registrationId}-confirmation.pdf`);
}

function SuccessModal({ result, onClose }) {
  if (!result) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-primary-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-success-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-8 relative text-center"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
          >
            <FiX size={22} />
          </button>
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-4">
            <FiCheckCircle />
          </div>
          <h3 id="reg-success-title" className="font-heading font-bold text-2xl text-primary-dark mb-2">
            Registration Successful!
          </h3>
          <p className="text-slate-600 mb-4">
            Your Registration ID is <span className="font-bold text-primary">{result.registrationId}</span>.
            A confirmation with your QR Code has been sent to your Email.
          </p>
          {result.qrCodeImage && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={result.qrCodeImage}
                alt={`QR Code for registration ${result.registrationId}`}
                className="w-48 h-48 border-4 border-slate-100 rounded-xl"
              />
              <button
                type="button"
                onClick={() => downloadRegistrationPdf(result).catch(() => toast.error('Could not generate PDF. Please try again.'))}
                className="btn-primary !py-2.5 !px-6 text-sm"
              >
                Download PDF <FiDownload />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputBase =
  'w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none';

function FieldIcon({ icon: Icon }) {
  return <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />;
}

export default function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      company: '',
      registrationType: 'Attendee',
      interestedAreas: [],
    },
  });

  const registrationType = watch('registrationType');
  const showInterestedAreas = registrationType === 'Attendee' || registrationType === 'Dana';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { data: response } = await registerAttendee(data);
      setResult(response.data);
      toast.success('Registration successful! Check your Email for your QR Code.');
      reset();
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="register"
      className="relative py-20 sm:py-28 overflow-hidden bg-primary-dark"
      style={{ backgroundImage: `url(${bgGradient})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container-section max-w-3xl relative z-10">
        <ScrollReveal className="text-center mb-12">
          <span className="section-eyebrow">Reserve Your Seat</span>
          <h2 className="font-heading font-extrabold text-[1.85rem] sm:text-4xl lg:text-[2.6rem] text-white tracking-tight leading-[1.15]">
            Register For <span className="text-gradient-accent">Dana Supplier Technology Day</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Secure your seat in under a minute — your QR Code and event details arrive instantly on
            WhatsApp and Email.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-10 lg:p-12 space-y-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <FieldIcon icon={FiUser} />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Enter a valid name' } })}
                    className={inputBase}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                </div>
                {errors.fullName && <p id="fullName-error" className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <FieldIcon icon={FiMail} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                    })}
                    className={inputBase}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <FieldIcon icon={FiPhone} />
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' },
                    })}
                    className={inputBase}
                    aria-invalid={!!errors.mobile}
                    aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                  />
                </div>
                {errors.mobile && <p id="mobile-error" className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <FieldIcon icon={FiBriefcase} />
                  <input
                    id="company"
                    type="text"
                    placeholder="Your organization"
                    {...register('company', { required: 'Company name is required' })}
                    className={inputBase}
                    aria-invalid={!!errors.company}
                  />
                </div>
                {errors.company && <p className="text-red-500 text-xs mt-1.5">{errors.company.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="registrationType" className="block text-sm font-semibold text-slate-700 mb-2">
                  Registering As <span className="text-accent">*</span>
                </label>
                <select
                  id="registrationType"
                  {...register('registrationType', { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-[15px] text-slate-800 transition-all duration-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                >
                  {REGISTRATION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {showInterestedAreas && (
              <fieldset className="pt-2 border-t border-slate-100">
                <legend className="block text-sm font-semibold text-slate-700 mb-4 mt-6">Interested Technology Areas</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TECHNOLOGY_INTEREST_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2.5 text-sm text-slate-700 font-medium bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        {...register('interestedAreas')}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full !py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? 'Submitting...' : 'Register Now'}
            </button>
          </form>
        </ScrollReveal>
      </div>

      <SuccessModal result={result} onClose={() => setResult(null)} />
    </section>
  );
}
