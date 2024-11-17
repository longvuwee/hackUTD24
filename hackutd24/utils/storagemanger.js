import { pinata } from "./config";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string[]} projects
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} ownerId
 * @property {string[]} collaborators
 * @property {string[]} models
 * @property {string[]} datasets
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {'private' | 'public' | 'collaborative'} visibility
 */

/**
 * @typedef {Object} MLModel
 * @property {string} id
 * @property {string} projectId
 * @property {string} name
 * @property {string} description
 * @property {string} version
 * @property {string} framework
 * @property {string} modelCID
 * @property {string} configCID
 * @property {Object.<string, number>} metrics
 * @property {string[]} tags
 * @property {string} createdBy
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export class StorageManager {
  constructor() {
    this.pinata = pinata;
    this.indexes = {
      users: {},
      projects: {},
      models: {},
      datasets: {},
    };
    this.indexCID = null;
  }
  /**
   * Initialize storage manager by loading current indexes
   */
  async init() {
    try {
      const files = await this.pinata.files
        .list()
        .name("ml-platform-index.json")
        .order("DESC")
        .limit(1);

      if (files.files && files.files.length > 0) {
        this.indexCID = files.files[0].cid;
        const response = await this.pinata.gateways.get(this.indexCID);
        this.indexes = JSON.parse(await response.data.text());
      }
    } catch (error) {
      console.error("Failed to initialize storage", error);
      throw error;
    }
  }

  /**
   * Save current indexes to Pinata
   * @private
   */

  async saveIndexes() {
    try {
      const file = new File([JSON.stringify(this.indexes)], "ml-platform-index.json", {
        type: "application/json",
      });

      const upload = await this.pinata.upload.file(file).addMetadata({
        name: "ml-platform-index.json",
        keyvalues: {
          type: "index",
          updated: new Date().toISOString(),
        },
      });

      this.indexCID = upload.cid;
    } catch (error) {
      console.error("Failed to save indexes", error);
      throw error;
    }
  }
  /**
   * Create a new user
   * @param {Object} userData User data
   * @param {string} userData.name User's name
   * @param {string} userData.email User's email
   * @returns {Promise<User>}
   */

  async createUser(userData) {
    const id = `user-${Date.now()}`;
    const user = {
      ...userData,
      id,
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.indexes.users[id] = user;
    await this.saveIndexes();
    return user;
  }

  /**
   * Create a new project
   * @param {Object} projectData Project data
   * @param {string} projectData.name Project name
   * @param {string} projectData.description Project description
   * @param {string} projectData.ownerId Owner's user ID
   * @param {('private'|'public'|'collaborative')} projectData.visibility Project visibility
   * @returns {Promise<Project>}
   */

  async createProject(projectData) {
    const id = `project-${Date.now()}`;
    const project = {
      ...projectData,
      id,
      models: [],
      datasets: [],
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.indexes.projects[id] = project;
    this.indexes.users[projectData.ownerId].projects.push(id);
    await this.saveIndexes();
    return project;
  }

  /**
   * Upload a new model
   * @param {File} modelFile Model file
   * @param {File} configFile Configuration file
   * @param {Object} modelData Model metadata
   * @returns {Promise<MLModel>}
   */

  async uploadModel(modelFile, configFile, modelData) {
    try {
      const modelUpload = await this.pinata.upload.file(modelFile).addMetadata({
        name: modelFile.name,
        keyvalues: {
          projectId: modelData.projectId,
          version: modelData.version,
        },
      });

      const configUpload = await this.pinata.upload.file(configFile).addMetadata({
        name: `${modelData.name}-config.json`,
        keyvalues: {
          projectId: modelData.projectId,
          version: modelData.version,
        },
      });

      const id = `model_${Date.now()}`;
      const model = {
        ...modelData,
        id,
        modelCID: modelUpload.cid,
        configCID: configUpload.cid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.indexes.models[id] = model;
      this.indexes.projects[modelData.projectId].models.push(id);
      await this.saveIndexes();
      return model;
    } catch (error) {
      console.error("Failed to upload model", error);
      throw error;
    }
  }

  /**
   * Get all projects for a user
   * @param {string} userId User ID
   * @returns {Promise<Project[]>}
   */

  async getUserProjects(userId) {
    const user = this.indexes.users[userId];
    if (!user) return [];

    return user.projects.map((id) => this.indexes.projects[id]);
  }

  /**
   * Get all models in a project
   * @param {string} projectId Project ID
   * @returns {Promise<MLModel[]>}
   */

  async getProjectModels(projectId) {
    const project = this.indexes.projects[projectId];
    if (!project) return [];

    return project.models.map((id) => this.indexes.models[id]);
  }

  /**
   * Check if user can access a project
   * @param {string} userId User ID
   * @param {string} projectId Project ID
   * @returns {Promise<boolean>}
   */

  async canAccessProjects(userId, projectId) {
    const project = this.indexes.projects[projectId];
    if (!project) return false;

    return (
      project.ownerId === userId ||
      project.visibility === "public" ||
      (project.visibility === "collaborative" && project.collaborators.includes(userId))
    );
  }
}
