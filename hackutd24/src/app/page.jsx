import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default function LandingPage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-6 flex justify-between items-center">
          <div className="text-xl font-bold">ML Model Manager</div>
          {userId ? (
            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}
        </nav>

        <main className="py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Manage Your ML Models
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              A simple and efficient way to store, version, and share your machine
              learning models. Built with Pinata IPFS for reliable and decentralized
              storage.
            </p>
            <div className="mt-10">
              {userId ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
