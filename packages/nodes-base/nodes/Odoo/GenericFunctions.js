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
exports.odooGetServerVersion = exports.odooGetUserID = exports.odooDelete = exports.odooUpdate = exports.odooGetAll = exports.odooGet = exports.odooCreate = exports.odooGetModelFields = exports.odooJSONRPCRequest = exports.processNameValueFields = exports.odooGetDBName = exports.mapFilterOperationToJSONRPC = exports.mapOdooResources = exports.mapOperationToJSONRPC = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const serviceJSONRPC = 'object';
const methodJSONRPC = 'execute';
exports.mapOperationToJSONRPC = {
    create: 'create',
    get: 'read',
    getAll: 'search_read',
    update: 'write',
    delete: 'unlink',
};
exports.mapOdooResources = {
    contact: 'res.partner',
    opportunity: 'crm.lead',
    note: 'note.note',
};
exports.mapFilterOperationToJSONRPC = {
    equal: '=',
    notEqual: '!=',
    greaterThen: '>',
    lesserThen: '<',
    greaterOrEqual: '>=',
    lesserOrEqual: '<=',
    like: 'like',
    in: 'in',
    notIn: 'not in',
    childOf: 'child_of',
};
function odooGetDBName(databaseName, url) {
    if (databaseName)
        return databaseName;
    const odooURL = new URL(url);
    const hostname = odooURL.hostname;
    if (!hostname)
        return '';
    return odooURL.hostname.split('.')[0];
}
exports.odooGetDBName = odooGetDBName;
function processFilters(value) {
    var _a;
    return (_a = value.filter) === null || _a === void 0 ? void 0 : _a.map((item) => {
        const operator = item.operator;
        item.operator = exports.mapFilterOperationToJSONRPC[operator];
        return Object.values(item);
    });
}
function processNameValueFields(value) {
    var _a;
    const data = value;
    return (_a = data === null || data === void 0 ? void 0 : data.fields) === null || _a === void 0 ? void 0 : _a.reduce((acc, record) => {
        return Object.assign(acc, { [record.fieldName]: record.fieldValue });
    }, {});
}
exports.processNameValueFields = processNameValueFields;
// function processResponceFields(value: IDataObject) {
// 	const data = value as unknown as IOdooResponceFields;
// 	return data?.fields?.map((entry) => entry.field);
// }
function odooJSONRPCRequest(body, url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = {
                headers: {
                    'User-Agent': 'n8n',
                    Connection: 'keep-alive',
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body,
                uri: `${url}/jsonrpc`,
                json: true,
            };
            const responce = yield this.helpers.request(options);
            if (responce.error) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), responce.error.data, {
                    message: responce.error.data.message,
                });
            }
            return responce.result;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooJSONRPCRequest = odooJSONRPCRequest;
function odooGetModelFields(db, userID, password, resource, url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        'fields_get',
                        [],
                        ['string', 'type', 'help', 'required', 'name'],
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            const result = yield odooJSONRPCRequest.call(this, body, url);
            return result;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooGetModelFields = odooGetModelFields;
function odooCreate(db, userID, password, resource, operation, url, newItem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        exports.mapOperationToJSONRPC[operation],
                        newItem || {},
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            const result = yield odooJSONRPCRequest.call(this, body, url);
            return { id: result };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooCreate = odooCreate;
function odooGet(db, userID, password, resource, operation, url, itemsID, fieldsToReturn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                    status: 'Error',
                    message: `Please specify a valid ID: ${itemsID}`,
                });
            }
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        exports.mapOperationToJSONRPC[operation],
                        [+itemsID] || [],
                        fieldsToReturn || [],
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            const result = yield odooJSONRPCRequest.call(this, body, url);
            return result;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooGet = odooGet;
function odooGetAll(db, userID, password, resource, operation, url, filters, fieldsToReturn, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        exports.mapOperationToJSONRPC[operation],
                        (filters && processFilters(filters)) || [],
                        fieldsToReturn || [],
                        0,
                        limit,
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            const result = yield odooJSONRPCRequest.call(this, body, url);
            return result;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooGetAll = odooGetAll;
function odooUpdate(db, userID, password, resource, operation, url, itemsID, fieldsToUpdate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!Object.keys(fieldsToUpdate).length) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                    status: 'Error',
                    message: `Please specify at least one field to update`,
                });
            }
            if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                    status: 'Error',
                    message: `Please specify a valid ID: ${itemsID}`,
                });
            }
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        exports.mapOperationToJSONRPC[operation],
                        [+itemsID] || [],
                        fieldsToUpdate,
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            yield odooJSONRPCRequest.call(this, body, url);
            return { id: itemsID };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooUpdate = odooUpdate;
function odooDelete(db, userID, password, resource, operation, url, itemsID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                status: 'Error',
                message: `Please specify a valid ID: ${itemsID}`,
            });
        }
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: serviceJSONRPC,
                    method: methodJSONRPC,
                    args: [
                        db,
                        userID,
                        password,
                        exports.mapOdooResources[resource] || resource,
                        exports.mapOperationToJSONRPC[operation],
                        [+itemsID] || [],
                    ],
                },
                id: Math.floor(Math.random() * 100),
            };
            yield odooJSONRPCRequest.call(this, body, url);
            return { success: true };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooDelete = odooDelete;
function odooGetUserID(db, username, password, url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'login',
                    args: [db, username, password],
                },
                id: Math.floor(Math.random() * 100),
            };
            const loginResult = yield odooJSONRPCRequest.call(this, body, url);
            return loginResult;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooGetUserID = odooGetUserID;
function odooGetServerVersion(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'version',
                    args: [],
                },
                id: Math.floor(Math.random() * 100),
            };
            const result = yield odooJSONRPCRequest.call(this, body, url);
            return result;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.odooGetServerVersion = odooGetServerVersion;
