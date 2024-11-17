import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

<<<<<<< Updated upstream
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
=======
import { useState } from "react";
import { useUser } from "@clerk/nextjs"; //import clerk user hook
import { pinata } from "../../utils/config";

export default function Home() {
  const { user } = useUser(); // get user information
  //const { signOut } = useClerk(); //get the signout funtion
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_SIZE = 100 * 1024 * 1024 * 1024; // 100GB limit
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"]; //allowed image types

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrorMessage("File is too large. Maximum size is 100GB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a valid file type");
      return;
    }

    try {
      setUploading(true);
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT);
      const urlRequest = await fetch("/api/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid: upload.cid }),
      });
      const url = await urlRequest.json();
      setUrl(url);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user ? user.firstName : "User "}!
      </h1>
      <p className="mb-4">
        You are logged in. Use the form below to upload files.
      </p>
      <input type="file" onChange={handleChange} />
      <button
        type="button"
        disabled={uploading}
        onClick={uploadFile}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {url && (
        <img src={url} alt="Image from Pinata" className="mt-4 max-w-xs" />
      )}
    </main>
>>>>>>> Stashed changes
  );
}
