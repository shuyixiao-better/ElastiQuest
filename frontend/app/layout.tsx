import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/AntdProvider";
import Navbar from "@/components/Layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElastiQuest - 游戏化学习 Elasticsearch",
  description: "通过游戏化方式学习 Elasticsearch CRUD 操作",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <AntdProvider>
          <div style={{
            minHeight: '100vh',
            background: 'rgba(255, 255, 255, 0.95)',
          }}>
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}
