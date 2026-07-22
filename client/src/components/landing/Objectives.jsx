import { FiCheck } from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';
import bgGradient from '../../assets/bg-gradient.webp';
import sphereGraphic from '../../assets/graphic-sphere.webp';

const OBJECTIVES = [
  'Quality',
  'Productivity',
  'Sustainability',
  'Manufacturing Competitiveness',
  'Digital Transformation',
  'Operational Excellence',
];

export default function Objectives() {
  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden bg-primary-dark"
      style={{ backgroundImage: `url(${bgGradient})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <img
        src={sphereGraphic}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -top-6 sm:top-0 w-[220px] sm:w-[300px] opacity-70"
        style={{ filter: 'drop-shadow(0 0 40px rgba(56,189,248,0.4))' }}
      />

      <div className="container-section relative z-10 text-center">
        <ScrollReveal>
          <span className="section-eyebrow">Our Objective</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white max-w-3xl mx-auto leading-snug">
            Expose suppliers to innovative technologies and manufacturing solutions that improve
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 max-w-4xl mx-auto">
          {OBJECTIVES.map((obj, idx) => (
            <ScrollReveal key={obj} delay={idx * 0.06} direction="zoom" className="h-full">
              <div className="flex items-center gap-3 h-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-left backdrop-blur-sm">
                <span className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-primary-dark shrink-0">
                  <FiCheck />
                </span>
                <span className="text-white font-semibold">{obj}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
