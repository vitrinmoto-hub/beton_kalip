import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beton Kalıp Firması - Kaliteli ve Dayanıklı Kalıp Çözümleri",
  description: "Bahçe duvarı, mezar, çeşme ve özel tasarım beton kalıpları üreten lider firma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ConditionalLayout header={<Header />} footer={<Footer />}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

