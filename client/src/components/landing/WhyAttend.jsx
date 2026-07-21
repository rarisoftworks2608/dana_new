import {
  FiUsers, FiPlayCircle, FiBookOpen, FiShare2, FiMessageSquare, FiUserCheck,
} from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';
import { WHY_ATTEND } from '../../utils/eventData';

const ICON_MAP = {
  FiUsers, FiPlayCircle, FiBookOpen, FiShare2, FiMessageSquare, FiUserCheck,
};

export default function WhyAttend() {
  return (
    <section id="why-attend" className="container-section py-20 sm:py-28">
      <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
        <span className="section-eyebrow">Why Attend</span>
        <h2 className="section-heading">Reasons To Be There</h2>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_ATTEND.map(({ title, description, icon }, idx) => {
          const Icon = ICON_MAP[icon];
          return (
            <ScrollReveal key={title} delay={idx * 0.08}>
              <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-8 h-full text-white">
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
                <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center text-2xl text-primary-dark mb-5 relative z-10">
                  {Icon && <Icon />}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2 relative z-10">{title}</h3>
                <p className="text-white/75 text-sm leading-relaxed relative z-10">{description}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
