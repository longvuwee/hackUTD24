export async function createProject(
  db,
  { name, description, ownerId, visibility = "private" },
) {
  try {
    const result = await db.query(
      "INSERT INTO projects (name, description, owner_id, visibility) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, ownerId, visibility],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Project creation failed:", error);
    throw error;
  }
}

export async function addModelToProject(db, projectId, modelData) {
  try {
    const result = await db.query(
      `INSERT INTO models (
        project_id, name, description, cid, framework,
        metrics, parameters, dataset_versions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        projectId,
        modelData.name,
        modelData.description,
        modelData.cid,
        modelData.framework,
        modelData.metrics,
        modelData.parameters,
        modelData.datasetVersions,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Model addition failed:", error);
    throw error;
  }
}

export async function addDatasetToProject(db, projectId, datasetData) {
  try {
    const result = await db.query(
      `INSERT INTO datasets (
        project_id, name, description, cid,
        schema, statistics
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        projectId,
        datasetData.name,
        datasetData.description,
        datasetData.cid,
        datasetData.schema,
        datasetData.statistics,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Dataset addition failed:", error);
    throw error;
  }
}

// Backup utility
export async function backupDatabase(db) {
  try {
    const dbFile = await db.dumpDataDir("auto");
    const upload = await pinata.upload.file(dbFile).group(process.env.DB_GROUP_ID);
    return upload;
  } catch (error) {
    console.error("Database backup failed:", error);
    throw error;
  }
}
