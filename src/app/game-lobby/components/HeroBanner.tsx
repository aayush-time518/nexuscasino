'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

const HeroBanner = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const slides: HeroSlide[] = [
    {
      id: 1,
      title: 'Mega Fortune Jackpot',
      subtitle: 'Progressive jackpot now at $2.4M',
      image:
        'https://images.unsplash.com/photo-1561450098-bea23aa64db5',
      alt: 'Luxury golden slot machine with sparkling diamonds and coins on dark casino background',
      ctaText: 'Play Now',
      ctaLink: '/game-play-interface',
      badge: 'HOT',
    },
    {
      id: 2,
      title: 'Live Blackjack Tables',
      subtitle: 'Real dealers, real-time action',
      image: 'https://images.unsplash.com/photo-1627831388561-c84b73b3ea3f',
      alt: 'Professional dealer in black vest dealing cards at green felt blackjack table with chips',
      ctaText: 'Join Table',
      ctaLink: '/game-play-interface',
      badge: 'LIVE',
    },
    {
      id: 3,
      title: 'Welcome Bonus',
      subtitle: '100% match up to $1,000 + 50 free spins',
      image: 'https://images.unsplash.com/photo-1561450098-bea23aa64db5',
      alt: 'Stack of colorful casino chips with golden coins and playing cards on dark surface',
      ctaText: 'Claim Bonus',
      ctaLink: '/payment-methods',
      badge: 'NEW',
    },
  ];

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHydrated, slides.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (link: string) => {
    router.push(link);
  };

  if (!isHydrated) {
    return (
      <div className="relative w-full h-[400px] lg:h-[500px] bg-surface-elevated-1 rounded-xl overflow-hidden animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-warm-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative w-full h-full">
            <AppImage
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-2xl">
                  {slide.badge && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-black text-xs font-bold rounded-full mb-4">
                      <Icon name="SparklesIcon" size={14} variant="solid" />
                      {slide.badge}
                    </span>
                  )}
                  <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
                    {slide.title}
                  </h2>
                  <p className="text-lg lg:text-xl text-text-secondary mb-6">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => handleCTAClick(slide.ctaLink)}
                    className="flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-md font-semibold transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                  >
                    <span>{slide.ctaText}</span>
                    <Icon name="ArrowRightIcon" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-2 bg-text-secondary hover:bg-text-primary'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
