import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardHeader, CardContent } from "./ui/Card";

export function ProjectList() {
  const { userId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  if (loading) return <div>Loading Projects...</div>;
  if (error) return <div>Error loading projects: {error}</div>;

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                {project.visibility}
              </span>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {project.models.length} models
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
