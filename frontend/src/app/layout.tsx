import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/auth/AuthProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${libreBaskerville.variable}`}>
      <body className= 'font-sans bg-gray-950'>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
