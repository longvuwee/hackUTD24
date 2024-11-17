import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "./ui/Card";
import { Download, Trash2, Settings } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export function ModelList({ projectId }) {
  const [models, setModels] = useState(initialModels || []);
  const { userId } = useAuth();

  const handleDownload = async (modelCID, configCID, name) => {
    try {
      const modelResponse = await fetch(`/api/files/${modelCID}`);
      const modelBlob = await modelResponse.blob();
      const modelUrl = URL.createObjectURL(modelBlob);
      const modelLink = document.createElement("a");
      modelLink.href = modelUrl;
      modelLink.download = `${name}.model`;
      modelLink.click();

      const configResponse = await fetch(`/api/files/${configCID}`);
      const configBlob = await configResponse.blob();
      const configUrl = window.URL.createObjectURL(configBlob);
      const configLink = document.createElement("a");

      configLink.href = configUrl;
      configLink.download = `${name}.config`;
      configLink.click();
    } catch (error) {
      console.error("Download Failed");
      alert("Failed to download model");
    }
  };

  const handleDelete = async (modelId) => {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const response = await fetch(`api/projects/${projectId}/models/${modelId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete model");

      setModels(models.filter((model) => model.id !== modelId));
    } catch (error) {
      console.error("Delete Failed: ", error);
      alert("Failed to delete model");
    }
  };
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Card key={model.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.description}</p>
              </div>
              {model.createdBy === userId && (
                <button
                  onClick={() => handleDelete(model.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                  {model.framework}
                </span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  v{model.version}
                </span>
              </div>

              {model.metrics && Object.entries(model.metrics).length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(model.metrics).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span>{" "}
                      {typeof value === "number" ? value.toFixed(4) : value}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    handleDownload(model.modelCID, model.configCID, model.name)
                  }
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                {model.createdBy === userId && (
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
