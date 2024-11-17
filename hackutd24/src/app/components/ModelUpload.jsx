import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function ModelUpload({ projectId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const { userId } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("model", event.target.model.files[0]);
      formData.append("config", event.target.config.files[0]);
      formData.append(
        "metadata",
        JSON.stringify({
          name: event.target.name.value,
          description: event.target.description.value,
          version: event.target.version.value,
          framework: event.target.framework.value,
        }),
      );

      const response = await fetch(`/api/projects/${projectId}/models`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const data = await response.json();
      onUploadComplete?.(data);
      event.target.reset();
    } catch (error) {
      console.error("Upload Failed");
      alert("Failed to upload model");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Model Name</label>
        <input type="text" name="name" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea name="description" className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Version</label>
        <input
          type="text"
          name="version"
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Framework</label>
        <select name="framework" required className="w-full border p-2 rounded">
          <option value="pytorch">PyTorch</option>
          <option value="tensorflow">TensorFlow</option>
          <option value="sklearn">scikit-learn</option>
        </select>
      </div>

      <div>
        <label className="block">Model File</label>
        <input type="file" name="model" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Config File</label>
        <input type="file" name="config" required className="w-full border p-2 rounded" />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50
        ${uploading ? 'cursor-not-allowed' : 'hover:bg-blue-600'}"
      >
        {uploading ? "Uploading..." : "Upload Model"}
      </button>
    </form>
  );
}
