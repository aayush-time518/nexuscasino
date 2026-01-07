'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  last4: string;
  isVerified: boolean;
}

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdrawal';
  methods: PaymentMethod[];
  onSubmit: (data: any) => void;
}

const DepositWithdrawModal = ({
  isOpen,
  onClose,
  type,
  methods,
  onSubmit,
}: DepositWithdrawModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  if (!isOpen) return null;

  const quickAmounts =
    type === 'deposit' ? [25, 50, 100, 250, 500] : [50, 100, 250, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMethodData = methods.find((m) => m.id === selectedMethod);

    onSubmit({
      type,
      amount: parseFloat(amount),
      method: selectedMethodData?.name || '',
      methodId: selectedMethod,
      cvv: selectedMethodData?.type === 'card' ? cvv : undefined,
    });

    setAmount('');
    setCvv('');
    setSelectedMethod('');
    onClose();
  };

  const selectedMethodData = methods.find((m) => m.id === selectedMethod);
  const requiresCvv = selectedMethodData?.type === 'card';

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-card rounded-xl border border-border shadow-warm-2xl z-[500]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2
            id="transaction-title"
            className="text-xl font-semibold text-text-primary font-heading"
          >
            {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md transition-smooth hover:bg-muted"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={selectedMethod}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setShowCvv(false);
                }}
                className="w-full h-12 px-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select a method</option>
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} •••• {method.last4}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary data-text">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="10"
                  max={type === 'deposit' ? '5000' : '10000'}
                  className="w-full h-12 pl-8 pr-4 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="px-4 py-2 bg-surface-elevated-1 text-text-primary rounded-md text-sm font-medium transition-smooth hover:bg-surface-elevated-2 hover:border-accent border border-border active:scale-95"
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {requiresCvv && selectedMethod && (
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  CVV Security Code
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? 'text' : 'password'}
                    id="cvv"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    placeholder="123"
                    className="w-full h-12 px-4 pr-12 bg-input text-text-primary border border-border rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-ring data-text"
                    required
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
                    aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
                  >
                    <Icon
                      name={showCvv ? 'EyeSlashIcon' : 'EyeIcon'}
                      size={20}
                    />
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded-md border border-border">
              <div className="flex items-start gap-3">
                <Icon
                  name="ShieldCheckIcon"
                  size={20}
                  className="text-success mt-0.5"
                />
                <div>
                  <p className="text-xs text-text-secondary caption">
                    {type === 'deposit'
                      ? 'Your deposit will be processed instantly and available for play immediately.'
                      : 'Withdrawals are processed within 3-5 business days. Funds will be sent to your selected payment method.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
              {type === 'deposit' ? 'Deposit' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DepositWithdrawModal;
