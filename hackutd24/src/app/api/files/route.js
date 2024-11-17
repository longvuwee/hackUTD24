import { initDatabase } from "../../../../utils/pglite";
import { pinata } from "../../../../utils/config";

export async function POST(request) {
  const { projectId, file, fileType } = await request.json();

  // Retrieve and update the project's database
  const projectDb = await pinata.files.get(projectId);
  const db = await initDatabase(projectDb);

  // Insert file metadata into the database
  await db.exec(`INSERT INTO files (name, type, cid) VALUES ($1, $2, $3)`, [
    file.name,
    fileType,
    file.cid,
  ]);

  return NextResponse.json({ message: "File added to project database" });
}
