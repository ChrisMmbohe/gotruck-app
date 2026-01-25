/**
 * SSO Callback Page
 * Handles OAuth redirect after social login
 */

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Completing sign in...</h2>
          <p className="text-muted-foreground mt-2">
            Please wait while we finalize your authentication
          </p>
        </div>
      </div>
      
      {/* Clerk handles the OAuth callback */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
