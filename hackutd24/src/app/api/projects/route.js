import { NextResponse } from "next/server";
import { initDatabase, createTable } from "../../../../utils/pglite";
import { pinata } from "../../../../utils/config";

export async function POST(request) {
  try {
    const { userId, name, description } = await request.json();

    if (!userId || !name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Received data:", { userId, name, description });

    // Step 1: Initialize the Project Database
    const db = await initDatabase();
    console.log("Database initialized.");

    // Step 2: Create Files Table
    await createTable(
      db,
      "files",
      "id INTEGER PRIMARY KEY, name TEXT, type TEXT, cid TEXT",
    );
    console.log("Table created.");

    // Step 3: Dump Database to Blob
    const dumpPath = `project-${name}`;
    console.log("Dumping database with path:", dumpPath);

    const dbBlob = await db.dumpDataDir(dumpPath);
    console.log("Database dumped:", dbBlob);

    // Step 4: Upload to Pinata
    const uploadResponse = await pinata.upload.file(dbBlob);
    console.log("Database uploaded:", uploadResponse);

    return NextResponse.json({
      message: "Project database created",
      uploadResponse,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
