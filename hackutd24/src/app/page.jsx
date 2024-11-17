"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  const { user } = useAuth(); // Get user ID and user details from Clerk's auth

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        {user && (
          <p className="text-lg mb-6">
            Hello, {user.firstName} {user.lastName}!
          </p>
        )}
        <p className="text-lg mb-6">
          You can manage your ML models from your dashboard.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
