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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFields = exports.parseQuery = exports.parsePortals = exports.parseScripts = exports.parseSort = exports.logout = exports.getToken = exports.getScripts = exports.getPortals = exports.getFields = exports.layoutsApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to ActiveCampaign
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @returns {Promise<any>}
 */
function layoutsApiRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getToken.call(this);
        const credentials = yield this.getCredentials('fileMaker');
        const host = credentials.host;
        const db = credentials.db;
        const url = `https://${host}/fmi/data/v1/databases/${db}/layouts`;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'GET',
            uri: url,
            json: true,
        };
        try {
            const responseData = yield this.helpers.request(options);
            const items = parseLayouts(responseData.response.layouts);
            items.sort((a, b) => a.name > b.name ? 0 : 1);
            return items;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.layoutsApiRequest = layoutsApiRequest;
function parseLayouts(layouts) {
    const returnData = [];
    for (const layout of layouts) {
        if (layout.isFolder) {
            returnData.push(...parseLayouts(layout.folderLayoutNames));
        }
        else {
            returnData.push({
                name: layout.name,
                value: layout.name,
            });
        }
    }
    return returnData;
}
/**
 * Make an API request to ActiveCampaign
 *
 * @returns {Promise<any>}
 */
function getFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getToken.call(this);
        const credentials = yield this.getCredentials('fileMaker');
        const layout = this.getCurrentNodeParameter('layout');
        const host = credentials.host;
        const db = credentials.db;
        const url = `https://${host}/fmi/data/v1/databases/${db}/layouts/${layout}`;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'GET',
            uri: url,
            json: true,
        };
        try {
            const responseData = yield this.helpers.request(options);
            return responseData.response.fieldMetaData;
        }
        catch (error) {
            // If that data does not exist for some reason return the actual error
            throw error;
        }
    });
}
exports.getFields = getFields;
/**
 * Make an API request to ActiveCampaign
 *
 * @returns {Promise<any>}
 */
function getPortals() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getToken.call(this);
        const credentials = yield this.getCredentials('fileMaker');
        const layout = this.getCurrentNodeParameter('layout');
        const host = credentials.host;
        const db = credentials.db;
        const url = `https://${host}/fmi/data/v1/databases/${db}/layouts/${layout}`;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'GET',
            uri: url,
            json: true,
        };
        try {
            const responseData = yield this.helpers.request(options);
            return responseData.response.portalMetaData;
        }
        catch (error) {
            // If that data does not exist for some reason return the actual error
            throw error;
        }
    });
}
exports.getPortals = getPortals;
/**
 * Make an API request to ActiveCampaign
 *
 * @returns {Promise<any>}
 */
function getScripts() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getToken.call(this);
        const credentials = yield this.getCredentials('fileMaker');
        const host = credentials.host;
        const db = credentials.db;
        const url = `https://${host}/fmi/data/v1/databases/${db}/scripts`;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'GET',
            uri: url,
            json: true,
        };
        try {
            const responseData = yield this.helpers.request(options);
            const items = parseScriptsList(responseData.response.scripts);
            items.sort((a, b) => a.name > b.name ? 0 : 1);
            return items;
        }
        catch (error) {
            // If that data does not exist for some reason return the actual error
            throw error;
        }
    });
}
exports.getScripts = getScripts;
function parseScriptsList(scripts) {
    const returnData = [];
    for (const script of scripts) {
        if (script.isFolder) {
            returnData.push(...parseScriptsList(script.folderScriptNames));
        }
        else if (script.name !== '-') {
            returnData.push({
                name: script.name,
                value: script.name,
            });
        }
    }
    return returnData;
}
function getToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('fileMaker');
        const host = credentials.host;
        const db = credentials.db;
        const login = credentials.login;
        const password = credentials.password;
        const url = `https://${host}/fmi/data/v1/databases/${db}/sessions`;
        let requestOptions;
        // Reset all values
        requestOptions = {
            uri: url,
            headers: {},
            method: 'POST',
            json: true,
            //rejectUnauthorized: !this.getNodeParameter('allowUnauthorizedCerts', itemIndex, false) as boolean,
        };
        requestOptions.auth = {
            user: login,
            pass: password,
        };
        requestOptions.body = {
            'fmDataSource': [
                {
                    'database': host,
                    'username': login,
                    'password': password,
                },
            ],
        };
        try {
            const response = yield this.helpers.request(requestOptions);
            if (typeof response === 'string') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Response body is not valid JSON. Change "Response Format" to "String"');
            }
            return response.response.token;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getToken = getToken;
function logout(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('fileMaker');
        const host = credentials.host;
        const db = credentials.db;
        const url = `https://${host}/fmi/data/v1/databases/${db}/sessions/${token}`;
        let requestOptions;
        // Reset all values
        requestOptions = {
            uri: url,
            headers: {},
            method: 'DELETE',
            json: true,
            //rejectUnauthorized: !this.getNodeParameter('allowUnauthorizedCerts', itemIndex, false) as boolean,
        };
        try {
            const response = yield this.helpers.request(requestOptions);
            if (typeof response === 'string') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Response body is not valid JSON. Change "Response Format" to "String"');
            }
            return response;
        }
        catch (error) {
            const errorMessage = error.response.body.messages[0].message + '(' + error.response.body.messages[0].message + ')';
            if (errorMessage !== undefined) {
                throw errorMessage;
            }
            throw error.response.body;
        }
    });
}
exports.logout = logout;
function parseSort(i) {
    let sort;
    const setSort = this.getNodeParameter('setSort', i, false);
    if (!setSort) {
        sort = null;
    }
    else {
        sort = [];
        const sortParametersUi = this.getNodeParameter('sortParametersUi', i, {});
        if (sortParametersUi.rules !== undefined) {
            // @ts-ignore
            for (const parameterData of sortParametersUi.rules) {
                // @ts-ignore
                sort.push({
                    'fieldName': parameterData.name,
                    'sortOrder': parameterData.value,
                });
            }
        }
    }
    return sort;
}
exports.parseSort = parseSort;
function parseScripts(i) {
    const setScriptAfter = this.getNodeParameter('setScriptAfter', i, false);
    const setScriptBefore = this.getNodeParameter('setScriptBefore', i, false);
    const setScriptSort = this.getNodeParameter('setScriptSort', i, false);
    if (!setScriptAfter && setScriptBefore && setScriptSort) {
        return {};
    }
    else {
        const scripts = {};
        if (setScriptAfter) {
            scripts.script = this.getNodeParameter('scriptAfter', i);
            scripts['script.param'] = this.getNodeParameter('scriptAfter', i);
        }
        if (setScriptBefore) {
            scripts['script.prerequest'] = this.getNodeParameter('scriptBefore', i);
            scripts['script.prerequest.param'] = this.getNodeParameter('scriptBeforeParam', i);
        }
        if (setScriptSort) {
            scripts['script.presort'] = this.getNodeParameter('scriptSort', i);
            scripts['script.presort.param'] = this.getNodeParameter('scriptSortParam', i);
        }
        return scripts;
    }
}
exports.parseScripts = parseScripts;
function parsePortals(i) {
    let portals;
    const getPortals = this.getNodeParameter('getPortals', i);
    if (!getPortals) {
        portals = [];
    }
    else {
        portals = this.getNodeParameter('portals', i);
    }
    // @ts-ignore
    return portals;
}
exports.parsePortals = parsePortals;
function parseQuery(i) {
    let queries;
    const queriesParamUi = this.getNodeParameter('queries', i, {});
    if (queriesParamUi.query !== undefined) {
        // @ts-ignore
        queries = [];
        for (const queryParam of queriesParamUi.query) {
            const query = {
                'omit': queryParam.omit ? 'true' : 'false',
            };
            // @ts-ignore
            for (const field of queryParam.fields.field) {
                // @ts-ignore
                query[field.name] = field.value;
            }
            queries.push(query);
        }
    }
    else {
        queries = null;
    }
    // @ts-ignore
    return queries;
}
exports.parseQuery = parseQuery;
function parseFields(i) {
    let fieldData;
    const fieldsParametersUi = this.getNodeParameter('fieldsParametersUi', i, {});
    if (fieldsParametersUi.fields !== undefined) {
        // @ts-ignore
        fieldData = {};
        for (const field of fieldsParametersUi.fields) {
            // @ts-ignore
            fieldData[field.name] = field.value;
        }
    }
    else {
        fieldData = null;
    }
    // @ts-ignore
    return fieldData;
}
exports.parseFields = parseFields;
