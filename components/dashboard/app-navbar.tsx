"use client";

import { useState, useEffect } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Bell, Search, User, ChevronDown, Settings, LogOut, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserPreferences {
  language: 'en' | 'sw' | 'fr';
  currency: 'KES' | 'UGX' | 'TZS';
}

interface UserData {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  role: "admin" | "driver" | "shipper";
  organizationId: string | null;
  companyName: string | null;
  phoneNumber: string | null;
  preferences?: UserPreferences;
}

/**
 * App-wide Navbar - Consistent across all authenticated pages
 * Includes: Logo, Search, Notifications, User Menu
 */
export function AppNavbar() {
  const { setPreferences } = usePreferences();
  const { setCurrency } = useCurrency();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser(); // Get Clerk user directly
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Effect: When userData.preferences changes, update global providers
  useEffect(() => {
    if (userData?.preferences) {
      setPreferences(userData.preferences);
      if (userData.preferences.currency) {
        setCurrency(userData.preferences.currency);
      }
    }
  }, [userData?.preferences, setPreferences, setCurrency]);

  // Fetch user data from database on mount, fallback to Clerk data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoadingUser(true);
        const response = await fetch('/api/users/me');
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Fallback to Clerk user data if API fails
          if (clerkUser) {
            console.warn('API failed, using Clerk user data as fallback');
            const fallbackData: UserData = {
              id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
              firstName: clerkUser.firstName || '',
              lastName: clerkUser.lastName || '',
              imageUrl: clerkUser.imageUrl || null,
              role: (clerkUser.publicMetadata?.role as "admin" | "driver" | "shipper") || 'shipper',
              organizationId: (clerkUser.publicMetadata?.organizationId as string) || null,
              companyName: (clerkUser.publicMetadata?.companyName as string) || null,
              phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
              preferences: {
                language: (clerkUser.publicMetadata?.language as 'en' | 'sw' | 'fr') || 'en',
                currency: (clerkUser.publicMetadata?.currency as 'KES' | 'UGX' | 'TZS') || 'KES',
              },
            };
            setUserData(fallbackData);
          } else {
            console.error('Failed to fetch user data and no Clerk user available');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to Clerk user data on error
        if (clerkUser) {
          const fallbackData: UserData = {
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            imageUrl: clerkUser.imageUrl || null,
            role: (clerkUser.publicMetadata?.role as "admin" | "driver" | "shipper") || 'shipper',
            organizationId: (clerkUser.publicMetadata?.organizationId as string) || null,
            companyName: (clerkUser.publicMetadata?.companyName as string) || null,
            phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
            preferences: {
              language: (clerkUser.publicMetadata?.language as 'en' | 'sw' | 'fr') || 'en',
              currency: (clerkUser.publicMetadata?.currency as 'KES' | 'UGX' | 'TZS') || 'KES',
            },
          };
          setUserData(fallbackData);
        }
        // Example: Show preferences in user menu (optional, for debug)
        // You can add this to the dropdown or UI as needed:
        // <div>Language: {userData?.preferences?.language}</div>
        // <div>Currency: {userData?.preferences?.currency}</div>
      } finally {
        setIsLoadingUser(false);
      }
    }

    // Only fetch if clerkUser is available
    if (clerkUser) {
      fetchUserData();
    } else {
      setIsLoadingUser(false);
    }
  }, [clerkUser]);

  // Handle signout
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setUserMenuOpen(false);
      
      // Call our API endpoint first
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      // Then sign out from Clerk (final signout, no redirect)
      await signOut({ redirectUrl: '/' });
      
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return "U";
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    }
    return userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "U";
  };

  const notifications = [
    { id: 1, title: "Shipment Delivered", message: "SH-3421 arrived on time", time: "2m ago", unread: true },
    { id: 2, title: "Maintenance Alert", message: "Truck UAZ-102 service due", time: "1h ago", unread: true },
    { id: 3, title: "Border Crossing", message: "KBZ-421 cleared at Malaba", time: "3h ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/images/2-rmvbg2.png"
            alt="GoTruck Logo"
            className="w-10 h-10 object-contain rounded-md shadow-sm"
          />
        </Link>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shipments, vehicles, or routes..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Icon (Mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fade-in">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <Badge variant="info" className="text-xs">{unreadCount} new</Badge>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors",
                          notification.unread && "bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-sm text-blue-600 hover:text-blue-700">
                      View all notifications
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3"
              disabled={isLoadingUser}
            >
              {isLoadingUser ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              ) : userData?.imageUrl ? (
                <img 
                  src={userData.imageUrl} 
                  alt={userData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold">
                  {getUserInitials()}
                </div>
              )}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900">
                  {isLoadingUser ? "Loading..." : userData?.name || "User"}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {isLoadingUser ? "" : userData?.role || "User"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
            </Button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fade-in">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      {userData?.imageUrl ? (
                        <img 
                          src={userData.imageUrl} 
                          alt={userData.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-semibold">
                          {getUserInitials()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{userData?.name || "User"}</p>
                        <p className="text-sm text-slate-500">{userData?.email || ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {/* User Preferences */}
                    {userData?.preferences && (
                      <div className="px-3 py-2 mb-2 rounded-md bg-slate-50 border border-slate-100 flex flex-col gap-1 text-xs text-slate-600">
                        <span>Language: <span className="font-medium text-slate-900">{userData.preferences.language?.toUpperCase()}</span></span>
                        <span>Currency: <span className="font-medium text-slate-900">{userData.preferences.currency}</span></span>
                      </div>
                    )}
                    <Link
                      href="/dashboard/settings/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Your Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Settings</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Help & Support</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t">
                    <button
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? (
                        <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-red-600">
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
