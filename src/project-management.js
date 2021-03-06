import fs from 'fs';
import nconf from 'nconf';
import utils from './utils';
import config from '../config.json';

const fsPromises = fs.promises;

utils.checkProjectsFolderExists();

/**
 * @name ProjectManagement
 */
const ProjectManagement = {
    /**
     * Creates a new Folder in File System using **process.env.PROJECTS_FOLDER** and given
     * **projectName**. Creates sub-folders for **configurations** and **JSON Schemas**
     * @param {string} projectName
     * @return {boolean} - return **true** if a new project was created, **false** if it already exists.
     */
    createProject: async (projectName) => {
        const projectsFolder = nconf.get('projects_folder');
        const path = `${projectsFolder}/${projectName}`;

        await fsPromises.mkdir(path);
        await fsPromises.mkdir(`${path}/${config.CONFIGURATIONS_FOLDER}`);
        await fsPromises.mkdir(`${path}/${config.SCHEMAS_FOLDER}`);
        return true;
    },
    /**
 * Retrieves a list of all existing projects in the File System
 * @return {string[]}
 */
    getAllProjects: async () => {
        const path = nconf.get('projects_folder');

        const pathContents = await fsPromises.readdir(path);
        return pathContents.filter(async (file) => {
            const stat = await fsPromises.stat(`${path}/${file}`);
            return stat.isDirectory();
        });
    },
    /**
 * Retrieves the configurations *filenames* inside the directory of **projectName**
 * @param projectName
 * @return {string[]}
 * @throws {Error} Project does not exist
 */
    getProjectConfigurations: async (projectName) => {
        const projectsFolder = nconf.get('projects_folder');
        const path = `${projectsFolder}/${projectName}/${config.CONFIGURATIONS_FOLDER}`;

        const fsStat = await fsPromises.stat(path);
        if (fsStat.isDirectory()) {
            try {
                return fsPromises.readdir(path);
            } catch (e) {
            }
        }
        throw new Error('Project does not exist');
    }
};

export default ProjectManagement;
