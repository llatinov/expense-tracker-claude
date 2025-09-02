import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import Layout from "@/components/Layout/Layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpenseTracker - Personal Finance Management",
  description: "A modern, professional expense tracking application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ExpenseProvider>
          <Layout>
            {children}
          </Layout>
        </ExpenseProvider>
      </body>
    </html>
  );
}
