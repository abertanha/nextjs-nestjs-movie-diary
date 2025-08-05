import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/auth/AuthProvider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
});

export const metadata: Metadata = {
  title: "Movie's Diary",
  description: "A modern and personal movie's diary",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  if(!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}  className={`${libreBaskerville.variable}`}>
      <body className= 'font-sans bg-gray-950'>
        
        <NextIntlClientProvider>
          <div className="absolute top-4 left -4 z-50">
            <LanguageSwitcher />
          </div>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
