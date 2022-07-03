"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadNodesAndCredentials = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const promises_1 = require("fs/promises");
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const Logger_1 = require("./Logger");
const config_1 = __importDefault(require("../config"));
const CUSTOM_NODES_CATEGORY = 'Custom Nodes';
class LoadNodesAndCredentialsClass {
    constructor() {
        this.nodeTypes = {};
        this.credentialTypes = {};
        this.excludeNodes = undefined;
        this.includeNodes = undefined;
        this.nodeModulesPath = '';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(this.logger);
            // Get the path to the node-modules folder to be later able
            // to load the credentials and nodes
            const checkPaths = [
                // In case "n8n" package is in same node_modules folder.
                path_1.default.join(__dirname, '..', '..', '..', 'n8n-workflow'),
                // In case "n8n" package is the root and the packages are
                // in the "node_modules" folder underneath it.
                path_1.default.join(__dirname, '..', '..', 'node_modules', 'n8n-workflow'),
            ];
            for (const checkPath of checkPaths) {
                try {
                    yield (0, promises_1.access)(checkPath);
                    // Folder exists, so use it.
                    this.nodeModulesPath = path_1.default.dirname(checkPath);
                    break;
                }
                catch (error) {
                    // Folder does not exist so get next one
                    // eslint-disable-next-line no-continue
                    continue;
                }
            }
            if (this.nodeModulesPath === '') {
                throw new Error('Could not find "node_modules" folder!');
            }
            this.excludeNodes = config_1.default.getEnv('nodes.exclude');
            this.includeNodes = config_1.default.getEnv('nodes.include');
            // Get all the installed packages which contain n8n nodes
            const packages = yield this.getN8nNodePackages();
            for (const packageName of packages) {
                yield this.loadDataFromPackage(packageName);
            }
            // Read nodes and credentials from custom directories
            const customDirectories = [];
            // Add "custom" folder in user-n8n folder
            customDirectories.push(n8n_core_1.UserSettings.getUserN8nFolderCustomExtensionPath());
            // Add folders from special environment variable
            if (process.env[n8n_core_1.CUSTOM_EXTENSION_ENV] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const customExtensionFolders = process.env[n8n_core_1.CUSTOM_EXTENSION_ENV].split(';');
                // eslint-disable-next-line prefer-spread
                customDirectories.push.apply(customDirectories, customExtensionFolders);
            }
            for (const directory of customDirectories) {
                yield this.loadDataFromDirectory('CUSTOM', directory);
            }
        });
    }
    /**
     * Returns all the names of the packages which could
     * contain n8n nodes
     *
     * @returns {Promise<string[]>}
     * @memberof LoadNodesAndCredentialsClass
     */
    getN8nNodePackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const getN8nNodePackagesRecursive = (relativePath) => __awaiter(this, void 0, void 0, function* () {
                const results = [];
                const nodeModulesPath = `${this.nodeModulesPath}/${relativePath}`;
                for (const file of yield (0, promises_1.readdir)(nodeModulesPath)) {
                    const isN8nNodesPackage = file.indexOf('n8n-nodes-') === 0;
                    const isNpmScopedPackage = file.indexOf('@') === 0;
                    if (!isN8nNodesPackage && !isNpmScopedPackage) {
                        continue;
                    }
                    if (!(yield (0, promises_1.stat)(nodeModulesPath)).isDirectory()) {
                        continue;
                    }
                    if (isN8nNodesPackage) {
                        results.push(`${relativePath}${file}`);
                    }
                    if (isNpmScopedPackage) {
                        results.push(...(yield getN8nNodePackagesRecursive(`${relativePath}${file}/`)));
                    }
                }
                return results;
            });
            return getN8nNodePackagesRecursive('');
        });
    }
    /**
     * Loads credentials from a file
     *
     * @param {string} credentialName The name of the credentials
     * @param {string} filePath The file to read credentials from
     * @returns {Promise<void>}
     */
    loadCredentialsFromFile(credentialName, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
            const tempModule = require(filePath);
            let tempCredential;
            try {
                // Add serializer method "toJSON" to the class so that authenticate method (if defined)
                // gets mapped to the authenticate attribute before it is sent to the client.
                // The authenticate property is used by the client to decide whether or not to
                // include the credential type in the predifined credentials (HTTP node)
                // eslint-disable-next-line func-names
                tempModule[credentialName].prototype.toJSON = function () {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return Object.assign(Object.assign({}, this), { authenticate: typeof this.authenticate === 'function' ? {} : this.authenticate });
                };
                tempCredential = new tempModule[credentialName]();
                if (tempCredential.icon && tempCredential.icon.startsWith('file:')) {
                    // If a file icon gets used add the full path
                    tempCredential.icon = `file:${path_1.default.join(path_1.default.dirname(filePath), tempCredential.icon.substr(5))}`;
                }
            }
            catch (e) {
                if (e instanceof TypeError) {
                    throw new Error(`Class with name "${credentialName}" could not be found. Please check if the class is named correctly!`);
                }
                else {
                    throw e;
                }
            }
            this.credentialTypes[tempCredential.name] = {
                type: tempCredential,
                sourcePath: filePath,
            };
        });
    }
    /**
     * Loads a node from a file
     *
     * @param {string} packageName The package name to set for the found nodes
     * @param {string} nodeName Tha name of the node
     * @param {string} filePath The file to read node from
     * @returns {Promise<void>}
     */
    loadNodeFromFile(packageName, nodeName, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempNode;
            let fullNodeName;
            // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
            const tempModule = require(filePath);
            try {
                tempNode = new tempModule[nodeName]();
                this.addCodex({ node: tempNode, filePath, isCustom: packageName === 'CUSTOM' });
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Error loading node "${nodeName}" from: "${filePath}"`);
                throw error;
            }
            // eslint-disable-next-line prefer-const
            fullNodeName = `${packageName}.${tempNode.description.name}`;
            tempNode.description.name = fullNodeName;
            if (tempNode.description.icon !== undefined && tempNode.description.icon.startsWith('file:')) {
                // If a file icon gets used add the full path
                tempNode.description.icon = `file:${path_1.default.join(path_1.default.dirname(filePath), tempNode.description.icon.substr(5))}`;
            }
            if (tempNode.hasOwnProperty('executeSingle')) {
                this.logger.warn(`"executeSingle" will get deprecated soon. Please update the code of node "${packageName}.${nodeName}" to use "execute" instead!`, { filePath });
            }
            if (tempNode.hasOwnProperty('nodeVersions')) {
                const versionedNodeType = tempNode.getNodeType();
                this.addCodex({ node: versionedNodeType, filePath, isCustom: packageName === 'CUSTOM' });
                if (versionedNodeType.description.icon !== undefined &&
                    versionedNodeType.description.icon.startsWith('file:')) {
                    // If a file icon gets used add the full path
                    versionedNodeType.description.icon = `file:${path_1.default.join(path_1.default.dirname(filePath), versionedNodeType.description.icon.substr(5))}`;
                }
                if (versionedNodeType.hasOwnProperty('executeSingle')) {
                    this.logger.warn(`"executeSingle" will get deprecated soon. Please update the code of node "${packageName}.${nodeName}" to use "execute" instead!`, { filePath });
                }
            }
            if (this.includeNodes !== undefined && !this.includeNodes.includes(fullNodeName)) {
                return;
            }
            // Check if the node should be skiped
            if (this.excludeNodes !== undefined && this.excludeNodes.includes(fullNodeName)) {
                return;
            }
            this.nodeTypes[fullNodeName] = {
                type: tempNode,
                sourcePath: filePath,
            };
        });
    }
    /**
     * Retrieves `categories`, `subcategories` and alias (if defined)
     * from the codex data for the node at the given file path.
     *
     * @param {string} filePath The file path to a `*.node.js` file
     * @returns {CodexData}
     */
    getCodex(filePath) {
        // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
        const { categories, subcategories, alias } = require(`${filePath}on`); // .js to .json
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Object.assign(Object.assign(Object.assign({}, (categories && { categories })), (subcategories && { subcategories })), (alias && { alias }));
    }
    /**
     * Adds a node codex `categories` and `subcategories` (if defined)
     * to a node description `codex` property.
     *
     * @param {object} obj
     * @param obj.node Node to add categories to
     * @param obj.filePath Path to the built node
     * @param obj.isCustom Whether the node is custom
     * @returns {void}
     */
    addCodex({ node, filePath, isCustom, }) {
        try {
            const codex = this.getCodex(filePath);
            if (isCustom) {
                codex.categories = codex.categories
                    ? codex.categories.concat(CUSTOM_NODES_CATEGORY)
                    : [CUSTOM_NODES_CATEGORY];
            }
            node.description.codex = codex;
        }
        catch (_) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this.logger.debug(`No codex available for: ${filePath.split('/').pop()}`);
            if (isCustom) {
                node.description.codex = {
                    categories: [CUSTOM_NODES_CATEGORY],
                };
            }
        }
    }
    /**
     * Loads nodes and credentials from the given directory
     *
     * @param {string} setPackageName The package name to set for the found nodes
     * @param {string} directory The directory to look in
     * @returns {Promise<void>}
     */
    loadDataFromDirectory(setPackageName, directory) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield (0, fast_glob_1.default)(path_1.default.join(directory, '**/*.@(node|credentials).js'));
            let fileName;
            let type;
            const loadPromises = [];
            for (const filePath of files) {
                [fileName, type] = path_1.default.parse(filePath).name.split('.');
                if (type === 'node') {
                    loadPromises.push(this.loadNodeFromFile(setPackageName, fileName, filePath));
                }
                else if (type === 'credentials') {
                    loadPromises.push(this.loadCredentialsFromFile(fileName, filePath));
                }
            }
            yield Promise.all(loadPromises);
        });
    }
    /**
     * Loads nodes and credentials from the package with the given name
     *
     * @param {string} packageName The name to read data from
     * @returns {Promise<void>}
     */
    loadDataFromPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the absolute path of the package
            const packagePath = path_1.default.join(this.nodeModulesPath, packageName);
            // Read the data from the package.json file to see if any n8n data is defiend
            const packageFileString = yield (0, promises_1.readFile)(path_1.default.join(packagePath, 'package.json'), 'utf8');
            const packageFile = JSON.parse(packageFileString);
            if (!packageFile.hasOwnProperty('n8n')) {
                return;
            }
            let tempPath;
            let filePath;
            // Read all node types
            let fileName;
            let type;
            if (packageFile.n8n.hasOwnProperty('nodes') && Array.isArray(packageFile.n8n.nodes)) {
                for (filePath of packageFile.n8n.nodes) {
                    tempPath = path_1.default.join(packagePath, filePath);
                    [fileName, type] = path_1.default.parse(filePath).name.split('.');
                    yield this.loadNodeFromFile(packageName, fileName, tempPath);
                }
            }
            // Read all credential types
            if (packageFile.n8n.hasOwnProperty('credentials') &&
                Array.isArray(packageFile.n8n.credentials)) {
                for (filePath of packageFile.n8n.credentials) {
                    tempPath = path_1.default.join(packagePath, filePath);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    [fileName, type] = path_1.default.parse(filePath).name.split('.');
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.loadCredentialsFromFile(fileName, tempPath);
                }
            }
        });
    }
}
let packagesInformationInstance;
function LoadNodesAndCredentials() {
    if (packagesInformationInstance === undefined) {
        packagesInformationInstance = new LoadNodesAndCredentialsClass();
    }
    return packagesInformationInstance;
}
exports.LoadNodesAndCredentials = LoadNodesAndCredentials;
