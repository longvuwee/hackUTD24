import { NextResponse } from "next/server";
import { initDb } from "../../../../../../utils/db";
import { addModelToProject } from "../../../../../../utils/projects";
import { uploadModel } from "../../../../../../utils/config";
import { auth } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await initDb();

    // Check if user has access to this project
    const access = await db.query(
      `SELECT 1 FROM projects
       WHERE id = $1 AND (owner_id = $2
       OR EXISTS (SELECT 1 FROM collaborators WHERE project_id = $1 AND user_id = $2))`,
      [params.id, userId],
    );

    if (access.rows.length === 0) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const models = await db.query(
      "SELECT * FROM models WHERE project_id = $1 ORDER BY created_at DESC",
      [params.id],
    );

    return NextResponse.json({ data: models.rows });
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await initDb();

    // Check project access
    const access = await db.query(
      `SELECT 1 FROM projects
       WHERE id = $1 AND (owner_id = $2
       OR EXISTS (SELECT 1 FROM collaborators WHERE project_id = $1 AND user_id = $2))`,
      [params.id, userId],
    );

    if (access.rows.length === 0) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const formData = await request.formData();

    // Upload model file to Pinata
    const file = formData.get("file");
    const metadata = JSON.parse(formData.get("metadata"));

    const uploadResponse = await uploadModel(file, metadata);

    // Add model to database
    const model = await addModelToProject(db, params.id, {
      ...metadata,
      cid: uploadResponse.cid,
      uploaded_by: userId,
    });

    // Backup database after significant change
    await backupDatabase(db);

    return NextResponse.json({ data: model });
  } catch (error) {
    console.error("Model upload failed:", error);
    return NextResponse.json({ error: "Failed to upload model" }, { status: 500 });
  }
}
