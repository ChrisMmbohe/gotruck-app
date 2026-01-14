"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Truck, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

/**
 * Footer - Inspired by comprehensive footers from Flexport and CargoWise
 * Includes sitemap, contact info, and regional offices
 */
export function Footer() {
  const t = useTranslations("footer");

  const solutions = [
    { name: t("solutions.tracking"), href: "/solutions/tracking" },
    { name: t("solutions.fleet"), href: "/solutions/fleet" },
    { name: t("solutions.analytics"), href: "/solutions/analytics" },
    { name: t("solutions.compliance"), href: "/solutions/compliance" },
  ];

  const company = [
    { name: t("company.about"), href: "/about" },
    { name: t("company.careers"), href: "/careers" },
    { name: t("company.press"), href: "/press" },
    { name: t("company.partners"), href: "/partners" },
  ];

  const resources = [
    { name: t("resources.blog"), href: "/blog" },
    { name: t("resources.guides"), href: "/guides" },
    { name: t("resources.api"), href: "/api-docs" },
    { name: t("resources.support"), href: "/support" },
  ];

  const legal = [
    { name: t("legal.privacy"), href: "/privacy" },
    { name: t("legal.terms"), href: "/terms" },
    { name: t("legal.security"), href: "/security" },
  ];

  const offices = [
    { city: t("offices.nairobi"), country: "Kenya", flag: "🇰🇪" },
    { city: t("offices.kampala"), country: "Uganda", flag: "🇺🇬" },
    { city: t("offices.daressalaam"), country: "Tanzania", flag: "🇹🇿" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">GoTruck</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t("tagline")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:info@gotruck.app" className="hover:text-white transition-colors">
                  info@gotruck.app
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+254700000000" className="hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-bold mb-4">{t("sections.solutions")}</h3>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">{t("sections.company")}</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">{t("sections.resources")}</h3>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">{t("sections.legal")}</h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regional Offices */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-white font-bold mb-4">{t("regionalOffices")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offices.map((office, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                <span className="text-3xl">{office.flag}</span>
                <div>
                  <div className="text-white font-semibold">{office.city}</div>
                  <div className="text-sm text-gray-400">{office.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} GoTruck. {t("copyright")}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors group"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
