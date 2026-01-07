'use client';

import React, { useState } from 'react';
import FeaturedPromoCarousel from './FeaturedPromoCarousel';
import PromotionFilters from './PromotionFilters';
import PromotionCard from './PromotionCard';
import VIPSection from './VIPSection';
import LoyaltyTracker from './LoyaltyTracker';
import ActiveBonusTracker from './ActiveBonusTracker';

interface Promotion {
  id: string;
  title: string;
  description: string;
  bonusAmount: string;
  wagerRequirement: string;
  expiryDate: string;
  eligibility: string;
  terms: string;
  category: 'welcome' | 'reload' | 'freespins' | 'cashback' | 'vip';
  image: string;
  alt: string;
  featured?: boolean;
}

const PromotionsInteractive = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const activeCategory = selectedCategory; // Alias for consistency if needed

  useEffect(() => {
    setIsHydrated(true);

    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
          // Initial filter setup
          if (activeCategory === 'all') {
            setFilteredPromotions(data);
          } else {
            setFilteredPromotions(data.filter((p: Promotion) => p.category === activeCategory));
          }
        } else {
          console.error('Failed to fetch promotions');
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPromotions(promotions);
    } else {
      setFilteredPromotions(
        promotions.filter((promo) => promo.category === selectedCategory)
      );
    }
  }, [selectedCategory, promotions]);

  const featuredPromotions = promotions.filter((promo) => promo.featured);

  const handleClaimBonus = (promotionId: string) => {
    console.log('Claiming bonus:', promotionId);
    // Navigate to game lobby or show claim modal
  };

  const toggleTerms = (promotionId: string) => {
    setExpandedTerms(expandedTerms === promotionId ? null : promotionId);
  };

  return (
    <div className="space-y-8 px-4">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Promotions & Bonuses
        </h1>
        <p className="text-text-secondary">
          Discover exclusive offers, reload bonuses, and VIP rewards
        </p>
      </div>

      {/* Featured Promotions Carousel */}
      <FeaturedPromoCarousel
        promotions={featuredPromotions}
        onClaimBonus={handleClaimBonus}
      />

      {/* Active Bonus Tracker */}
      <ActiveBonusTracker />

      {/* Loyalty Program Tracker */}
      <LoyaltyTracker />

      {/* VIP Section */}
      <VIPSection />

      {/* Promotion Filters */}
      <PromotionFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            onClaimBonus={handleClaimBonus}
            onToggleTerms={toggleTerms}
            isTermsExpanded={expandedTerms === promotion.id}
          />
        ))}
      </div>

      {/* No Promotions Message */}
      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            No promotions available in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default PromotionsInteractive;
