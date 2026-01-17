"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: January 15, 2026
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-accent/50 rounded-lg border border-border">
            <Lock className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">256-bit SSL</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade encryption</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg border border-border">
            <Database className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">SOC 2 Certified</h3>
            <p className="text-sm text-muted-foreground">Industry compliance</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg border border-border">
            <Globe className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">GDPR Compliant</h3>
            <p className="text-sm text-muted-foreground">International standards</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              GoTruck EAC Freight Logistics Platform ("we," "our," or "us") is committed to protecting 
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Company name and business information</li>
                  <li>Payment information and billing details</li>
                  <li>Driver's license information (for driver accounts)</li>
                  <li>Profile photos and identification documents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Usage Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>GPS location data (for tracking services)</li>
                  <li>Shipment and delivery information</li>
                  <li>Platform usage patterns and interactions</li>
                  <li>Device information and IP addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Log files and analytics data</li>
                  <li>Browser type and operating system</li>
                  <li>Referring URLs and exit pages</li>
                  <li>Date and time stamps of activities</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Service Delivery:</strong> To provide and maintain our logistics platform</li>
              <li><strong>GPS Tracking:</strong> To enable real-time shipment tracking and route optimization</li>
              <li><strong>Payment Processing:</strong> To process transactions and manage billing</li>
              <li><strong>Communication:</strong> To send notifications, updates, and support messages</li>
              <li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
              <li><strong>Compliance:</strong> To comply with legal obligations and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We may share your information in the following circumstances:
              </p>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.1 With Service Providers:</strong> We share data with trusted third-party 
                  service providers who assist in operating our platform (payment processors, cloud 
                  hosting, analytics).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.2 Between Users:</strong> Shippers and drivers can see necessary information 
                  to facilitate deliveries (contact details, location, shipment information).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.3 For Legal Compliance:</strong> When required by law, court order, or 
                  government regulation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.4 Business Transfers:</strong> In connection with mergers, acquisitions, 
                  or sale of assets.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.5 With Your Consent:</strong> When you explicitly authorize us to share 
                  your information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement robust security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Encryption:</strong> 256-bit SSL/TLS encryption for data in transit</li>
              <li><strong>Access Control:</strong> Role-based access with multi-factor authentication</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
              <li><strong>Compliance:</strong> SOC 2 Type II certification and GDPR compliance</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and penetration testing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Objection:</strong> Object to certain types of data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. GPS and Location Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              For driver accounts, we collect real-time GPS location data to enable shipment tracking. 
              This data is essential for our service and is shared with shippers tracking their deliveries. 
              Location tracking can be disabled in account settings, but this will limit platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance user experience, analyze usage, and 
              deliver personalized content. You can control cookie preferences through your browser settings. 
              Essential cookies required for platform operation cannot be disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide services and comply 
              with legal obligations. Shipment records are retained for 7 years per EAC regulatory requirements. 
              Account data is retained for 90 days after account deletion unless longer retention is legally required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data may be transferred and processed in countries outside the East African Community. 
              We ensure appropriate safeguards are in place, including standard contractual clauses and 
              adequacy decisions where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              GoTruck is not intended for users under the age of 18. We do not knowingly collect personal 
              information from children. If we become aware of such collection, we will delete the 
              information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically. Significant changes will be communicated via 
              email or platform notification. The "Last Updated" date at the top indicates when the policy 
              was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about this Privacy Policy or to exercise your privacy rights, contact us at:
            </p>
            <div className="mt-4 p-6 bg-accent/50 rounded-lg border border-border">
              <p className="text-foreground mb-2"><strong>Data Protection Officer:</strong></p>
              <p className="text-foreground"><strong>Email:</strong> privacy@gotruck.com</p>
              <p className="text-foreground"><strong>Phone:</strong> +254 700 000 000</p>
              <p className="text-foreground"><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p>Your privacy and data security are our top priorities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
