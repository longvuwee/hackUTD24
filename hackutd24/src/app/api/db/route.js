import { NextResponse } from "next/server";
import { uploadFile, downloadFile, listFiles } from "../../../../utils/config";
import { initDatabase, createTable, insertIntoTable } from "../../../../utils/pglite";

const USER_GROUP_ID = "user-databases";

export async function GET(request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const files = await listFiles(USER_GROUP_ID);
  const userFile = files.find((file) => file.name === `${userId}.db`);

  if (!userFile) {
    return NextResponse.json({ error: "No database found for user" }, { status: 404 });
  }

  const dbBlob = await downloadFile(userFile.cid);
  const db = await initDatabase(dbBlob.data);

  return NextResponse.json({ message: "User database loaded" });
}

export async function POST(request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const db = await initDatabase();
  await createTable(
    db,
    "projects",
    "id INTEGER PRIMARY KEY, name TEXT, description TEXT",
  );

  const dbBlob = await db.dumpDataDir("user-db");
  await uploadFile(dbBlob, USER_GROUP_ID);

  return NextResponse.json({ message: "User database created" });
}
