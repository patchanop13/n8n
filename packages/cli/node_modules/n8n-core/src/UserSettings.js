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
exports.getUserHome = exports.getUserN8nFolderCustomExtensionPath = exports.getUserN8nFolderPath = exports.getUserSettingsPath = exports.getUserSettings = exports.writeUserSettings = exports.addToUserSettings = exports.getInstanceId = exports.getEncryptionKey = exports.prepareUserSettings = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util');
const fsAccess = promisify(fs_1.default.access);
const fsReadFile = promisify(fs_1.default.readFile);
const fsMkdir = promisify(fs_1.default.mkdir);
const fsWriteFile = promisify(fs_1.default.writeFile);
let settingsCache;
/**
 * Creates the user settings if they do not exist yet
 *
 * @export
 */
function prepareUserSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        const settingsPath = getUserSettingsPath();
        let userSettings = yield getUserSettings(settingsPath);
        if (userSettings !== undefined) {
            // Settings already exist, check if they contain the encryptionKey
            if (userSettings.encryptionKey !== undefined) {
                // Key already exists
                if (userSettings.instanceId === undefined) {
                    userSettings.instanceId = yield generateInstanceId(userSettings.encryptionKey);
                    settingsCache = userSettings;
                }
                return userSettings;
            }
        }
        else {
            userSettings = {};
        }
        if (process.env[_1.ENCRYPTION_KEY_ENV_OVERWRITE] !== undefined) {
            // Use the encryption key which got set via environment
            userSettings.encryptionKey = process.env[_1.ENCRYPTION_KEY_ENV_OVERWRITE];
        }
        else {
            // Generate a new encryption key
            userSettings.encryptionKey = (0, crypto_1.randomBytes)(24).toString('base64');
        }
        userSettings.instanceId = yield generateInstanceId(userSettings.encryptionKey);
        // eslint-disable-next-line no-console
        console.log(`UserSettings were generated and saved to: ${settingsPath}`);
        return writeUserSettings(userSettings, settingsPath);
    });
}
exports.prepareUserSettings = prepareUserSettings;
/**
 * Returns the encryption key which is used to encrypt
 * the credentials.
 *
 * @export
 * @returns
 */
function getEncryptionKey() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env[_1.ENCRYPTION_KEY_ENV_OVERWRITE] !== undefined) {
            return process.env[_1.ENCRYPTION_KEY_ENV_OVERWRITE];
        }
        const userSettings = yield getUserSettings();
        if (userSettings === undefined || userSettings.encryptionKey === undefined) {
            throw new Error(_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY);
        }
        return userSettings.encryptionKey;
    });
}
exports.getEncryptionKey = getEncryptionKey;
/**
 * Returns the instance ID
 *
 * @export
 * @returns
 */
function getInstanceId() {
    return __awaiter(this, void 0, void 0, function* () {
        const userSettings = yield getUserSettings();
        if (userSettings === undefined) {
            return '';
        }
        if (userSettings.instanceId === undefined) {
            return '';
        }
        return userSettings.instanceId;
    });
}
exports.getInstanceId = getInstanceId;
function generateInstanceId(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = key
            ? (0, crypto_1.createHash)('sha256')
                .update(key.slice(Math.round(key.length / 2)))
                .digest('hex')
            : undefined;
        return hash;
    });
}
/**
 * Adds/Overwrite the given settings in the currently
 * saved user settings
 *
 * @export
 * @param {IUserSettings} addSettings  The settings to add/overwrite
 * @param {string} [settingsPath] Optional settings file path
 * @returns {Promise<IUserSettings>}
 */
function addToUserSettings(addSettings, settingsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settingsPath === undefined) {
            settingsPath = getUserSettingsPath();
        }
        let userSettings = yield getUserSettings(settingsPath);
        if (userSettings === undefined) {
            userSettings = {};
        }
        // Add the settings
        Object.assign(userSettings, addSettings);
        return writeUserSettings(userSettings, settingsPath);
    });
}
exports.addToUserSettings = addToUserSettings;
/**
 * Writes a user settings file
 *
 * @export
 * @param {IUserSettings} userSettings The settings to write
 * @param {string} [settingsPath] Optional settings file path
 * @returns {Promise<IUserSettings>}
 */
function writeUserSettings(userSettings, settingsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settingsPath === undefined) {
            settingsPath = getUserSettingsPath();
        }
        if (userSettings === undefined) {
            userSettings = {};
        }
        // Check if parent folder exists if not create it.
        try {
            yield fsAccess(path_1.default.dirname(settingsPath));
        }
        catch (error) {
            // Parent folder does not exist so create
            yield fsMkdir(path_1.default.dirname(settingsPath));
        }
        const settingsToWrite = Object.assign({}, userSettings);
        if (settingsToWrite.instanceId !== undefined) {
            delete settingsToWrite.instanceId;
        }
        yield fsWriteFile(settingsPath, JSON.stringify(settingsToWrite, null, '\t'));
        settingsCache = JSON.parse(JSON.stringify(userSettings));
        return userSettings;
    });
}
exports.writeUserSettings = writeUserSettings;
/**
 * Returns the content of the user settings
 *
 * @export
 * @returns {UserSettings}
 */
function getUserSettings(settingsPath, ignoreCache) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settingsCache !== undefined && ignoreCache !== true) {
            return settingsCache;
        }
        if (settingsPath === undefined) {
            settingsPath = getUserSettingsPath();
        }
        try {
            yield fsAccess(settingsPath);
        }
        catch (error) {
            // The file does not exist
            return undefined;
        }
        const settingsFile = yield fsReadFile(settingsPath, 'utf8');
        try {
            settingsCache = JSON.parse(settingsFile);
        }
        catch (error) {
            throw new Error(`Error parsing n8n-config file "${settingsPath}". It does not seem to be valid JSON.`);
        }
        return settingsCache;
    });
}
exports.getUserSettings = getUserSettings;
/**
 * Returns the path to the user settings
 *
 * @export
 * @returns {string}
 */
function getUserSettingsPath() {
    const n8nFolder = getUserN8nFolderPath();
    return path_1.default.join(n8nFolder, _1.USER_SETTINGS_FILE_NAME);
}
exports.getUserSettingsPath = getUserSettingsPath;
/**
 * Retruns the path to the n8n folder in which all n8n
 * related data gets saved
 *
 * @export
 * @returns {string}
 */
function getUserN8nFolderPath() {
    let userFolder;
    if (process.env[_1.USER_FOLDER_ENV_OVERWRITE] !== undefined) {
        userFolder = process.env[_1.USER_FOLDER_ENV_OVERWRITE];
    }
    else {
        userFolder = getUserHome();
    }
    return path_1.default.join(userFolder, _1.USER_SETTINGS_SUBFOLDER);
}
exports.getUserN8nFolderPath = getUserN8nFolderPath;
/**
 * Returns the path to the n8n user folder with the custom
 * extensions like nodes and credentials
 *
 * @export
 * @returns {string}
 */
function getUserN8nFolderCustomExtensionPath() {
    return path_1.default.join(getUserN8nFolderPath(), _1.EXTENSIONS_SUBDIRECTORY);
}
exports.getUserN8nFolderCustomExtensionPath = getUserN8nFolderCustomExtensionPath;
/**
 * Returns the home folder path of the user if
 * none can be found it falls back to the current
 * working directory
 *
 * @export
 * @returns {string}
 */
function getUserHome() {
    let variableName = 'HOME';
    if (process.platform === 'win32') {
        variableName = 'USERPROFILE';
    }
    if (process.env[variableName] === undefined) {
        // If for some reason the variable does not exist
        // fall back to current folder
        return process.cwd();
    }
    return process.env[variableName];
}
exports.getUserHome = getUserHome;
