'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isHydrated) {
          const authToken = data.access_token;
          const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000;

          localStorage.setItem('authToken', authToken);
          localStorage.setItem('sessionExpiry', sessionExpiry.toString());
          // Store user info if needed
          localStorage.setItem('user', JSON.stringify(data.user));

          if (formData.rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
          }
        }

        if (onSuccess) {
          onSuccess();
        }

        router.push('/game-lobby');
      } else {
        setErrors({
          general: data.message || 'Invalid email or password.',
        });
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred during login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setErrors({
      general: `${provider} login is currently unavailable. Please use email login.`,
    });
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl border border-border">
        <div className="space-y-6">
          <div className="h-12 bg-surface-elevated-1 rounded-md animate-pulse" />
          <div className="h-12 bg-surface-elevated-1 rounded-md animate-pulse" />
          <div className="h-12 bg-surface-elevated-1 rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errors.general && (
          <div
            className="flex items-start gap-3 p-4 bg-error/10 border border-error rounded-md"
            role="alert"
            aria-live="polite"
          >
            <Icon
              name="ExclamationCircleIcon"
              size={20}
              className="text-error mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 bg-input border ${errors.email ? 'border-error' : 'border-border'
                } rounded-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth`}
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Icon
                name="EnvelopeIcon"
                size={20}
                className="text-text-secondary"
              />
            </div>
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-error caption"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 bg-input border ${errors.password ? 'border-error' : 'border-border'
                } rounded-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth`}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              <Icon
                name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                size={20}
              />
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-error caption"
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => router.push('/registration')}
            className="text-sm text-accent hover:text-accent/80 transition-smooth"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary text-primary-foreground rounded-md font-semibold transition-smooth hover:scale-[0.98] hover:shadow-glow-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-text-secondary caption">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center h-12 bg-surface-elevated-1 border border-border rounded-md transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
            aria-label="Sign in with Google"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="flex items-center justify-center h-12 bg-surface-elevated-1 border border-border rounded-md transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
            aria-label="Sign in with Facebook"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 text-[#1877F2]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="flex items-center justify-center h-12 bg-surface-elevated-1 border border-border rounded-md transition-smooth hover:border-accent hover:shadow-glow-accent active:scale-95"
            aria-label="Sign in with Apple"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 text-text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
