import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC, Space_Mono } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "陈宇滑动变阻器",
  description: "在陈泽与宇大将军、男性与女性、婴儿与老人之间连续校准。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
