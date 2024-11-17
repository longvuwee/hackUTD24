import { NextResponse } from "next/server";
import { initDatabase, createTable } from "../../../../utils/pglite";
import { pinata } from "../../../../utils/config";
import fs from "fs";
import path from "path";

// Mock function to check authentication - replace with your actual logic
const isAuthenticated = (request) => {
  // You can check for a session token, cookie, or any other method
  const token = request.headers.get("Authorization");
  return token === "Bearer valid_token"; // Replace with actual validation logic
};

const validateInput = (userId, name, description) => {
  if (!userId || !name || !description) {
    throw new Error("Missing required fields");
  }
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
    const dir = path.dirname(dumpPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

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
    // Check if the user is authenticated
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Received request:", request);

    const { userId, name, description } = await request.json();
    console.log("Parsed JSON data:", { userId, name, description });

    validateInput(userId, name, description);

    console.log("Received data:", { userId, name, description });

    const db = await initDatabase();
    console.log("Database initialized:", db);

    await createProjectDatabase(db, name);

    const dumpPath = path.join(process.cwd(), "uploads", `project-${name}.db`);
    console.log("Dump path:", dumpPath);

    const dbBlob = await dumpDatabase(db, dumpPath);

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

export async function GET(request) {
  return NextResponse.json(
    { message: "GET method is not supported for this route." },
    { status: 405 }
  );
}
