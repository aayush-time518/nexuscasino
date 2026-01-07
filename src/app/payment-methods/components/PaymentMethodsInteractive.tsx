'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import PaymentMethodCard from './PaymentMethodCard';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import TransactionCard from './TransactionCard';
import DepositWithdrawModal from './DepositWithdrawModal';

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

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  date: string;
  estimatedCompletion?: string;
}

const PaymentMethodsInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositLimit, setDepositLimit] = useState(5000);
  const [currentDeposits, setCurrentDeposits] = useState(1234.56);

  useEffect(() => {
    setIsHydrated(true);

    const fetchData = async () => {
      try {
        const [methodsRes, transactionsRes] = await Promise.all([
          fetch('/api/payment-methods'),
          fetch('/api/transactions'),
        ]);

        if (methodsRes.ok) {
          const methods = await methodsRes.json();
          setPaymentMethods(methods);
        }

        if (transactionsRes.ok) {
          const trans = await transactionsRes.json();
          setTransactions(trans);
          if (trans.length > 0) {
            // Calculate deposits for mock logic if needed or fetch from user stats
            const deposits = trans
              .filter((t: any) => t.type === 'deposit' && t.status === 'completed')
              .reduce((acc: number, t: any) => acc + t.amount, 0);
            setCurrentDeposits(deposits);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-secondary caption">
            Loading payment methods...
          </p>
        </div>
      </div>
    );
  }

  const handleAddMethod = (method: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, method]);
  };

  const handleEditMethod = (id: string) => {
    console.log('Edit method:', id);
  };

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleTransaction = (data: any) => {
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: data.type,
      amount: data.amount,
      status: 'pending',
      method: data.method,
      date: new Date().toLocaleDateString('en-US'),
      estimatedCompletion:
        data.type === 'deposit' ? 'Instant' : '3-5 business days',
    };

    setTransactions([newTransaction, ...transactions]);

    if (data.type === 'deposit') {
      setCurrentDeposits(currentDeposits + data.amount);
    }
  };

  const remainingLimit = depositLimit - currentDeposits;
  const limitPercentage = (currentDeposits / depositLimit) * 100;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-heading">
            Payment Methods
          </h1>
          <p className="text-text-secondary">
            Manage your payment methods and view transaction history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-warm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary font-heading">
                  Saved Payment Methods
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                >
                  <Icon name="PlusIcon" size={18} />
                  <span>Add Method</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={handleEditMethod}
                    onRemove={handleRemoveMethod}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>

              {paymentMethods.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-surface-elevated-1 rounded-full">
                    <Icon
                      name="CreditCardIcon"
                      size={32}
                      className="text-text-secondary"
                    />
                  </div>
                  <p className="text-text-secondary mb-4">
                    No payment methods added yet
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                  >
                    Add Your First Method
                  </button>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border shadow-warm p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 font-heading">
                Recent Transactions
              </h2>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-surface-elevated-1 rounded-full">
                    <Icon
                      name="ClockIcon"
                      size={32}
                      className="text-text-secondary"
                    />
                  </div>
                  <p className="text-text-secondary">No transactions yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-warm p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 font-heading">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-center gap-3 w-full h-12 px-4 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
                >
                  <Icon name="ArrowDownTrayIcon" size={20} />
                  <span>Deposit Funds</span>
                </button>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center gap-3 w-full h-12 px-4 bg-surface-elevated-1 text-text-primary border border-border rounded-md font-medium transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
                >
                  <Icon name="ArrowUpTrayIcon" size={20} />
                  <span>Withdraw Funds</span>
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-warm p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 font-heading">
                Deposit Limits
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary caption">
                      Current Period
                    </span>
                    <span className="text-sm font-medium text-text-primary data-text">
                      ${currentDeposits.toFixed(2)} / ${depositLimit.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-elevated-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.min(limitPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-2 caption">
                    ${remainingLimit.toFixed(2)} remaining
                  </p>
                </div>

                <button className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-smooth">
                  <Icon name="Cog6ToothIcon" size={16} />
                  <span>Modify Limits</span>
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-warm p-6">
              <div className="flex items-start gap-3">
                <Icon
                  name="ShieldCheckIcon"
                  size={24}
                  className="text-success mt-0.5"
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">
                    Secure Payments
                  </h3>
                  <p className="text-xs text-text-secondary caption">
                    All transactions are encrypted with 256-bit SSL security.
                    Your payment information is never stored on our servers.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="px-2 py-1 bg-surface-elevated-1 rounded text-[10px] font-medium text-text-secondary caption">
                      PCI DSS
                    </div>
                    <div className="px-2 py-1 bg-surface-elevated-1 rounded text-[10px] font-medium text-text-secondary caption">
                      SSL Certified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMethod}
      />

      <DepositWithdrawModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        type="deposit"
        methods={paymentMethods.filter((m) => m.isVerified)}
        onSubmit={handleTransaction}
      />

      <DepositWithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        type="withdrawal"
        methods={paymentMethods.filter((m) => m.isVerified)}
        onSubmit={handleTransaction}
      />
    </div>
  );
};

export default PaymentMethodsInteractive;
