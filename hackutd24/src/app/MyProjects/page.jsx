"use client";
import { ProjectList } from "../components/ProjectList";

export default function MyProjects() {
  const { userId } = auth();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to ML Model Manager</h1>
        <p className="mb-4">Please sign in to continue</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Projects</h1>
      <ProjectList />
    </div>
  );
}
