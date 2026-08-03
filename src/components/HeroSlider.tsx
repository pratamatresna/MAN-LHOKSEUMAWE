/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Users, Calendar, Award } from 'lucide-react';

interface HeroSliderProps {
  setTab: (tab: string, sub?: string) => void;
}

export default function HeroSlider({ setTab }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Selamat Datang di MAN Kota Lhokseumawe',
      subtitle: 'Membentuk Generasi Robbani yang Unggul dalam Sains, Kokoh dalam Imtaq, dan Berkarakter Qur’ani.',
      bgUrl: '/images/hero1.jpg',
      cta1: { label: 'PPDB Online 2026', tab: 'ppdb', sub: 'ppdb-daftar' },
      cta2: { label: 'E-Learning Siswa', tab: 'portal', sub: '' }
    },
    {
      title: 'Madrasah Unggulan Sains & Riset Teknologi',
      subtitle: 'Membuka wawasan masa depan dengan laboratorium cerdas, pembelajaran sains empiris, dan riset robotika inovatif.',
      bgUrl: '/images/hero2.png',
      cta1: { label: 'Profil Akademik', tab: 'profil', sub: 'akreditasi' },
      cta2: { label: 'Silabus & Download', tab: 'publikasi', sub: 'download-area' }
    },
    {
      title: 'Program Unggulan Tahfidz & Kajian Turats',
      subtitle: 'Membina hafalan Al-Qur\'an intensif bersanad serta penguasaan kitab kuning guna melahirkan ulama masa depan.',
      bgUrl: '/images/hero3.jpg',
      cta1: { label: 'Kegiatan Tahfidz', tab: 'akademik', sub: 'ekstra' },
      cta2: { label: 'Hubungi Keagamaan', tab: 'kontak', sub: 'hubungi' }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-slate-900" id="hero-carousel">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Cover Overlay with neutral dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/20 to-transparent z-10" />
          <img
            src={slide.bgUrl}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-102 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />

          {/* Slide Text & Buttons */}
          <div className="absolute inset-0 flex items-center z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-3xl text-left space-y-5">
              <span className="inline-block bg-brand-gold text-slate-950 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded">
                PRESTASI MAJU • ACADEMIC EXCELLENCE
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow uppercase">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-lg text-white leading-relaxed font-sans font-medium max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={() => setTab(slide.cta1.tab, slide.cta1.sub)}
                  className="bg-brand-gold hover:bg-white text-slate-950 hover:text-slate-950 font-sans font-bold text-xs sm:text-xs tracking-wider uppercase px-7 py-3 rounded shadow transition-all cursor-pointer border border-brand-gold hover:border-white"
                >
                  {slide.cta1.label}
                </button>
                <button
                  onClick={() => setTab(slide.cta2.tab, slide.cta2.sub)}
                  className="bg-transparent hover:bg-brand-gold text-white hover:text-slate-950 font-sans font-bold text-xs sm:text-xs tracking-wider uppercase px-7 py-3 rounded border border-white hover:border-brand-gold transition-all cursor-pointer"
                >
                  {slide.cta2.label}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Sliding Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-brand-gold hover:text-slate-950 text-white p-2.5 rounded transition-colors cursor-pointer"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-brand-gold hover:text-slate-950 text-white p-2.5 rounded transition-colors cursor-pointer"
        aria-label="Slide berikutnya"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Slide Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
              index === currentSlide ? 'bg-brand-gold w-8' : 'bg-white/50'
            }`}
            aria-label={`Buka slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
