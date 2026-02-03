import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Product Inventory Tracker",
  description:
    "Technical Interview Challenge - Product Inventory Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents errors from browser extensions modifying the body */}
      <body suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:outline-none"
            >
              Skip to main content
            </a>

            <Navigation />

            <main
              id="main-content"
              className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
              role="main"
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
