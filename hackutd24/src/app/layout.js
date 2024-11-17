import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav>
            <ul className="navbar">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <SignedOut>
                <li>
                  <SignInButton />
                </li>
              </SignedOut>
              <SignedIn>
                <li>
                  <User Button />
                </li>
              </SignedIn>
            </ul>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
