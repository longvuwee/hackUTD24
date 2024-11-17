import { PGlite } from "@electric-sql/pglite";
import { PinataSDK } from "pinata";

export async function initDb() {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.GATEWAY_URL,
    });

    // Try to get latest DB backup from Pinata
    const files = await pinata.files.list().group(process.env.DB_GROUP_ID).order("DESC");

    let db;
    if (files.files?.length > 0) {
      const dbFile = await pinata.gateways.get(files.files[0].cid);
      const file = dbFile.data;
      db = new PGlite({ loadDataDir: file });
    } else {
      // Initialize new database with schema
      db = new PGlite();
      await db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          owner_id TEXT NOT NULL,
          visibility TEXT DEFAULT 'private',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS models (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id),
          name TEXT NOT NULL,
          description TEXT,
          cid TEXT NOT NULL,
          framework TEXT,
          metrics JSONB,
          parameters JSONB,
          dataset_versions TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(project_id, name)
        );

        CREATE TABLE IF NOT EXISTS datasets (
          id SERIAL PRIMARY KEY,
          project_id INTEGER REFERENCES projects(id),
          name TEXT NOT NULL,
          description TEXT,
          cid TEXT NOT NULL,
          schema JSONB,
          statistics JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(project_id, name)
        );

        CREATE TABLE IF NOT EXISTS collaborators (
          project_id INTEGER REFERENCES projects(id),
          user_id TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(project_id, user_id)
        );
      `);
    }

    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
