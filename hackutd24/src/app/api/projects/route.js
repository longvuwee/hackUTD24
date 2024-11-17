import { NextResponse } from "next/server";
import { initDb } from "../../../../utils/db";
import { createProject } from "../../../../utils/projects";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await initDb();
    const result = await db.query(
      "SELECT * FROM projects WHERE owner_id = $1 OR id IN (SELECT project_id FROM collaborators WHERE user_id = $1)",
      [userId],
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    const db = await initDb();
    const body = await request.json();

    const project = await createProject(db, {
      ...body,
      ownerId: userId,
      ownerName: user.firstName, // Store additional user info if needed
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Project creation failed:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
