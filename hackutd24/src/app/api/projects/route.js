import { NextResponse } from "next/server";
import { initDatabase, createTable } from "../../../../utils/pglite";
import { pinata } from "../../../../utils/config";
import fs from "fs";
import path from "path";

const validateInput = (userId, name, description) => {
  if (!userId || !name || !description) {
    throw new Error("Missing required fields");
  }
  // Add more validation here if needed
};

const createProjectDatabase = async (db, name) => {
  try {
    await createTable(
      db,
      "files",
      "id INTEGER PRIMARY KEY, name TEXT, type TEXT, cid TEXT"
    );
    console.log("Table created:", db);
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
};

const dumpDatabase = async (db, dumpPath) => {
  try {
    // Ensure the directory exists
    const dir = path.dirname(dumpPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Dump the database to the specified path
    const dbBlob = await db.dump(dumpPath);
    console.log("Database dumped:", dbBlob);
    return dbBlob;
  } catch (error) {
    console.error("Error dumping database:", error);
    throw error;
  }
};

const uploadToPinata = async (dbBlob) => {
  try {
    const uploadResponse = await pinata.upload.file(dbBlob);
    console.log("Database uploaded:", uploadResponse);
    return uploadResponse;
  } catch (error) {
    console.error("Error uploading database to Pinata:", error);
    throw error;
  }
};

export async function POST(request) {
  try {
    console.log("Received request:", request);

    const { userId, name, description } = await request.json();
    console.log("Parsed JSON data:", { userId, name, description });

    validateInput(userId, name, description);

    console.log("Received data:", { userId, name, description });

    // Step 1: Initialize the Project Database
    const db = await initDatabase();
    console.log("Database initialized:", db);

    // Step 2: Create Project Database
    await createProjectDatabase(db, name);

    // Step 3: Dump Database to Blob
    const dumpPath = path.join(process.cwd(), "uploads", `project-${name}.db`); // Ensure the path is correct
    console.log("Dump path:", dumpPath);

    const dbBlob = await dumpDatabase(db, dumpPath);

    // Step 4: Upload to Pinata
    const uploadResponse = await uploadToPinata(dbBlob);

    return NextResponse.json({
      message: "Project database created",
      uploadResponse,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
