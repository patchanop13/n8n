"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDateFieldsWithDotNotation = exports.handleDateFields = exports.getItemCopy = exports.validateAndResolveMongoCredentials = exports.buildMongoConnectionParams = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
/**
 * Standard way of building the MongoDB connection string, unless overridden with a provided string
 *
 * @param {ICredentialDataDecryptedObject} credentials MongoDB credentials to use, unless conn string is overridden
 */
function buildParameterizedConnString(credentials) {
    if (credentials.port) {
        return `mongodb://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}`;
    }
    else {
        return `mongodb+srv://${credentials.user}:${credentials.password}@${credentials.host}`;
    }
}
/**
 * Build mongoDb connection string and resolve database name.
 * If a connection string override value is provided, that will be used in place of individual args
 *
 * @param {IExecuteFunctions} self
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
function buildMongoConnectionParams(self, credentials) {
    const sanitizedDbName = credentials.database && credentials.database.trim().length > 0
        ? credentials.database.trim()
        : '';
    if (credentials.configurationType === 'connectionString') {
        if (credentials.connectionString &&
            credentials.connectionString.trim().length > 0) {
            return {
                connectionString: credentials.connectionString.trim(),
                database: sanitizedDbName,
            };
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(self.getNode(), 'Cannot override credentials: valid MongoDB connection string not provided ');
        }
    }
    else {
        return {
            connectionString: buildParameterizedConnString(credentials),
            database: sanitizedDbName,
        };
    }
}
exports.buildMongoConnectionParams = buildMongoConnectionParams;
/**
 * Verify credentials. If ok, build mongoDb connection string and resolve database name.
 *
 * @param {IExecuteFunctions} self
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
function validateAndResolveMongoCredentials(self, credentials) {
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(self.getNode(), 'No credentials got returned!');
    }
    else {
        return buildMongoConnectionParams(self, credentials);
    }
}
exports.validateAndResolveMongoCredentials = validateAndResolveMongoCredentials;
/**
 * Returns of copy of the items which only contains the json data and
 * of that only the define properties
 *
 * @param {INodeExecutionData[]} items The items to copy
 * @param {string[]} properties The properties it should include
 * @returns
 */
function getItemCopy(items, properties) {
    // Prepare the data to insert and copy it to be returned
    let newItem;
    return items.map(item => {
        newItem = {};
        for (const property of properties) {
            if (item.json[property] === undefined) {
                newItem[property] = null;
            }
            else {
                newItem[property] = JSON.parse(JSON.stringify(item.json[property]));
            }
        }
        return newItem;
    });
}
exports.getItemCopy = getItemCopy;
function handleDateFields(insertItems, fields) {
    const dateFields = fields.split(',');
    for (let i = 0; i < insertItems.length; i++) {
        for (const key of Object.keys(insertItems[i])) {
            if (dateFields.includes(key)) {
                insertItems[i][key] = new Date(insertItems[i][key]);
            }
        }
    }
}
exports.handleDateFields = handleDateFields;
function handleDateFieldsWithDotNotation(insertItems, fields) {
    const dateFields = fields.split(',').map(field => field.trim());
    for (let i = 0; i < insertItems.length; i++) {
        for (const field of dateFields) {
            const fieldValue = (0, lodash_1.get)(insertItems[i], field);
            const date = new Date(fieldValue);
            if (fieldValue && !isNaN(date.valueOf())) {
                (0, lodash_1.set)(insertItems[i], field, date);
            }
        }
    }
}
exports.handleDateFieldsWithDotNotation = handleDateFieldsWithDotNotation;
