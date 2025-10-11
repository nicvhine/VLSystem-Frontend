// Props interface for about section component
export interface AboutSectionProps {
  language: 'en' | 'ceb';
}

/**
 * About section component displaying company information, vision, and mission
 * Features bilingual content with responsive design
 * @param language - Language preference for content display
 * @returns JSX element containing the about section
 */
const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  return (
    <section id="about" className="py-24 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          {language === 'en' ? 'About Us' : 'Mahitungod Kanamo'}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">
          {language === 'en'
            ? 'Vistula Lending Corporation strives to provide reliable and convenient lending services for everyone. Our platform creates opportunities and delivers dependable service founded on integrity and a customer-centered approach. We aim to build trust and lasting relationships that linger — ensuring every client experiences care, transparency, and genuine support even beyond each transaction.'
            : 'Ang Vistula Lending Corporation nagtinguha sa paghatag og kasaligan ug sayon nga serbisyo sa pagpahulam para sa tanan. Ang among plataporma nagmugna og oportunidad ug kasaligan nga serbisyo nga pinasikad sa integridad ug kustomer-sentro nga pamaagi. Nagtinguha kami sa pagtukod og pagsalig ug dugay nga relasyon nga magpabilin — aron matag kliyente makasinati sa pag-atiman, kasinsero, ug kasaligan nga suporta bisan human sa matag transaksyon.'}
        </p>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Our Vision' : 'Among Panglantaw'}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-12">
            {language === 'en'
              ? 'To create a future where financial access is available to everyone through transparency, innovation, and commitment to our clients. We envision a community empowered by opportunity and sustained by trust.'
              : 'Paghimo og kaugmaon nga ang tanang tawo adunay access sa pinansyal nga serbisyo pinaagi sa pagkamatinud-anon, inobasyon, ug dedikasyon sa among mga kliyente. Among gipangandoy ang komunidad nga lig-on pinaagi sa oportunidad ug pagsalig.'}
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Our Mission' : 'Among Misyon'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {language === 'en'
              ? 'Our mission is to provide responsible lending services that uplift lives and communities. We aim to deliver customer-centered financial solutions with integrity, professionalism, and a deep sense of accountability.'
              : 'Ang among misyon mao ang paghatag og responsable nga serbisyo sa pagpahulam nga makapahimulos sa kinabuhi ug komunidad. Among tuyo nga maghatag og kustomer-sentro nga pinansyal nga solusyon nga puno sa integridad, propesyonalismo, ug dakong pagbati sa responsibilidad.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
