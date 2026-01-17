"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/sign-up`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign Up
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: January 15, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to GoTruck EAC Freight Logistics Platform ("we," "our," or "us"). 
              By accessing or using our platform, you agree to be bound by these Terms of Service. 
              If you do not agree with any part of these terms, you may not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account and using the GoTruck platform, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>3.1 Account Creation:</strong> You must provide accurate, current, and complete 
                information during the registration process. You are responsible for maintaining the 
                confidentiality of your account credentials.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>3.2 Account Types:</strong> GoTruck offers three account types: Driver, Shipper, 
                and Administrator. Each account type has different permissions and responsibilities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>3.3 Account Security:</strong> You are responsible for all activities that occur 
                under your account. Notify us immediately of any unauthorized use.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                As a user of GoTruck, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate shipment and delivery information</li>
                <li>Comply with all applicable laws and regulations in EAC countries</li>
                <li>Respect the intellectual property rights of GoTruck and other users</li>
                <li>Not use the platform for illegal activities or fraudulent purposes</li>
                <li>Maintain valid licenses and permits required for freight operations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Platform Services</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>5.1 Service Availability:</strong> We strive to provide 24/7 platform access but 
                do not guarantee uninterrupted service. Maintenance and updates may cause temporary disruptions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>5.2 GPS Tracking:</strong> Real-time tracking features require active GPS and 
                internet connectivity. Accuracy may vary based on network conditions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>5.3 Payment Processing:</strong> All payments are processed securely through our 
                payment partners. We support KES, UGX, and TZS currencies.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Fees and Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              GoTruck charges service fees for platform usage. Fees vary by account type and usage volume. 
              All fees are listed in your account dashboard. Payment is due according to the billing cycle 
              selected during account setup.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Protection and Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take data protection seriously. All user data is protected according to our Privacy Policy 
              and applicable data protection regulations, including GDPR where applicable. We implement 
              industry-standard security measures including 256-bit SSL encryption and SOC 2 compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              GoTruck provides a platform connecting shippers and drivers. We are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Lost, damaged, or stolen cargo</li>
              <li>Delays caused by traffic, weather, or border crossings</li>
              <li>Actions or omissions of drivers or shippers</li>
              <li>Force majeure events beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms of Service. 
              Users may also terminate their accounts at any time through account settings. Upon termination, 
              certain data may be retained for legal and operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by the laws of the East African Community and the 
              jurisdiction where GoTruck is registered. Any disputes shall be resolved through arbitration 
              in accordance with EAC arbitration procedures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. Users will be notified of significant 
              changes via email or platform notification. Continued use of the platform after changes 
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-accent/50 rounded-lg">
              <p className="text-foreground"><strong>Email:</strong> legal@gotruck.com</p>
              <p className="text-foreground"><strong>Phone:</strong> +254 700 000 000</p>
              <p className="text-foreground"><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            By using GoTruck, you acknowledge that you have read and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
