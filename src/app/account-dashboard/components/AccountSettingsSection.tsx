'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface AccountSettingsSectionProps {
  notificationSettings: SettingItem[];
  privacySettings: SettingItem[];
}

const AccountSettingsSection = ({
  notificationSettings,
  privacySettings,
}: AccountSettingsSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    'notifications' | 'privacy' | null
  >(null);
  const [localNotifications, setLocalNotifications] =
    useState(notificationSettings);
  const [localPrivacy, setLocalPrivacy] = useState(privacySettings);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-elevated-1 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-elevated-1 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const toggleNotification = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const togglePrivacy = (id: string) => {
    setLocalPrivacy((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const toggleSection = (section: 'notifications' | 'privacy') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-warm-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full">
          <Icon name="Cog6ToothIcon" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary font-heading">
          Account Settings
        </h2>
      </div>

      <div className="space-y-3">
        <div className="bg-surface-elevated-1 border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('notifications')}
            className="flex items-center justify-between w-full p-4 transition-smooth hover:bg-surface-elevated-2"
            aria-expanded={expandedSection === 'notifications'}
          >
            <div className="flex items-center gap-3">
              <Icon name="BellIcon" size={20} className="text-text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  Notification Preferences
                </p>
                <p className="text-xs text-text-secondary mt-1 caption">
                  Manage how you receive updates
                </p>
              </div>
            </div>
            <Icon
              name="ChevronDownIcon"
              size={20}
              className={`text-text-secondary transition-transform ${
                expandedSection === 'notifications' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'notifications' && (
            <div className="border-t border-border p-4 space-y-3">
              {localNotifications.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-3 bg-surface-elevated-2 rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Icon
                      name={setting.icon as any}
                      size={20}
                      className="text-text-primary mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {setting.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1 caption">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleNotification(setting.id)}
                    className={`relative w-12 h-6 rounded-full transition-smooth flex-shrink-0 ml-3 ${
                      setting.enabled ? 'bg-primary' : 'bg-surface-elevated-3'
                    }`}
                    role="switch"
                    aria-checked={setting.enabled}
                    aria-label={`Toggle ${setting.title}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-elevated-1 border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('privacy')}
            className="flex items-center justify-between w-full p-4 transition-smooth hover:bg-surface-elevated-2"
            aria-expanded={expandedSection === 'privacy'}
          >
            <div className="flex items-center gap-3">
              <Icon
                name="LockClosedIcon"
                size={20}
                className="text-text-primary"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  Privacy & Security
                </p>
                <p className="text-xs text-text-secondary mt-1 caption">
                  Control your data and privacy
                </p>
              </div>
            </div>
            <Icon
              name="ChevronDownIcon"
              size={20}
              className={`text-text-secondary transition-transform ${
                expandedSection === 'privacy' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'privacy' && (
            <div className="border-t border-border p-4 space-y-3">
              {localPrivacy.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-3 bg-surface-elevated-2 rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Icon
                      name={setting.icon as any}
                      size={20}
                      className="text-text-primary mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {setting.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1 caption">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePrivacy(setting.id)}
                    className={`relative w-12 h-6 rounded-full transition-smooth flex-shrink-0 ml-3 ${
                      setting.enabled ? 'bg-primary' : 'bg-surface-elevated-3'
                    }`}
                    role="switch"
                    aria-checked={setting.enabled}
                    aria-label={`Toggle ${setting.title}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="flex items-center justify-center gap-2 flex-1 h-12 px-6 bg-surface-elevated-1 border border-border text-text-primary rounded-lg font-medium transition-smooth hover:border-accent hover:shadow-glow-accent">
          <Icon name="KeyIcon" size={20} />
          <span>Change Password</span>
        </button>

        <button className="flex items-center justify-center gap-2 flex-1 h-12 px-6 bg-surface-elevated-1 border border-border text-text-primary rounded-lg font-medium transition-smooth hover:border-accent hover:shadow-glow-accent">
          <Icon name="DevicePhoneMobileIcon" size={20} />
          <span>Two-Factor Auth</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsSection;
