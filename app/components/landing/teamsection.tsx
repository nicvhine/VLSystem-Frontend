"use client";

import Image from 'next/image';

interface TeamSectionProps {
  language: 'en' | 'ceb';
}

const teamMembers = [
  { name: 'Divina Alburo', role: 'Chief Executive Officer', img: '/idPic.jpg' },
  { name: 'Ronelyn Pelayo', role: 'Loan Manager', img: '/idPic.jpg' },
  { name: 'Aiza Valiente', role: 'Loan Officer', img: '/idPic.jpg' },
  { name: 'Rosielle Marie Navares', role: 'Loan Officer', img: '/idPic.jpg' },
  { name: 'Chris Damayo', role: 'Accountant', img: '/idPic.jpg' },
  { name: 'Bernie Gomez', role: 'Accountant', img: '/idPic.jpg' },
  { name: 'Voltair Bracero', role: 'Field Lead', img: '/idPic.jpg' },
  { name: 'Rodelo Lepiten', role: 'Head Collector', img: '/idPic.jpg' },
  { name: 'Shiela May Lepon', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Morgan Thomas', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Ryan Martinez', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Olivia Hernandez', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Kevin Lee', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Amy Gonzalez', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Jason Scott', role: 'Collector', img: '/idPic.jpg' },
  { name: 'Emma Lopez', role: 'Collector', img: '/idPic.jpg' },
];

const TeamSection = ({ language }: TeamSectionProps) => {
  return (
    <section className="py-24 bg-gray-50" id="team">
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
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
