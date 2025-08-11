import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hapik Climbing Timer",
  description: "Track climbing times for camp students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ 
        fontFamily: inter.className, 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh' 
      }}>
        {/* Main app container */}
        <div style={{ 
          maxWidth: '448px', 
          margin: '0 auto', 
          backgroundColor: 'white', 
          minHeight: '100vh', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
