import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bloodline DNA - Xét Nghiệm ADN Huyết Thống",
    template: "%s | Bloodline DNA",
  },
  description:
    "Dịch vụ xét nghiệm ADN huyết thống chính xác 99.99%. Kết quả nhanh chóng, bảo mật tuyệt đối, hỗ trợ 24/7.",
  keywords: [
    "xét nghiệm ADN",
    "ADN huyết thống",
    "xác định quan hệ cha con",
    "DNA test",
    "xét nghiệm gen",
    "bloodline DNA",
  ],
  authors: [{ name: "Bloodline DNA Team" }],
  creator: "Bloodline DNA",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bloodline-dna.com",
    siteName: "Bloodline DNA",
    title: "Bloodline DNA - Xét Nghiệm ADN Huyết Thống",
    description:
      "Dịch vụ xét nghiệm ADN huyết thống chính xác 99.99%. Kết quả nhanh chóng, bảo mật tuyệt đối.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bloodline DNA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloodline DNA - Xét Nghiệm ADN Huyết Thống",
    description:
      "Dịch vụ xét nghiệm ADN huyết thống chính xác 99.99%. Kết quả nhanh chóng, bảo mật tuyệt đối.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${roboto.variable}`}>
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
