import ScrollReveal from '../common/ScrollReveal';
import { TECH_FOCUS_AREAS } from '../../utils/eventData';

export default function TechFocusAreas() {
  return (
    <section id="technology" className="bg-white py-20 sm:py-28">
      <div className="container-section">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow">What&rsquo;s In Focus</span>
          <h2 className="section-heading">Technology Focus Areas</h2>
          <p className="text-slate-600 mt-4">
            Explore proven technologies and solutions across ten key manufacturing domains.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_FOCUS_AREAS.map(({ icon: Icon, title, description }, idx) => (
            <ScrollReveal key={title} delay={idx * 0.05} direction="up">
              <div className="card p-6 h-full group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-accent-gradient flex items-center justify-center text-2xl text-primary group-hover:text-primary-dark transition-colors duration-300 mb-4">
                  <Icon />
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
