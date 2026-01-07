'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const LoginPrompt = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <p className="text-sm text-text-secondary mb-4">
          Already have an account?
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-surface-elevated-1 text-text-primary rounded-md font-medium transition-smooth hover:bg-surface-elevated-2 hover:shadow-warm active:scale-95"
        >
          <Icon name="ArrowRightOnRectangleIcon" size={18} />
          <span>Sign In to Your Account</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPrompt;
