"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Link from "next/link";
import {
  AiOutlineBars,
} from "react-icons/ai";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false); 

  return (
    <>
    <div>
      <h1 className="text-2xl font-bold">Your Projects</h1>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </div>
    </>
  );
}
