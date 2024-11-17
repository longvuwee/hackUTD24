"use client";
import { useState } from "react";

export default function UploadForm({ endpoint }) {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`/api/${endpoint}`, { method: "POST", body: formData });
      alert(`${endpoint} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit">Upload {endpoint}</button>
    </form>
  );
}
