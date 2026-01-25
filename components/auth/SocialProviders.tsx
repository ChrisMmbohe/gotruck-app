"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Chrome, Apple } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { OAuthStrategy } from "@clerk/types";

interface SocialProvidersProps {
  mode: "signin" | "signup";
}

export function SocialProviders({ mode }: SocialProvidersProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { toast } = useToast();

  const handleSocialLogin = async (provider: OAuthStrategy) => {
    setIsLoading(provider);
    
    try {
      const authMethod = mode === "signin" ? signIn : signUp;
      
      if (!authMethod) {
        throw new Error("Authentication method not available");
      }

      // Initiate OAuth flow
      await authMethod.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to sign ${mode === "signin" ? "in" : "up"} with ${provider}. Please try again.`,
        variant: "destructive",
      });
      
      setIsLoading(null);
    }
  };

  const actionText = mode === "signin" ? "Sign in" : "Sign up";

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative group hover:bg-accent transition-colors"
        onClick={() => handleSocialLogin("oauth_google")}
        disabled={isLoading !== null}
      >
        <Chrome className="mr-2 h-5 w-5 text-[#4285F4]" />
        <span className="font-medium">
          {isLoading === "oauth_google" ? "Connecting..." : `${actionText} with Google`}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative group hover:bg-accent transition-colors"
        onClick={() => handleSocialLogin("oauth_apple")}
        disabled={isLoading !== null}
      >
        <Apple className="mr-2 h-5 w-5" />
        <span className="font-medium">
          {isLoading === "oauth_apple" ? "Connecting..." : `${actionText} with Apple`}
        </span>
      </Button>
    </div>
  );
}
