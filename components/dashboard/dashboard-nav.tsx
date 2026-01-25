"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, permission: "VIEW_DASHBOARD" },
  { href: "/dashboard/tracking", label: "Tracking", icon: MapPin, permission: "VIEW_TRACKING" },
  { href: "/dashboard/fleet", label: "Fleet", icon: Truck, permission: "VIEW_FLEET" },
  { href: "/dashboard/shipments", label: "Shipments", icon: Package, permission: "VIEW_SHIPMENT" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, permission: "VIEW_ANALYTICS" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, permission: "VIEW_SETTINGS" },
];

/**
 * Dashboard Sidebar - Role-based navigation with MongoDB-style behavior
 * - Collapsed by default (icon-only)
 * - Auto-expands on hover
 * - Shows only accessible routes based on user role
 * - Smooth transitions
 */
export function DashboardNav() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { hasPermission, isLoaded } = usePermissions();

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter(item => 
    item.permission ? hasPermission(item.permission as any) : true
  );

  if (!isLoaded) {
    return (
      <aside className="h-[calc(100vh-4rem)] w-16 bg-slate-900 border-r border-slate-800">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] bg-slate-900 text-white transition-all duration-300 border-r border-slate-800 group",
        isHovered ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 pt-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  !isHovered && "justify-center"
                )}
                title={!isHovered ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-all duration-300",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Indicator */}
        <div className="p-4 border-t border-slate-800">
          <div
            className={cn(
              "flex items-center gap-3 text-xs text-slate-500 transition-all duration-300",
              !isHovered && "justify-center"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {isHovered && <span>System Online</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}
