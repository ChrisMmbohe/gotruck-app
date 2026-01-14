"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chrome, Apple } from "lucide-react";

interface SocialProvidersProps {
  mode: "signin" | "signup";
}

export function SocialProviders({ mode }: SocialProvidersProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider);
    // TODO: Implement actual OAuth logic with Clerk
    setTimeout(() => {
      setIsLoading(null);
    }, 2000);
  };

  const actionText = mode === "signin" ? "Sign in" : "Sign up";

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative group hover:bg-accent transition-colors"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading !== null}
      >
        <Chrome className="mr-2 h-5 w-5 text-[#4285F4]" />
        <span className="font-medium">
          {isLoading === "google" ? "Connecting..." : `${actionText} with Google`}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative group hover:bg-accent transition-colors"
        onClick={() => handleSocialLogin("apple")}
        disabled={isLoading !== null}
      >
        <Apple className="mr-2 h-5 w-5" />
        <span className="font-medium">
          {isLoading === "apple" ? "Connecting..." : `${actionText} with Apple`}
        </span>
      </Button>
    </div>
  );
}
