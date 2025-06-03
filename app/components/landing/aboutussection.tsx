interface AboutSectionProps {
  language: 'en' | 'ceb';
}

export default function AboutSection({ language }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          {language === 'en' ? 'About Us' : 'Mahitungod Kanamo'}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">
          {language === 'en'
            ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            : 'Ang Vistula Lending Corporation nagtinguha sa paghatag og kasaligan ug sayon nga serbisyo sa pagpahulam alang sa tanan. Ang among plataporma naghatag og oportunidad ug kasaligan nga serbisyo pinasikad sa integridad ug kustomer nga sentro nga pamaagi.'}
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
}
