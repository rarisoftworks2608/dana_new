import { FiFacebook, FiLinkedin, FiInstagram, FiYoutube } from 'react-icons/fi';
import danaAnandLogo from '../../assets/logo-dana-anand.webp';

const QUICK_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Technology Areas', href: '#technology' },
  { label: 'Register', href: '#register' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-dark text-white/80 pt-16 pb-8">
      <div className="container-section grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src={danaAnandLogo} alt="Dana | Anand" className="h-9 w-auto mb-5 select-none" />
          <p className="text-sm leading-relaxed">
            A Supplier Capability Enhancement Initiative by Dana India &amp; Anand, bringing suppliers
            and technology partners together to drive manufacturing excellence.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={(e) => handleClick(e, link.href)} className="hover:text-accent transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>DAIPL, Chakan, Pune</li>
            <li>supplierevents@danaindia.com</li>
            <li>+91 20 6674 0000</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-section border-t border-white/10 mt-12 pt-6 text-center text-sm">
        © 2026 Dana India. All rights reserved.
      </div>
    </footer>
  );
}
