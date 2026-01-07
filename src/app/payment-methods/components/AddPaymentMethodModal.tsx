'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
}

const AddPaymentMethodModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddPaymentMethodModalProps) => {
  const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'wallet'>(
    'card'
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [walletType, setWalletType] = useState('paypal');
  const [walletEmail, setWalletEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newMethod;
    if (activeTab === 'card') {
      newMethod = {
        id: `card_${Date.now()}`,
        type: 'card',
        name: cardName,
        last4: cardNumber.slice(-4),
        expiryDate: `${expiryMonth}/${expiryYear}`,
        isVerified: true,
        isDefault: false,
        brand: 'Visa',
      };
    } else if (activeTab === 'bank') {
      newMethod = {
        id: `bank_${Date.now()}`,
        type: 'bank',
        name: accountName,
        last4: accountNumber.slice(-4),
        isVerified: false,
        isDefault: false,
      };
    } else {
      newMethod = {
        id: `wallet_${Date.now()}`,
        type: 'wallet',
        name: walletType.charAt(0).toUpperCase() + walletType.slice(1),
        last4: walletEmail.slice(-4),
        isVerified: true,
        isDefault: false,
      };
    }

    onAdd(newMethod);
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] bg-card rounded-xl border border-border shadow-warm-2xl z-[500] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-payment-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2
            id="add-payment-title"
            className="text-xl font-semibold text-text-primary font-heading"
          >
            Add Payment Method
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md transition-smooth hover:bg-muted"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-secondary" />
          </button>
        </div>

        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-smooth ${
                activeTab === 'card'
                  ? 'text-primary border-b-2 border-primary bg-surface-elevated-1'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="CreditCardIcon" size={18} />
                <span>Card</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-smooth ${
                activeTab === 'bank'
                  ? 'text-primary border-b-2 border-primary bg-surface-elevated-1'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="BuildingLibraryIcon" size={18} />
                <span>Bank</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-smooth ${
                activeTab === 'wallet'
                  ? 'text-primary border-b-2 border-primary bg-surface-elevated-1'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="WalletIcon" size={18} />
                <span>Wallet</span>
              </div>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          {activeTab === 'card' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  placeholder="1234 5678 9012 3456"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                  required
                  maxLength={19}
                />
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="expiryMonth"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Month
                  </label>
                  <input
                    type="text"
                    id="expiryMonth"
                    value={expiryMonth}
                    onChange={(e) =>
                      setExpiryMonth(
                        e.target.value.replace(/\D/g, '').slice(0, 2)
                      )
                    }
                    placeholder="MM"
                    className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                    required
                    maxLength={2}
                  />
                </div>
                <div>
                  <label
                    htmlFor="expiryYear"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Year
                  </label>
                  <input
                    type="text"
                    id="expiryYear"
                    value={expiryYear}
                    onChange={(e) =>
                      setExpiryYear(
                        e.target.value.replace(/\D/g, '').slice(0, 2)
                      )
                    }
                    placeholder="YY"
                    className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                    required
                    maxLength={2}
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    placeholder="123"
                    className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                    required
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-3">
                  <Icon
                    name="InformationCircleIcon"
                    size={20}
                    className="text-accent mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-text-secondary caption">
                      Processing time: Instant • Fees: None • Min: $10 • Max:
                      $5,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="routingNumber"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Routing Number
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) =>
                    setRoutingNumber(
                      e.target.value.replace(/\D/g, '').slice(0, 9)
                    )
                  }
                  placeholder="123456789"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                  required
                  maxLength={9}
                />
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value.replace(/\D/g, '').slice(0, 17)
                    )
                  }
                  placeholder="1234567890123456"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                  required
                  maxLength={17}
                />
              </div>

              <div className="p-4 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-3">
                  <Icon
                    name="InformationCircleIcon"
                    size={20}
                    className="text-accent mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-text-secondary caption">
                      Processing time: 3-5 business days • Fees: None • Min: $50
                      • Max: $10,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="walletType"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Wallet Type
                </label>
                <select
                  id="walletType"
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="paypal">PayPal</option>
                  <option value="venmo">Venmo</option>
                  <option value="skrill">Skrill</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="walletEmail"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="walletEmail"
                  value={walletEmail}
                  onChange={(e) => setWalletEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="p-4 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-3">
                  <Icon
                    name="InformationCircleIcon"
                    size={20}
                    className="text-accent mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-text-secondary caption">
                      Processing time: Instant • Fees: 2.5% • Min: $10 • Max:
                      $2,500
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 px-6 bg-surface-elevated-1 text-text-primary rounded-md font-medium transition-smooth hover:bg-surface-elevated-2 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
            >
              Add Method
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPaymentMethodModal;
