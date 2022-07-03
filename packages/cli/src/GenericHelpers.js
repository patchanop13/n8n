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
exports.DEFAULT_EXECUTIONS_GET_ALL_LIMIT = exports.validateEntity = exports.generateUniqueName = exports.getConfigValue = exports.getVersions = exports.getSessionId = exports.getBaseUrl = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const class_validator_1 = require("class-validator");
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
// eslint-disable-next-line import/order
const typeorm_1 = require("typeorm");
let versionCache;
/**
 * Returns the base URL n8n is reachable from
 *
 * @export
 * @returns {string}
 */
function getBaseUrl() {
    const protocol = config_1.default.getEnv('protocol');
    const host = config_1.default.getEnv('host');
    const port = config_1.default.getEnv('port');
    const path = config_1.default.getEnv('path');
    if ((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443)) {
        return `${protocol}://${host}${path}`;
    }
    return `${protocol}://${host}:${port}${path}`;
}
exports.getBaseUrl = getBaseUrl;
/**
 * Returns the session id if one is set
 *
 * @export
 * @param {express.Request} req
 * @returns {(string | undefined)}
 */
function getSessionId(req) {
    return req.headers.sessionid;
}
exports.getSessionId = getSessionId;
/**
 * Returns information which version of the packages are installed
 *
 * @export
 * @returns {Promise<IPackageVersions>}
 */
function getVersions() {
    return __awaiter(this, void 0, void 0, function* () {
        if (versionCache !== undefined) {
            return versionCache;
        }
        const packageFile = yield (0, promises_1.readFile)((0, path_1.join)(__dirname, '../../package.json'), 'utf8');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const packageData = JSON.parse(packageFile);
        versionCache = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            cli: packageData.version,
        };
        return versionCache;
    });
}
exports.getVersions = getVersions;
/**
 * Extracts configuration schema for key
 *
 * @param {string} configKey
 * @param {IDataObject} configSchema
 * @returns {IDataObject} schema of the configKey
 */
function extractSchemaForKey(configKey, configSchema) {
    const configKeyParts = configKey.split('.');
    // eslint-disable-next-line no-restricted-syntax
    for (const key of configKeyParts) {
        if (configSchema[key] === undefined) {
            throw new Error(`Key "${key}" of ConfigKey "${configKey}" does not exist`);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        }
        else if (configSchema[key]._cvtProperties === undefined) {
            configSchema = configSchema[key];
        }
        else {
            configSchema = configSchema[key]._cvtProperties;
        }
    }
    return configSchema;
}
/**
 * Gets value from config with support for "_FILE" environment variables
 *
 * @export
 * @param {string} configKey The key of the config data to get
 * @returns {(Promise<string | boolean | number | undefined>)}
 */
function getConfigValue(configKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the environment variable
        const configSchema = config_1.default.getSchema();
        // @ts-ignore
        const currentSchema = extractSchemaForKey(configKey, configSchema._cvtProperties);
        // Check if environment variable is defined for config key
        if (currentSchema.env === undefined) {
            // No environment variable defined, so return value from config
            // @ts-ignore
            return config_1.default.getEnv(configKey);
        }
        // Check if special file enviroment variable exists
        const fileEnvironmentVariable = process.env[`${currentSchema.env}_FILE`];
        if (fileEnvironmentVariable === undefined) {
            // Does not exist, so return value from config
            // @ts-ignore
            return config_1.default.getEnv(configKey);
        }
        let data;
        try {
            data = yield (0, promises_1.readFile)(fileEnvironmentVariable, 'utf8');
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`The file "${fileEnvironmentVariable}" could not be found.`);
            }
            throw error;
        }
        return data;
    });
}
exports.getConfigValue = getConfigValue;
/**
 * Generate a unique name for a workflow or credentials entity.
 *
 * - If the name does not yet exist, it returns the requested name.
 * - If the name already exists once, it returns the requested name suffixed with 2.
 * - If the name already exists more than once with suffixes, it looks for the max suffix
 * and returns the requested name with max suffix + 1.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function generateUniqueName(requestedName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const findConditions = {
            select: ['name'],
            where: {
                name: (0, typeorm_1.Like)(`${requestedName}%`),
            },
        };
        const found = entityType === 'workflow'
            ? yield _1.Db.collections.Workflow.find(findConditions)
            : yield _1.Db.collections.Credentials.find(findConditions);
        // name is unique
        if (found.length === 0) {
            return requestedName;
        }
        const maxSuffix = found.reduce((acc, { name }) => {
            const parts = name.split(`${requestedName} `);
            if (parts.length > 2)
                return acc;
            const suffix = Number(parts[1]);
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(suffix) && Math.ceil(suffix) > acc) {
                acc = Math.ceil(suffix);
            }
            return acc;
        }, 0);
        // name is duplicate but no numeric suffixes exist yet
        if (maxSuffix === 0) {
            return `${requestedName} 2`;
        }
        return `${requestedName} ${maxSuffix + 1}`;
    });
}
exports.generateUniqueName = generateUniqueName;
function validateEntity(entity) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = yield (0, class_validator_1.validate)(entity);
        const errorMessages = errors
            .reduce((acc, cur) => {
            if (!cur.constraints)
                return acc;
            acc.push(...Object.values(cur.constraints));
            return acc;
        }, [])
            .join(' | ');
        if (errorMessages) {
            throw new _1.ResponseHelper.ResponseError(errorMessages, undefined, 400);
        }
    });
}
exports.validateEntity = validateEntity;
exports.DEFAULT_EXECUTIONS_GET_ALL_LIMIT = 20;
