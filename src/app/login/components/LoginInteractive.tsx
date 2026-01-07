'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';
import TrustBadges from './TrustBadges';

const LoginInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLoginSuccess = () => {
    // Additional success handling if needed
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-surface-elevated-2 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-secondary caption">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md mb-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-glow-primary">
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
                  fill="currentColor"
                  className="text-black"
                />
                <path
                  d="M16 12L10 15V21L16 24L22 21V15L16 12Z"
                  fill="currentColor"
                  className="text-accent"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-text-secondary">
                Sign in to continue to Nexus Gaming Casino
              </p>
            </div>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border shadow-warm-lg">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router?.push('/registration')}
                className="text-accent hover:text-accent/80 font-medium transition-smooth"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <div className="w-full mt-8">
          <TrustBadges />
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary caption">
            © {new Date()?.getFullYear()} Nexus Gaming Casino. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginInteractive;
