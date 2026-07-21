import { FiPhone, FiMail, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';

export default function Contact() {
  return (
    <section id="contact" className="container-section py-20 sm:py-28">
      <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
        <span className="section-eyebrow">Get In Touch</span>
        <h2 className="section-heading">Contact Dana India</h2>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FiPhone, label: 'Phone', value: '+91 20 6674 0000', href: 'tel:+912066740000' },
          { icon: FiMail, label: 'Email', value: 'supplierevents@danaindia.com', href: 'mailto:supplierevents@danaindia.com' },
          { icon: FiMapPin, label: 'Office Address', value: 'DAIPL, Chakan, Pune, Maharashtra' },
          { icon: FiMessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
        ].map(({ icon: Icon, label, value, href }, idx) => (
          <ScrollReveal key={label} delay={idx * 0.08}>
            <div className="card p-6 text-center h-full">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-2xl text-primary mb-4">
                <Icon />
              </div>
              <h3 className="font-heading font-bold text-primary-dark mb-1">{label}</h3>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-600 text-sm hover:text-primary break-words">
                  {value}
                </a>
              ) : (
                <p className="text-slate-600 text-sm">{value}</p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
