'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
  dailyDepositLimit: string;
  sessionTimeLimit: string;
  coolingOffPeriod: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  responsibleGamingAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const RegistrationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    ssn: '',
    dailyDepositLimit: '500',
    sessionTimeLimit: '120',
    coolingOffPeriod: '24',
    termsAccepted: false,
    privacyAccepted: false,
    responsibleGamingAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Weak',
    color: 'bg-error',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let label = 'Weak';
    let color = 'bg-error';

    if (score >= 4) {
      label = 'Strong';
      color = 'bg-success';
    } else if (score >= 3) {
      label = 'Medium';
      color = 'bg-warning';
    }

    setPasswordStrength({ score, label, color });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone number format';
      }
    }

    if (step === 2) {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const age =
          new Date().getFullYear() -
          new Date(formData.dateOfBirth).getFullYear();
        if (age < 21) {
          newErrors.dateOfBirth = 'You must be at least 21 years old';
        }
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Invalid ZIP code format';
      }
      if (!formData.ssn.trim()) {
        newErrors.ssn = 'SSN is required';
      } else if (!/^\d{9}$/.test(formData.ssn.replace(/\D/g, ''))) {
        newErrors.ssn = 'Invalid SSN format';
      }
    }

    if (step === 3) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms of service';
      }
      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = 'You must accept the privacy policy';
      }
      if (!formData.responsibleGamingAccepted) {
        newErrors.responsibleGamingAccepted =
          'You must acknowledge responsible gaming';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const authToken = 'mock_auth_token_' + Date.now();
      const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('sessionExpiry', sessionExpiry.toString());

      setIsSubmitting(false);
      router.push('/game-lobby');
    }, 2000);
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  };

  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(
      5,
      9
    )}`;
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-elevated-1 rounded w-3/4" />
            <div className="space-y-4">
              <div className="h-12 bg-surface-elevated-1 rounded" />
              <div className="h-12 bg-surface-elevated-1 rounded" />
              <div className="h-12 bg-surface-elevated-1 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-card rounded-xl border border-border shadow-warm-lg overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 font-heading">
            Create Your Account
          </h1>
          <p className="text-sm text-text-secondary caption">
            Step {currentStep} of 3 -{' '}
            {currentStep === 1
              ? 'Account Information'
              : currentStep === 2
              ? 'Verification Details'
              : 'Responsible Gaming'}
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary caption">
                Progress
              </span>
              <span className="text-xs font-medium text-primary data-text">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-elevated-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full h-12 px-4 bg-input border ${
                    errors.fullName ? 'border-error' : 'border-border'
                  } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full h-12 px-4 bg-input border ${
                    errors.email ? 'border-error' : 'border-border'
                  } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-4 pr-12 bg-input border ${
                      errors.password ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
                  >
                    <Icon
                      name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                      size={20}
                    />
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1 bg-surface-elevated-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium caption">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-4 pr-12 bg-input border ${
                      errors.confirmPassword ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
                  >
                    <Icon
                      name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                      size={20}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formatPhone(formData.phone)}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    handleInputChange({
                      ...e,
                      target: { ...e.target, value: cleaned },
                    });
                  }}
                  className={`w-full h-12 px-4 bg-input border ${
                    errors.phone ? 'border-error' : 'border-border'
                  } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 21)
                    )
                      .toISOString()
                      .split('T')[0]
                  }
                  className={`w-full h-12 px-4 bg-input border ${
                    errors.dateOfBirth ? 'border-error' : 'border-border'
                  } rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.dateOfBirth}
                  </p>
                )}
                <p className="mt-1 text-xs text-text-secondary caption">
                  You must be 21 or older to register
                </p>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full h-12 px-4 bg-input border ${
                    errors.address ? 'border-error' : 'border-border'
                  } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-error caption">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-4 bg-input border ${
                      errors.city ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-error caption">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-4 bg-input border ${
                      errors.state ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                  >
                    <option value="">Select State</option>
                    <option value="NJ">New Jersey</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="MI">Michigan</option>
                    <option value="WV">West Virginia</option>
                    <option value="CT">Connecticut</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-xs text-error caption">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-4 bg-input border ${
                      errors.zipCode ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                    placeholder="10001"
                    maxLength={5}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-xs text-error caption">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ssn"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Social Security Number *
                  </label>
                  <input
                    type="text"
                    id="ssn"
                    name="ssn"
                    value={formatSSN(formData.ssn)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '');
                      handleInputChange({
                        ...e,
                        target: { ...e.target, value: cleaned },
                      });
                    }}
                    className={`w-full h-12 px-4 bg-input border ${
                      errors.ssn ? 'border-error' : 'border-border'
                    } rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth`}
                    placeholder="123-45-6789"
                    maxLength={11}
                  />
                  {errors.ssn && (
                    <p className="mt-1 text-xs text-error caption">
                      {errors.ssn}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-3">
                  <Icon
                    name="ShieldCheckIcon"
                    size={20}
                    className="text-accent mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-text-secondary caption">
                      Your information is encrypted and used only for identity
                      verification and compliance with gaming regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-6 bg-surface-elevated-1 rounded-md border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-heading">
                  Responsible Gaming Limits
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="dailyDepositLimit"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Daily Deposit Limit
                    </label>
                    <select
                      id="dailyDepositLimit"
                      name="dailyDepositLimit"
                      value={formData.dailyDepositLimit}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-input border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    >
                      <option value="100">$100</option>
                      <option value="250">$250</option>
                      <option value="500">$500</option>
                      <option value="1000">$1,000</option>
                      <option value="2500">$2,500</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="sessionTimeLimit"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Session Time Limit (minutes)
                    </label>
                    <select
                      id="sessionTimeLimit"
                      name="sessionTimeLimit"
                      value={formData.sessionTimeLimit}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-input border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    >
                      <option value="60">60 minutes</option>
                      <option value="120">120 minutes</option>
                      <option value="180">180 minutes</option>
                      <option value="240">240 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="coolingOffPeriod"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Cooling-Off Period (hours)
                    </label>
                    <select
                      id="coolingOffPeriod"
                      name="coolingOffPeriod"
                      value={formData.coolingOffPeriod}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-input border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                    >
                      <option value="0">None</option>
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                      <option value="72">72 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                    I accept the{' '}
                    <span className="text-primary underline">
                      Terms of Service
                    </span>{' '}
                    and agree to abide by all rules and regulations *
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="ml-8 text-xs text-error caption">
                    {errors.termsAccepted}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                    I have read and agree to the{' '}
                    <span className="text-primary underline">
                      Privacy Policy
                    </span>{' '}
                    *
                  </span>
                </label>
                {errors.privacyAccepted && (
                  <p className="ml-8 text-xs text-error caption">
                    {errors.privacyAccepted}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="responsibleGamingAccepted"
                    checked={formData.responsibleGamingAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                    I acknowledge the{' '}
                    <span className="text-primary underline">
                      Responsible Gaming
                    </span>{' '}
                    guidelines and understand the risks of gambling *
                  </span>
                </label>
                {errors.responsibleGamingAccepted && (
                  <p className="ml-8 text-xs text-error caption">
                    {errors.responsibleGamingAccepted}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md border border-border">
                <div className="flex items-center gap-2">
                  <Icon
                    name="ShieldCheckIcon"
                    size={20}
                    className="text-success"
                  />
                  <span className="text-xs text-text-secondary caption">
                    SSL Secured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name="CheckBadgeIcon"
                    size={20}
                    className="text-success"
                  />
                  <span className="text-xs text-text-secondary caption">
                    Licensed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name="LockClosedIcon"
                    size={20}
                    className="text-success"
                  />
                  <span className="text-xs text-text-secondary caption">
                    Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name="UserGroupIcon"
                    size={20}
                    className="text-success"
                  />
                  <span className="text-xs text-text-secondary caption">
                    21+ Only
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center justify-center gap-2 h-12 px-6 bg-surface-elevated-1 text-text-primary rounded-md font-medium transition-smooth hover:bg-surface-elevated-2 active:scale-95"
              >
                <Icon name="ArrowLeftIcon" size={18} />
                <span>Previous</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95"
              >
                <span>Continue</span>
                <Icon name="ArrowRightIcon" size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.termsAccepted ||
                  !formData.privacyAccepted ||
                  !formData.responsibleGamingAccepted
                }
                className="flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:scale-[0.97] hover:shadow-glow-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircleIcon" size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
