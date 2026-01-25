/**
 * Preferences Step - User preferences and settings
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign, Bell, Moon, Sun, Monitor } from "lucide-react";

interface PreferencesStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function PreferencesStep({ data, onChange, onNext }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState({
    language: data.language || "en",
    currency: data.currency || "KES",
    theme: data.theme || "system",
    notifications: data.notifications || {
      email: true,
      sms: true,
      push: true,
    },
  });

  const languages = [
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "sw", label: "Swahili", flag: "🇰🇪" },
    { value: "fr", label: "French", flag: "🇫🇷" },
  ];

  const currencies = [
    { value: "KES", label: "KES", name: "Kenyan Shilling" },
    { value: "UGX", label: "UGX", name: "Ugandan Shilling" },
    { value: "TZS", label: "TZS", name: "Tanzanian Shilling" },
  ];

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleSubmit = () => {
    onChange({ preferences });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Customize Your Experience</h2>
        <p className="text-muted-foreground">
          Set your preferences for language, currency, and notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, language: lang.value }))
                }
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  preferences.language === lang.value
                    ? "border-slate-700 bg-slate-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Default Currency</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {currencies.map((curr) => (
              <button
                key={curr.value}
                type="button"
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, currency: curr.value }))
                }
                className={`p-4 border-2 rounded-lg transition-all ${
                  preferences.currency === curr.value
                    ? "border-slate-700 bg-slate-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-lg font-bold mb-1">{curr.label}</div>
                <div className="text-xs text-muted-foreground">{curr.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Appearance</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, theme: theme.value }))
                  }
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    preferences.theme === theme.value
                      ? "border-slate-700 bg-slate-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{theme.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notification Preferences</span>
          </label>
          <div className="space-y-3 p-4 border rounded-lg">
            {[
              { key: "email", label: "Email Notifications", description: "Receive updates via email" },
              { key: "sms", label: "SMS Notifications", description: "Get text messages for important updates" },
              { key: "push", label: "Push Notifications", description: "Browser notifications for real-time updates" },
            ].map((notif) => (
              <label
                key={notif.key}
                className="flex items-start space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.notifications[notif.key as keyof typeof preferences.notifications]}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [notif.key]: e.target.checked,
                      },
                    }))
                  }
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-slate-700 focus:ring-slate-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{notif.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {notif.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={handleSubmit} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
