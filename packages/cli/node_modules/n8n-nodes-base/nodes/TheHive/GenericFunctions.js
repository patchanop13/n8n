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
exports.prepareRangeQuery = exports.prepareSortQuery = exports.buildCustomFieldSearch = exports.prepareCustomFields = exports.prepareOptional = exports.splitTags = exports.mapResource = exports.theHiveApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_1 = __importDefault(require("moment"));
const QueryFunctions_1 = require("./QueryFunctions");
function theHiveApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('theHiveApi');
        const headerWithAuthentication = Object.assign({}, { Authorization: `Bearer ${credentials.ApiKey}` });
        let options = {
            headers: headerWithAuthentication,
            method,
            qs: query,
            uri: uri || `${credentials.url}/api${resource}`,
            body,
            rejectUnauthorized: !credentials.allowUnauthorizedCerts,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            options = Object.assign({}, options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.theHiveApiRequest = theHiveApiRequest;
// Helpers functions
function mapResource(resource) {
    switch (resource) {
        case 'alert':
            return 'alert';
        case 'case':
            return 'case';
        case 'observable':
            return 'case_artifact';
        case 'task':
            return 'case_task';
        case 'log':
            return 'case_task_log';
        default:
            return '';
    }
}
exports.mapResource = mapResource;
function splitTags(tags) {
    return tags.split(',').filter(tag => tag !== ' ' && tag);
}
exports.splitTags = splitTags;
function prepareOptional(optionals) {
    const response = {};
    for (const key in optionals) {
        if (optionals[key] !== undefined && optionals[key] !== null && optionals[key] !== '') {
            if (['customFieldsJson', 'customFieldsUi'].indexOf(key) > -1) {
                continue; // Ignore customFields, they need special treatment
            }
            else if ((0, moment_1.default)(optionals[key], moment_1.default.ISO_8601).isValid()) {
                response[key] = Date.parse(optionals[key]);
            }
            else if (key === 'artifacts') {
                response[key] = JSON.parse(optionals[key]);
            }
            else if (key === 'tags') {
                response[key] = splitTags(optionals[key]);
            }
            else {
                response[key] = optionals[key];
            }
        }
    }
    return response;
}
exports.prepareOptional = prepareOptional;
function prepareCustomFields(additionalFields, jsonParameters = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the additionalFields object contains customFields
        if (jsonParameters === true) {
            const customFieldsJson = additionalFields.customFieldsJson;
            // Delete from additionalFields as some operations (e.g. alert:update) do not run prepareOptional
            // which would remove the extra fields
            delete additionalFields.customFieldsJson;
            if (typeof customFieldsJson === 'string') {
                return JSON.parse(customFieldsJson);
            }
            else if (typeof customFieldsJson === 'object') {
                return customFieldsJson;
            }
            else if (customFieldsJson) {
                throw Error('customFieldsJson value is invalid');
            }
        }
        else if (additionalFields.customFieldsUi) {
            // Get Custom Field Types from TheHive
            const credentials = yield this.getCredentials('theHiveApi');
            const version = credentials.apiVersion;
            const endpoint = version === 'v1' ? '/customField' : '/list/custom_fields';
            const requestResult = yield theHiveApiRequest.call(this, 'GET', endpoint);
            // Convert TheHive3 response to the same format as TheHive 4
            // [{name, reference, type}]
            const hiveCustomFields = version === 'v1' ? requestResult : Object.keys(requestResult).map(key => requestResult[key]);
            // Build reference to type mapping object
            const referenceTypeMapping = hiveCustomFields.reduce((acc, curr) => (acc[curr.reference] = curr.type, acc), {});
            // Build "fieldName": {"type": "value"} objects
            const customFieldsUi = additionalFields.customFieldsUi;
            const customFields = (customFieldsUi === null || customFieldsUi === void 0 ? void 0 : customFieldsUi.customFields).reduce((acc, curr) => {
                const fieldName = curr.field;
                // Might be able to do some type conversions here if needed, TODO
                acc[fieldName] = {
                    [referenceTypeMapping[fieldName]]: curr.value,
                };
                return acc;
            }, {});
            delete additionalFields.customFieldsUi;
            return customFields;
        }
        return undefined;
    });
}
exports.prepareCustomFields = prepareCustomFields;
function buildCustomFieldSearch(customFields) {
    const customFieldTypes = ['boolean', 'date', 'float', 'integer', 'number', 'string'];
    const searchQueries = [];
    Object.keys(customFields).forEach(customFieldName => {
        const customField = customFields[customFieldName];
        // Figure out the field type from the object's keys
        const fieldType = Object.keys(customField)
            .filter(key => customFieldTypes.indexOf(key) > -1)[0];
        const fieldValue = customField[fieldType];
        searchQueries.push((0, QueryFunctions_1.Eq)(`customFields.${customFieldName}.${fieldType}`, fieldValue));
    });
    return searchQueries;
}
exports.buildCustomFieldSearch = buildCustomFieldSearch;
function prepareSortQuery(sort, body) {
    if (sort) {
        const field = sort.substring(1);
        const value = sort.charAt(0) === '+' ? 'asc' : 'desc';
        const sortOption = {};
        sortOption[field] = value;
        body.query.push({
            '_name': 'sort',
            '_fields': [
                sortOption,
            ],
        });
    }
}
exports.prepareSortQuery = prepareSortQuery;
function prepareRangeQuery(range, body) {
    if (range && range !== 'all') {
        body['query'].push({
            '_name': 'page',
            'from': parseInt(range.split('-')[0], 10),
            'to': parseInt(range.split('-')[1], 10),
        });
    }
}
exports.prepareRangeQuery = prepareRangeQuery;
