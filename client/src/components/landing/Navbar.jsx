import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import danaAnandLogo from '../../assets/logo-dana-anand.webp';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Event', href: '#about' },
  { label: 'Technology Areas', href: '#technology' },
  { label: 'Why Attend', href: '#why-attend' },
  { label: 'Venue', href: '#venue' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const scrollToTarget = () => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (mobileOpen) {
      // Wait for the mobile menu's collapse animation to finish first -
      // scrolling while it's still closing calculates the target against a
      // layout that's mid-transition and lands in the wrong place.
      setMobileOpen(false);
      setTimeout(scrollToTarget, 350);
    } else {
      scrollToTarget();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-section flex items-center justify-between" aria-label="Primary">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center">
          <img
            src={danaAnandLogo}
            alt="Dana | Anand"
            className="h-8 sm:h-9 w-auto select-none"
          />
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-semibold transition-colors hover:text-accent ${
                  scrolled ? 'text-primary-dark' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#register" onClick={(e) => handleNavClick(e, '#register')} className="btn-primary !py-2.5 !px-6 text-sm">
            Register Now
          </a>
        </div>

        <button
          className={`lg:hidden text-2xl ${scrolled ? 'text-primary-dark' : 'text-white'}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav shadow-lg overflow-hidden"
          >
            <ul className="container-section py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block text-primary-dark font-semibold py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#register"
                  onClick={(e) => handleNavClick(e, '#register')}
                  className="btn-primary w-full !py-2.5 text-sm"
                >
                  Register Now
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
