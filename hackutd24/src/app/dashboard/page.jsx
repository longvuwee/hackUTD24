import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProjectList from "@/components/ProjectList";

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
      </div>
      <ProjectList />
    </div>
  );
}
