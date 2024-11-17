import { PGlite } from "@electric-sql/pglite";

export async function initDatabase() {
  console.log("Initializing in-memory database...");
  const db = await PGlite.create({ dataDir: "memory" });
  console.log("Database initialized:", db);
  return db;
}

export async function createTable(db, tableName, schema) {
  console.log(`Creating table: ${tableName}`);
  await db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${schema});`);
  console.log(`Table created: ${tableName}`);
}
