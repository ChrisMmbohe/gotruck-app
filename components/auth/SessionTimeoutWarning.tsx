/**
 * Session Timeout Warning Component
 * Displays a modal when session is about to expire
 */

"use client";

import { useEffect } from "react";
import {
  useSessionManagement,
  formatTimeRemaining,
} from "@/lib/auth/session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

export function SessionTimeoutWarning() {
  const { showWarning, timeRemaining, extendSession } = useSessionManagement();

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-6 w-6" />
            <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2 pt-4">
            <p>
              Your session will expire in{" "}
              <span className="font-bold text-foreground">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </p>
            <p className="text-sm">
              Click below to continue your session or you'll be automatically
              signed out.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={extendSession}
            className="w-full sm:w-auto"
          >
            Continue Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
