import { FiMapPin, FiExternalLink, FiCheckCircle } from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';

const MAPS_URL = 'https://maps.app.goo.gl/VGjFtaXvjdTDXcPZA';
const EMBED_URL =
  import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
  'https://www.google.com/maps?q=DAIPL+Chakan+Pune&output=embed';

export default function Venue() {
  return (
    <section id="venue" className="container-section py-20 sm:py-28">
      <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
        <span className="section-eyebrow">Find Us</span>
        <h2 className="section-heading">Venue</h2>
      </ScrollReveal>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <ScrollReveal direction="right" className="h-full">
          <div className="card overflow-hidden h-full min-h-[320px]">
            <iframe
              title="Dana Supplier Technology Day Venue Map"
              src={EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.15}>
          <div className="card p-8 h-full flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl text-primary mb-5">
              <FiMapPin />
            </div>
            <h3 className="font-heading font-bold text-2xl text-primary-dark mb-1">DAIPL</h3>
            <p className="text-sm text-slate-500 mb-2">Dana Anand India Private Limited</p>
            <p className="text-slate-600 mb-6">Chakan, Pune, Maharashtra, India</p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-700">
                <FiCheckCircle className="text-primary" /> Parking Available
              </li>
            </ul>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start !text-white !bg-none bg-primary hover:!bg-primary-dark"
            >
              Open in Google Maps <FiExternalLink />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
