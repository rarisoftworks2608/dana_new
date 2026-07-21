import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import ScrollReveal from '../common/ScrollReveal';
import { FAQ_ITEMS } from '../../utils/eventData';

function FAQItem({ item, isOpen, onToggle, index }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;
  return (
    <div className="card overflow-hidden">
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
      >
        <span className="font-heading font-semibold text-primary-dark">{item.question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-primary shrink-0">
          <FiChevronDown />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-slate-600 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="container-section max-w-3xl">
        <ScrollReveal className="text-center mb-14">
          <span className="section-eyebrow">Got Questions?</span>
          <h2 className="section-heading">Frequently Asked Questions</h2>
        </ScrollReveal>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <ScrollReveal key={item.question} delay={idx * 0.05}>
              <FAQItem
                item={item}
                index={idx}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
