"use client";

import { Montserrat } from 'next/font/google';
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const mont = Montserrat({ subsets: ['latin'],});

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    // Redirect to dashboard
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return null; // Avoid rendering
  }

  return (
    <div className={`${mont.className} min-h-screen bg-custom-background text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-6 flex justify-between items-center">
        </nav>

        <main className="py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold">
              Manage Your ML Models
            </h1>
            <p className="mt-6 text-lg max-w-3xl mx-auto">
              A simple and efficient way to store, version, and share your machine
              learning models. Built with Pinata IPFS for reliable and decentralized
              storage.
            </p>
            <div className="mt-10">
              <Link
                href="/sign-in"
                className="bg-custom-purple rounded-lg font-bold text-[25px] shadow-[0px_4px_20px_0px_#7A2DCB] shadow-custom-purple text-white px-4 py-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
