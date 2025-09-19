"use client";

import Image from 'next/image';

export interface TeamSectionProps {
  language: 'en' | 'ceb';
}

const teamMembers = [
  { name: 'Divina Alburo', role: { en: 'Chief Executive Officer', ceb: 'Punong Ehekutibo' }, img: '/idPic.jpg' },
  { name: 'Ronelyn Pelayo', role: { en: 'Loan Manager', ceb: 'Tagdumala sa Pahulam' }, img: '/idPic.jpg' },
  { name: 'Aiza Valiente', role: { en: 'Loan Officer', ceb: 'Opisyal sa Pahulam' }, img: '/idPic.jpg' },
  { name: 'Rosielle Marie Navares', role: { en: 'Loan Officer', ceb: 'Opisyal sa Pahulam' }, img: '/idPic.jpg' },
  { name: 'Chris Damayo', role: { en: 'Accountant', ceb: 'Tigpamaba' }, img: '/idPic.jpg' },
  { name: 'Bernie Gomez', role: { en: 'Accountant', ceb: 'Tigpamaba' }, img: '/idPic.jpg' },
  { name: 'Voltair Bracero', role: { en: 'Field Lead', ceb: 'Pangulo sa Field' }, img: '/idPic.jpg' },
  { name: 'Rodelo Lepiten', role: { en: 'Head Collector', ceb: 'Pangulo sa Kolektor' }, img: '/idPic.jpg' },
  { name: 'Shiela May Lepon', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Morgan Thomas', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Ryan Martinez', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Olivia Hernandez', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Kevin Lee', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Amy Gonzalez', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Jason Scott', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
  { name: 'Emma Lopez', role: { en: 'Collector', ceb: 'Kolektor' }, img: '/idPic.jpg' },
];

const TeamSection: React.FC<TeamSectionProps> = ({ language }) => {
  return (
    <section className="py-24 bg-gray-50 text-black" id="team">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          {language === 'en' ? 'Meet Our Team' : 'Ilaila ang Among Team'}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center transition-transform transform hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image
                  src={member.img}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
