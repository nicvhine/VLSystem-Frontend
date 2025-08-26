'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import TrackModal from './trackModal';

export default function HeroSection() {
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  const slides = [
    { img: '../image1.jpg', alt: 'Slide 1' },
    { img: '../image2.jpg', alt: 'Slide 2' },
    { img: '../image3.jpg', alt: 'Slide 3' },
  ];

  return (
    <section className="text-black">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 mt-20 flex flex-col md:flex-row items-center md:items-start gap-8 overflow-hidden">
        {/* Text Content */}
        <div className="w-full md:w-1/2 md:text-left px-6 md:px-12">
          <p className="text-xl mb-2 select-none">VLSystem by Vistula Lending Corporation</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4 select-none">
            Empowering Lives <br /> Through Better Lending
          </h1>
          <p className="text-xl select-none">
            Experience seamless lending with our cutting-edge platform — fast, secure, and tailored to your needs.
          </p>

          <div className="flex flex-col mt-10 sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              href="/ApplicationPage"
              className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition focus:outline-none active:bg-red-600"
            >
              Apply Now
            </Link>

            <button
              onClick={() => setIsTrackOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition focus:outline-none active:bg-red-600"
            >
              Track Application
            </button>
          </div>
        </div>

        {/* Image Slider */}
        <div className="md:w-2/6 relative">
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
                  className="w-full h-[400px] object-cover rounded-xl select-none"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-prev swiper-button-prev"></div>
          <div className="custom-next swiper-button-next"></div>
        </div>

        <TrackModal isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
      </div>
    </section>
  );
}
