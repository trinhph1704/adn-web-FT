import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/providers/AntdProvider";
import ChatbotAI from "@/components/chatbot/ChatbotAI";
import { BookingModalProvider } from "@/components/customer/BookingModalProvider";

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
    default: "ADN Huyết Thống - Xét nghiệm ADN chuyên nghiệp",
    template: "%s | ADN Huyết Thống",
  },
  description:
    "Nền tảng xét nghiệm ADN huyết thống chuyên nghiệp, bảo mật và nhanh chóng. Xác định quan hệ gia đình với độ chính xác 99.99%.",
  keywords: [
    "xét nghiệm ADN",
    "ADN huyết thống",
    "xét nghiệm cha con",
    "xét nghiệm pháp lý",
    "ADN Huyết Thống",
    "quan hệ huyết thống",
  ],
  authors: [{ name: "ADN Huyết Thống" }],
  creator: "ADN Huyết Thống",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bloodlinedna.vn",
    siteName: "ADN Huyết Thống",
    title: "ADN Huyết Thống - Xét nghiệm ADN chuyên nghiệp",
    description:
      "Nền tảng xét nghiệm ADN huyết thống chuyên nghiệp, bảo mật và nhanh chóng – đồng hành cùng bạn trong hành trình xác định quan hệ gia đình.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ADN Huyết Thống",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADN Huyết Thống - Xét nghiệm ADN chuyên nghiệp",
    description:
      "Nền tảng xét nghiệm ADN huyết thống chuyên nghiệp, bảo mật và nhanh chóng.",
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
        <AntdProvider>
          <BookingModalProvider>
            {children}
            <ChatbotAI />
          </BookingModalProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
