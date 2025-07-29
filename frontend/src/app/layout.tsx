import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import BackgroundSetter from "@/components/BackgroundSetter";

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
});

export const metadata: Metadata = {
  title: "Diário de cinéfilo",
  description: "entrega para matéria de PWEB",
};

const backgroundImages = [
  '/backgrounds/cena.jpg', 
  '/backgrounds/cena1.jpg', 
  '/backgrounds/cena2.jpeg', 
  '/backgrounds/cena3.jpg', 
  '/backgrounds/cena4.jpg', 
  '/backgrounds/cena5.jpg', 
  '/backgrounds/cena6.jpg',
  '/backgrounds/cena7.jpg',
  '/backgrounds/cena8.jpg',
  '/backgrounds/cena9.png',
  '/backgrounds/cena10.jpg',
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${libreBaskerville.variable}`}>
      <body className= 'font-sans'>
        <BackgroundSetter images={backgroundImages}/>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
