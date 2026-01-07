'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

interface Promotion {
  id: string;
  title: string;
  description: string;
  bonusAmount: string;
  wagerRequirement: string;
  image: string;
  alt: string;
}

interface FeaturedPromoCarouselProps {
  promotions: Promotion[];
  onClaimBonus: (promotionId: string) => void;
}

const FeaturedPromoCarousel = ({
  promotions,
  onClaimBonus,
}: FeaturedPromoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, promotions.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + promotions.length) % promotions.length
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
    setIsAutoPlaying(false);
  };

  if (promotions.length === 0) return null;

  const currentPromo = promotions[currentIndex];

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-card shadow-warm-md">
      {/* Carousel Image */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <Image
          src={currentPromo?.image || ''}
          alt={currentPromo?.alt || 'Featured promotion'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Navigation Arrows */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-smooth"
              aria-label="Previous promotion"
            >
              <Icon name="ChevronLeftIcon" size={24} className="text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-smooth"
              aria-label="Next promotion"
            >
              <Icon name="ChevronRightIcon" size={24} className="text-white" />
            </button>
          </>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-accent text-black text-sm font-semibold rounded-full mb-3">
              Featured Offer
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {currentPromo?.title}
            </h2>
            <p className="text-white/90 text-sm md:text-base mb-4">
              {currentPromo?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="GiftIcon" size={20} className="text-accent" />
                <span className="text-white font-semibold">
                  {currentPromo?.bonusAmount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="ArrowPathIcon" size={20} className="text-accent" />
                <span className="text-white/80 text-sm">
                  {currentPromo?.wagerRequirement}
                </span>
              </div>
            </div>
            <button
              onClick={() => onClaimBonus(currentPromo?.id || '')}
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-black font-semibold rounded-lg transition-smooth shadow-warm-md hover:shadow-warm-lg"
            >
              Claim Now
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {promotions.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-smooth ${
                index === currentIndex
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedPromoCarousel;
