/**
 * Session Management Utilities
 * Handles session state, timeouts, and persistence
 */

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Session timeout configuration (in milliseconds)
 */
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING = 5 * 60 * 1000; // Show warning 5 minutes before timeout

/**
 * Hook for session management and activity tracking
 */
export function useSessionManagement() {
  const { isSignedIn, signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TIMEOUT);

  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;

    let lastActivity = Date.now();
    let warningTimer: NodeJS.Timeout;
    let logoutTimer: NodeJS.Timeout;

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const resetTimers = () => {
      lastActivity = Date.now();
      setShowWarning(false);
      setTimeRemaining(SESSION_TIMEOUT);

      // Clear existing timers
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      // Set warning timer
      warningTimer = setTimeout(() => {
        setShowWarning(true);
      }, SESSION_TIMEOUT - SESSION_WARNING);

      // Set logout timer
      logoutTimer = setTimeout(async () => {
        await signOut();
        router.push('/sign-in?timeout=true');
      }, SESSION_TIMEOUT);
    };

    // Initialize timers
    resetTimers();

    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimers);
    });

    // Update countdown when warning is shown
    const countdownInterval = setInterval(() => {
      if (showWarning) {
        const remaining = SESSION_TIMEOUT - (Date.now() - lastActivity);
        setTimeRemaining(Math.max(0, remaining));
      }
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimers);
      });
    };
  }, [isSignedIn, isLoaded, signOut, router, showWarning]);

  const extendSession = () => {
    setShowWarning(false);
    setTimeRemaining(SESSION_TIMEOUT);
  };

  return {
    isSignedIn,
    user,
    isLoaded,
    showWarning,
    timeRemaining,
    extendSession,
  };
}

/**
 * Hook for loading states during authentication
 */
export function useAuthLoading() {
  const { isLoaded: isAuthLoaded } = useAuth();
  const { isLoaded: isUserLoaded } = useUser();

  return {
    isLoading: !isAuthLoaded || !isUserLoaded,
    isAuthLoaded,
    isUserLoaded,
  };
}

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Check if user session is still valid
 */
export async function validateSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/validate-session', {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

/**
 * Refresh user session
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh-session', {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Session refresh error:', error);
    return false;
  }
}
