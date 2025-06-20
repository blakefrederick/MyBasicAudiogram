import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyBasicAudiogram - Hearing Test App",
  description: "A web app to track your hearing thresholds over time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 mb-2 sm:mb-0">
              MyBasicAudiogram
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/test" className="text-gray-600 hover:text-blue-600">
                Take Test
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-blue-600">
                History
              </Link>
            </nav>
          </div>
        </header>
        <main className="py-6">
          {children}
        </main>
        <footer className="mt-12 py-6 bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>MyBasicAudiogram &copy; {new Date().getFullYear()} - Not a medical device</p>
            <p className="mt-1">Always consult a healthcare professional for hearing concerns</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
