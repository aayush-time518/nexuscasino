'use client';

import React from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

interface Promotion {
  id: string;
  title: string;
  description: string;
  bonusAmount: string;
  wagerRequirement: string;
  expiryDate: string;
  eligibility: string;
  terms: string;
  image: string;
  alt: string;
}

interface PromotionCardProps {
  promotion: Promotion;
  onClaimBonus: (promotionId: string) => void;
  onToggleTerms: (promotionId: string) => void;
  isTermsExpanded: boolean;
}

const PromotionCard = ({
  promotion,
  onClaimBonus,
  onToggleTerms,
  isTermsExpanded,
}: PromotionCardProps) => {
  return (
    <div className="bg-card rounded-xl shadow-warm-md overflow-hidden border border-border hover:shadow-warm-lg transition-smooth">
      {/* Promotion Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={promotion.image}
          alt={promotion.alt}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Promotion Content */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {promotion.title}
          </h3>
          <p className="text-text-secondary text-sm">{promotion.description}</p>
        </div>

        {/* Bonus Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Icon
              name="GiftIcon"
              size={20}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs text-text-secondary">Bonus Amount</p>
              <p className="font-semibold text-text-primary">
                {promotion.bonusAmount}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon
              name="ArrowPathIcon"
              size={20}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs text-text-secondary">Wagering</p>
              <p className="font-semibold text-text-primary">
                {promotion.wagerRequirement}
              </p>
            </div>
          </div>
        </div>

        {/* Expiry and Eligibility */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Icon name="ClockIcon" size={16} className="flex-shrink-0" />
            <span>Expires: {promotion.expiryDate}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Icon name="UserGroupIcon" size={16} className="flex-shrink-0" />
            <span>{promotion.eligibility}</span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => onToggleTerms(promotion.id)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-text-primary">
              Terms & Conditions
            </span>
            <Icon
              name={isTermsExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={20}
              className="text-text-secondary"
            />
          </button>
          {isTermsExpanded && (
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              {promotion.terms}
            </p>
          )}
        </div>

        {/* Claim Button */}
        <button
          onClick={() => onClaimBonus(promotion.id)}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-smooth shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2"
        >
          <Icon name="GiftIcon" size={20} />
          <span>Claim Now</span>
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;
