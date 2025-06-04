"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import TrackModal from './trackmodal';

interface HeroSectionProps {
  language: 'en' | 'ceb';
}

export default function HeroSection({ language }: HeroSectionProps) {
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  const slides = [
    { img: '/image1.jpg', alt: 'Slide 1' },
    { img: '/image2.jpg', alt: 'Slide 2' },
    { img: '/image3.jpg', alt: 'Slide 3' },
  ];

  useEffect(() => {
    document.querySelectorAll('.swiper-button-prev, .swiper-button-next').forEach((btn) => {
      btn.classList.add('custom-swiper-button');
    });
  }, []);

  return (
    <section className="bg-gradient-to-br from-red-100 via-white to-white py-20">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-6 md:px-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 animate-fade-in text-center md:text-left">
          <p className="text-sm text-gray-500 mb-2">
            {language === 'en'
              ? 'VLSystem by Vistula Lending Corporation'
              : 'VLSystem sa Vistula Lending Corporation'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {language === 'en'
              ? 'Empowering Lives Through Better Lending'
              : 'Paghatag Kusog sa Kinabuhi Pinaagi sa Mas Maayong Pahulam'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {language === 'en'
              ? 'Experience seamless lending with our cutting-edge platform — fast, secure, and tailored to your needs.'
              : 'Masinati ang sayon ug paspas nga pagpahulam gamit ang among modernong plataporma — dali, luwas, ug angay para nimo.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              href="/landing/ApplicationPage"
              className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition"
            >
              {language === 'en' ? 'Apply Now' : 'Mag-aplay Karon'}
            </Link>

            <button
              onClick={() => setIsTrackOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition"
            >
              Track Application
            </button>
          </div>
        </div>

        {/* Image Slider */}
        <div className="w-full md:w-1/2 relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            autoplay={{ delay: 5000 }}
            loop
            className="w-full rounded-xl shadow-xl"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center">
                <img
                  src={slide.img}
                  alt={slide.alt}
                  className="w-full h-[400px] object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-prev swiper-button-prev"></div>
          <div className="custom-next swiper-button-next"></div>
        </div>
      </div>

      <style jsx>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: white !important;
          font-size: 2rem !important;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 2.5rem !important;
        }
      `}</style>

        {isTrackOpen && (
          <TrackModal isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
        )}

    </section>
  );
}
