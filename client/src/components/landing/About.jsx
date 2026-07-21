import ScrollReveal from '../common/ScrollReveal';
import { FiCheckCircle } from 'react-icons/fi';

const HIGHLIGHTS = [
  'Automation & AI-powered inspection',
  'Industry 4.0 & digital manufacturing',
  'Robotics & quality systems',
  'Predictive maintenance',
  'Sustainable production practices',
];

export default function About() {
  return (
    <section id="about" className="container-section py-20 sm:py-28">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal direction="right">
          <span className="section-eyebrow">About The Event</span>
          <h2 className="section-heading mb-6">About Dana Supplier Technology Day</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Dana Supplier Technology Day 2026 is an exclusive industrial technology event designed to
            help suppliers discover innovative manufacturing solutions and build stronger partnerships
            with Dana India.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The event offers practical exposure to automation, AI-powered inspection, Industry 4.0,
            robotics, quality systems, predictive maintenance, digital manufacturing, and sustainable
            production practices.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            Through live demonstrations, leadership sessions, networking opportunities, and one-on-one
            discussions, participants will gain practical ideas that can immediately improve
            manufacturing operations.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2 text-slate-700 font-medium">
                <FiCheckCircle className="text-primary shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-4 bg-accent-gradient rounded-3xl opacity-20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="card p-6 flex flex-col items-center text-center gap-2 translate-y-6">
                <span className="font-heading font-extrabold text-3xl text-primary">28</span>
                <span className="text-sm text-slate-500">July 2026</span>
              </div>
              <div className="card p-6 flex flex-col items-center text-center gap-2">
                <span className="font-heading font-extrabold text-3xl text-primary">1</span>
                <span className="text-sm text-slate-500">Full Day Event</span>
              </div>
              <div className="card p-6 flex flex-col items-center text-center gap-2">
                <span className="font-heading font-extrabold text-3xl text-primary">10+</span>
                <span className="text-sm text-slate-500">Tech Domains</span>
              </div>
              <div className="card p-6 flex flex-col items-center text-center gap-2 translate-y-6">
                <span className="font-heading font-extrabold text-3xl text-primary">20+</span>
                <span className="text-sm text-slate-500">Tech Partners</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
