'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  last4: string;
  expiryDate?: string;
  isVerified: boolean;
  isDefault: boolean;
  brand?: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentMethodCard = ({
  method,
  onEdit,
  onRemove,
  onSetDefault,
}: PaymentMethodCardProps) => {
  const getIcon = () => {
    switch (method.type) {
      case 'card':
        return 'CreditCardIcon';
      case 'bank':
        return 'BuildingLibraryIcon';
      case 'wallet':
        return 'WalletIcon';
      default:
        return 'CreditCardIcon';
    }
  };

  const getBrandColor = () => {
    if (method.brand === 'Visa') return 'text-blue-500';
    if (method.brand === 'Mastercard') return 'text-orange-500';
    if (method.brand === 'Amex') return 'text-blue-400';
    return 'text-text-primary';
  };

  return (
    <div className="p-4 bg-surface-elevated-1 rounded-md border border-border transition-smooth hover:border-accent hover:shadow-glow-accent">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-surface-elevated-2 rounded-md">
            <Icon
              name={getIcon() as any}
              size={24}
              className={getBrandColor()}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary">
                {method.name}
              </p>
              {method.isDefault && (
                <span className="px-2 py-0.5 text-[10px] font-medium text-black bg-accent rounded caption">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5 data-text">
              •••• {method.last4}
            </p>
            {method.expiryDate && (
              <p className="text-xs text-text-secondary mt-0.5 caption">
                Expires {method.expiryDate}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {method.isVerified ? (
            <div className="flex items-center justify-center w-6 h-6 bg-success/20 rounded-full">
              <Icon
                name="CheckCircleIcon"
                size={16}
                className="text-success"
                variant="solid"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-6 h-6 bg-warning/20 rounded-full">
              <Icon
                name="ExclamationCircleIcon"
                size={16}
                className="text-warning"
                variant="solid"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!method.isDefault && (
          <button
            onClick={() => onSetDefault(method.id)}
            className="flex-1 h-9 px-3 bg-surface-elevated-2 text-text-primary rounded-md text-xs font-medium transition-smooth hover:bg-surface-elevated-3 active:scale-95"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onEdit(method.id)}
          className="flex items-center justify-center w-9 h-9 bg-surface-elevated-2 rounded-md transition-smooth hover:bg-surface-elevated-3 active:scale-95"
          aria-label="Edit payment method"
        >
          <Icon name="PencilIcon" size={16} className="text-text-primary" />
        </button>
        <button
          onClick={() => onRemove(method.id)}
          className="flex items-center justify-center w-9 h-9 bg-error/20 rounded-md transition-smooth hover:bg-error/30 active:scale-95"
          aria-label="Remove payment method"
        >
          <Icon name="TrashIcon" size={16} className="text-error" />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
