import ScrollReveal from '../common/ScrollReveal';
import AnimatedCounter from '../common/AnimatedCounter';
import { EVENT_STATS } from '../../utils/eventData';

export default function Stats() {
  return (
    <section className="bg-hero-gradient py-16 sm:py-20">
      <div className="container-section grid grid-cols-2 lg:grid-cols-4 gap-8">
        {EVENT_STATS.map((stat, idx) => (
          <ScrollReveal key={stat.label} delay={idx * 0.1} direction="zoom" className="text-center">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              className="block font-heading font-extrabold text-4xl sm:text-5xl text-accent"
            />
            <p className="text-white/80 mt-2 text-sm sm:text-base font-medium">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
