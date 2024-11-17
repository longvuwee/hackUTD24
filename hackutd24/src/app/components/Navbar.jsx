import {
  AiOutlineBars
} from "react-icons/ai";

export default function Navbar(){
  return <>
                    {/* Sidebar Navigation */}
                    <nav
            className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-md z-50 transition-all duration-300 ${
              isNavOpen ? "w-64" : "w-20"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h1
                  className={`text-xl font-bold overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    isNavOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Link href="/">WebsiteName</Link>
                </h1>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                >
                  <AiOutlineBars className="w-10 h-10" />
                </button>
              </div>
              {/* Navigation Links */}

              <ul className="flex-grow flex flex-col items-start p-4 space-y-4">
                <SignedOut className="">
                  <li className="flex items-center">
                    <SignInButton />
                  </li>
                </SignedOut>
                <SignedIn>
                  <li className="flex items-center ">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-10 h-10", // Adjust the width and height
                        },
                      }}
                    />
                  </li>
                </SignedIn>
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-blue-500"
                  >
                  
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-xl ${
                        isNavOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Home
                    </span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/about"
                    className="flex items-center space-x-2 hover:text-blue-500"
                  >
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-xl ${
                        isNavOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      About
                    </span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/services"
                    className="flex items-center space-x-2 hover:text-blue-500"
                  >
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-xl ${
                        isNavOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Services
                    </span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/contact"
                    className="flex items-center space-x-2 hover:text-blue-500"
                  >
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-xl ${
                        isNavOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Contact
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
  </>
}
