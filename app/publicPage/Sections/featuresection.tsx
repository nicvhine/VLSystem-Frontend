import React from 'react';

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
      en: '24/7 Support',
      ceb: '24/7 nga Suporta',
    },
    description: {
      en: "We're here to help anytime you need us.",
      ceb: 'Andam kami motabang kanunay kung kinahanglan nimo kami.',
    },
    icon: '💬',
  },
];

const FeatureSection: React.FC<FeatureSectionProps> = ({ language }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-100">
      <div className=" mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          {language === 'en' ? 'Why Choose Vistula Lending Corporation?' : 'Ngano nga Pilion ang Vistula Lending Corporation?'}
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300"
            >
              <div className="text-5xl mb-4 text-red-600">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {feature.title[language]}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
