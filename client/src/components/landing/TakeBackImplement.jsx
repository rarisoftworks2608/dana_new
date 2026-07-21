import { FiUsers, FiMapPin, FiFlag } from 'react-icons/fi';
import { GiLightBulb } from 'react-icons/gi';
import ScrollReveal from '../common/ScrollReveal';

const STEPS = [
  { icon: GiLightBulb, title: 'Improvement Ideas', description: 'Identify practical opportunities across your operations.' },
  { icon: FiUsers, title: 'Technology Partners', description: 'Connect with the right partners to solve your challenges.' },
  { icon: FiMapPin, title: 'Implementation Roadmap', description: 'Build a clear path to adopt selected solutions.' },
  { icon: FiFlag, title: 'Action Plan', description: 'Commit to at least three opportunities within 90 days.' },
];

export default function TakeBackImplement() {
  return (
    <section className="container-section py-20 sm:py-28">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
        <span className="section-eyebrow">Beyond Awareness</span>
        <h2 className="section-heading mb-4">Take Back. Implement. Improve.</h2>
        <p className="text-slate-600">
          Beyond technology awareness, Dana Supplier Technology Day encourages every participant to
          identify practical improvement opportunities. Dana&rsquo;s Supplier Development Team will continue
          supporting suppliers by reviewing progress and encouraging implementation of selected
          improvement initiatives.
        </p>
      </ScrollReveal>

      <div className="relative">
        <div className="hidden lg:block absolute top-9 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ icon: Icon, title, description }, idx) => (
            <ScrollReveal key={title} delay={idx * 0.12} direction="up">
              <div className="flex flex-col items-center text-center relative">
                <div className="w-[72px] h-[72px] rounded-full bg-white border-4 border-primary shadow-card flex items-center justify-center text-2xl text-primary relative z-10">
                  <Icon />
                </div>
                <span className="mt-4 text-xs font-bold text-accent uppercase tracking-widest">Step {idx + 1}</span>
                <h3 className="font-heading font-bold text-primary-dark text-lg mt-1 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
