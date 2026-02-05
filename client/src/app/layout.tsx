import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import AuthProvider from '@/components/AuthProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "Trace - AI Documentation",
  description: "Create engaging documentation in notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
