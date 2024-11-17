"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isSignInPage, setIsSignInPage] = useState(false);

  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Main Content */}
          <main className={`flex-grow transition-margin duration-300`}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}