/**
 * Complete Step - Final step with success message
 */

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { UserRole } from "@/lib/auth/roles";

interface CompleteStepProps {
  data: any;
  onChange: (data: any) => void;
  onComplete: () => void;
}

export function CompleteStep({ data, onComplete }: CompleteStepProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useUser();

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
  };

  // Determine user role
  const userRole: UserRole = (data.role || (user?.publicMetadata?.role as UserRole)) || UserRole.SHIPPER;

  // Role-specific portal names
  const portalNames: Record<UserRole, string> = {
    [UserRole.DRIVER]: "Driver Portal",
    [UserRole.SHIPPER]: "Shipper Dashboard",
    [UserRole.ADMIN]: "Admin Portal",
  };

  return (
    <div className="space-y-6 text-center py-8">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scale-in">
        <CheckCircle2 className="h-12 w-12 text-white" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-3xl font-bold">You're All Set!</h2>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your account has been configured successfully. Let's get you started with GoTruck!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 max-w-2xl mx-auto">
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-3xl mb-2">📦</div>
          <div className="font-semibold mb-1">Manage Shipments</div>
          <div className="text-sm text-muted-foreground">
            Track and manage your deliveries
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-3xl mb-2">🗺️</div>
          <div className="font-semibold mb-1">Real-Time GPS</div>
          <div className="text-sm text-muted-foreground">
            Monitor routes and locations
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-semibold mb-1">Analytics</div>
          <div className="text-sm text-muted-foreground">
            View insights and reports
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-blue-800">
          <strong>Next steps:</strong> You'll be redirected to your {portalNames[userRole]} where you can start managing your operations.
        </p>
      </div>

      <Button
        onClick={handleComplete}
        disabled={isCompleting}
        size="lg"
        className="min-w-[200px] mt-6"
      >
        {isCompleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up...
          </>
        ) : (
          `Go to ${portalNames[userRole]}`
        )}
      </Button>
    </div>
  );
}
