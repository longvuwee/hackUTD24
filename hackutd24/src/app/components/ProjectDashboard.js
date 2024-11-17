import { useState, useEffect } from "react";
import { ModelUpload } from "./ModelUpload";
import { ModelList } from "./ModelList";
import { Upload, Database, Plus } from "lucide-react";

export function ProjectDashboard({ projectId }) {
  const [project, setProject] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Failed fetching project", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  const handleUploadComplete = (newModel) => {
    setProject((prev) => ({ ...prev, models: [...prev.models, newModel] }));
    setShowUpload(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin">
          <Database className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showUpload ? (
            <>
              <Upload className="w-4 h-4" />
              Close Upload
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Upload Model
            </>
          )}
        </button>
      </div>

      {showUpload && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <ModelUpload projectId={projectId} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      <ModelList projectId={projectId} models={project.models} />
    </div>
  );
}
