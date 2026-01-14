import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "./routing";

// Supported locales
export const locales = ["en", "sw", "fr"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the request locale
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = "en"; // Default to English if invalid
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
