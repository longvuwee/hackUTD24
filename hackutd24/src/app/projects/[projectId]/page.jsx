import { auth } from "@clerk/nextjs";
import { ProjectDashboard } from "../../components/ProjectDashboard";

export default function ProjectPage({ params }) {
  const { userId } = auth();

  if (!userId) {
    return null; // Clerk will handle redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProjectDashboard projectId={params.projectId} />
    </div>
  );
}
