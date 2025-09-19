'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface FeatureSectionProps {
  language: 'en' | 'ceb';
}

const features = [
  {
    title: {
      en: 'Quick Processing',
      ceb: 'Dali nga Pagproseso',
    },
    description: {
      en: 'Experience lightning-fast loan approvals and minimal paperwork.',
      ceb: 'Masinati ang dali nga pag-apruba sa loan ug gamay ra nga papeles.',
    },
    icon: '⚡',
  },
  {
    title: {
      en: 'Secure Platform',
      ceb: 'Luwas nga Plataporma',
    },
    description: {
      en: 'Your data and transactions are protected with top-grade security.',
      ceb: 'Ang imong datos ug transaksyon gipanalipdan sa labing taas nga seguridad.',
    },
    icon: '🔒',
  },
  {
    title: {
      en: 'Easy Loan Tracking',
      ceb: 'Masayon nga Pagsubay sa Loan',
    },
    description: {
      en: 'Monitor your applications, loans, and payments anytime.',
      ceb: 'Masayon nga pagsubay sa imong aplikasyon, utang, ug bayad bisan kanus-a.',
    },
    icon: '📍',
  },
];

const FeatureSection: React.FC<FeatureSectionProps> = ({ language }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-100">
      <div className="mx-auto px-6">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 mb-16"
        >
          {language === 'en'
            ? 'Why Choose Vistula Lending Corporation?'
            : 'Ngano nga Pilion ang Vistula Lending Corporation?'}
        </motion.h2>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300"
            >
              {/* Icon with continuous floating animation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-4 text-red-600 inline-block"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {feature.title[language]}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description[language]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
