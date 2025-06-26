export interface TestimonialSectionProps {
  language: 'en' | 'ceb';
}

const testimonials = [
  {
    quote: {
      en: 'Vistula helped me grow my business fast. I received my loan in just 2 days!',
      ceb: 'Ang Vistula nakatabang nako nga mudako ang akong negosyo. Nadawat nako ang akong loan sulod lang sa 2 ka adlaw!',
    },
    author: 'John Smith',
    role: {
      en: 'Business Owner',
      ceb: 'Tag-iya sa Negosyo',
    },
  },
  {
    quote: {
      en: 'Their support team is amazing. I feel secure and heard every time.',
      ceb: 'Nindot kaayo ilang support team. Luwas ug paminaw ko nga gipaminaw ko nila kanunay.',
    },
    author: 'Sarah Johnson',
    role: {
      en: 'Entrepreneur',
      ceb: 'Negosyante',
    },
  },
];

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ language }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-center mb-16 text-4xl font-bold text-gray-800">
          {language === 'en' ? 'What Our Clients Say' : 'Unsa ang Giingon sa Among mga Kliyente'}
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 relative transition-transform transform hover:-translate-y-2 duration-300"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-100 rounded-full z-[-1]"></div>

              <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                {testimonial.quote[language]}
              </p>
              <div className="font-semibold text-gray-900">{testimonial.author}</div>
              <div className="text-sm text-gray-500">{testimonial.role[language]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
