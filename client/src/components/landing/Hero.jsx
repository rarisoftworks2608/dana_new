import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useCountdown } from '../../hooks/useCountdown';
import { EVENT_DATE_ISO } from '../../utils/eventData';
import heroBg from '../../assets/hero-bg.webp';
import igniteWordmark from '../../assets/wordmark-ignite.webp';
import eventNameWordmark from '../../assets/wordmark-event-name.webp';

const AUDIENCE = [
  'Senior Management',
  'Manufacturing Leaders',
  'Quality Leaders',
  'Engineering Teams',
  'Continuous Improvement Personnel',
];

const INFO_CARDS = [
  { icon: FiCalendar, title: 'Date', body: '28 July 2026 (Tuesday)' },
  { icon: FiMapPin, title: 'Venue', body: 'DAIPL, Chakan, Pune' },
];

function CountdownBlock({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center bg-white/[0.07] backdrop-blur-md rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-6 sm:py-4 min-w-[58px] sm:min-w-[90px] border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    >
      <span className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-white tabular-nums tracking-tight">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] sm:text-xs uppercase tracking-[0.15em] text-white/60 mt-0.5 sm:mt-1">{label}</span>
    </motion.div>
  );
}

export default function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE_ISO);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28 overflow-hidden bg-primary-dark"
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 35%' }}
        aria-hidden="true"
      />
      {/* Legibility scrim: darkens the busy artwork under the text without flattening it */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(4,12,30,0.92) 0%, rgba(4,12,30,0.78) 28%, rgba(4,12,30,0.35) 55%, rgba(4,12,30,0.55) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 sm:h-40"
        style={{ background: 'linear-gradient(to top, rgba(4,12,30,0.95), transparent)' }}
        aria-hidden="true"
      />

      <div className="container-section relative z-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
        <div>
          <h1 className="sr-only">
            Dana Supplier Technology Day 2026 — IGNITE. Innovate. Collaborate. Implement Together.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/20 text-accent font-semibold text-[11px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-widest px-3.5 py-2 sm:px-4 rounded-full mb-6 sm:mb-7"
          >
            A Supplier Capability Enhancement Initiative by Dana India &amp; Anand
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            aria-hidden="true"
            className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          >
            <img src={igniteWordmark} alt="" className="w-32 sm:w-48 lg:w-56 mb-2 sm:mb-3 select-none" />
            <img src={eventNameWordmark} alt="" className="w-full max-w-[280px] sm:max-w-lg lg:max-w-xl select-none" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 sm:mt-6 text-white/85 text-[15px] sm:text-lg leading-relaxed max-w-2xl"
          >
            Dana Supplier Technology Day is a Supplier Capability Enhancement Initiative that brings
            together suppliers, manufacturing experts, and technology partners to showcase
            next-generation manufacturing solutions — improving quality, productivity,
            sustainability, and digital transformation across supplier operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-7 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
          >
            <button onClick={() => scrollTo('#register')} className="btn-primary w-full sm:w-auto">
              Register Now <FiArrowRight />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-9 sm:mt-10"
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/50 mb-3">The Event Starts In</p>
            <div className="flex gap-2 sm:gap-4">
              <CountdownBlock value={days} label="Days" delay={0.5} />
              <CountdownBlock value={hours} label="Hours" delay={0.55} />
              <CountdownBlock value={minutes} label="Minutes" delay={0.6} />
              <CountdownBlock value={seconds} label="Seconds" delay={0.65} />
            </div>
            <p className="text-white/40 text-xs mt-3">28 July 2026, 09:00 AM IST</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-5"
        >
          {INFO_CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4 items-start shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent-gradient flex items-center justify-center text-primary-dark text-base sm:text-xl shrink-0">
                <Icon />
              </div>
              <div>
                <p className="text-white font-heading font-bold text-sm sm:text-lg">{title}</p>
                <p className="text-white/75 text-xs sm:text-base">{body}</p>
              </div>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1 bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4 items-start shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent-gradient flex items-center justify-center text-primary-dark text-base sm:text-xl shrink-0">
              <FiUsers />
            </div>
            <div>
              <p className="text-white font-heading font-bold text-sm sm:text-lg mb-1">Audience</p>
              <ul className="text-white/75 text-xs sm:text-sm space-y-0.5 grid grid-cols-2 sm:grid-cols-1 gap-x-3">
                {AUDIENCE.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
