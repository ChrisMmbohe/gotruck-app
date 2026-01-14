import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, BarChart3, MapPin, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8" />
            <span className="text-2xl font-bold">GoTruck</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            EAC Freight Logistics Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Real-time tracking, predictive analytics, and seamless cross-border freight management
            for Kenya, Uganda, Tanzania, and beyond.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">View Dashboard</Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features for EAC Logistics
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border">
                <MapPin className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Real-Time GPS Tracking</h3>
                <p className="text-muted-foreground">
                  Track your fleet across EAC borders with live location updates and route optimization.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <BarChart3 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  AI-powered insights for fuel efficiency, route planning, and maintenance scheduling.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Multi-Currency Support</h3>
                <p className="text-muted-foreground">
                  Handle transactions in KES, UGX, TZS with integrated Stripe payments.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 GoTruck. All rights reserved. Built for the East African Community.</p>
        </div>
      </footer>
    </div>
  );
}
