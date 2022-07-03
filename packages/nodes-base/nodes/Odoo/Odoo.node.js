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
exports.Odoo = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class Odoo {
    constructor() {
        this.description = {
            displayName: 'Odoo',
            name: 'odoo',
            icon: 'file:odoo.svg',
            group: ['transform'],
            version: 1,
            description: 'Consume Odoo API',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'Odoo',
                color: '#714B67',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'odooApi',
                    required: true,
                    testedBy: 'odooApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    default: 'contact',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Custom Resource',
                            value: 'custom',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                        {
                            name: 'Opportunity',
                            value: 'opportunity',
                        },
                    ],
                },
                ...descriptions_1.customResourceOperations,
                ...descriptions_1.customResourceDescription,
                ...descriptions_1.opportunityOperations,
                ...descriptions_1.opportunityDescription,
                ...descriptions_1.contactOperations,
                ...descriptions_1.contactDescription,
                ...descriptions_1.noteOperations,
                ...descriptions_1.noteDescription,
            ],
        };
        this.methods = {
            loadOptions: {
                getModelFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let resource;
                        resource = this.getCurrentNodeParameter('resource');
                        if (resource === 'custom') {
                            resource = this.getCurrentNodeParameter('customResource');
                            if (!resource)
                                return [];
                        }
                        const credentials = yield this.getCredentials('odooApi');
                        const url = credentials.url;
                        const username = credentials.username;
                        const password = credentials.password;
                        const db = (0, GenericFunctions_1.odooGetDBName)(credentials.db, url);
                        const userID = yield GenericFunctions_1.odooGetUserID.call(this, db, username, password, url);
                        const responce = yield GenericFunctions_1.odooGetModelFields.call(this, db, userID, password, resource, url);
                        const options = Object.values(responce).map((field) => {
                            const optionField = field;
                            return {
                                name: (0, change_case_1.capitalCase)(optionField.name),
                                value: optionField.name,
                                // nodelinter-ignore-next-line
                                description: `name: ${optionField === null || optionField === void 0 ? void 0 : optionField.name}, type: ${optionField === null || optionField === void 0 ? void 0 : optionField.type} required: ${optionField === null || optionField === void 0 ? void 0 : optionField.required}`,
                            };
                        });
                        return options.sort((a, b) => { var _a; return ((_a = a.name) === null || _a === void 0 ? void 0 : _a.localeCompare(b.name)) || 0; });
                    });
                },
                getModels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('odooApi');
                        const url = credentials.url;
                        const username = credentials.username;
                        const password = credentials.password;
                        const db = (0, GenericFunctions_1.odooGetDBName)(credentials.db, url);
                        const userID = yield GenericFunctions_1.odooGetUserID.call(this, db, username, password, url);
                        const body = {
                            jsonrpc: '2.0',
                            method: 'call',
                            params: {
                                service: 'object',
                                method: 'execute',
                                args: [
                                    db,
                                    userID,
                                    password,
                                    'ir.model',
                                    'search_read',
                                    [],
                                    ['name', 'model', 'modules'],
                                ],
                            },
                            id: Math.floor(Math.random() * 100),
                        };
                        const responce = (yield GenericFunctions_1.odooJSONRPCRequest.call(this, body, url));
                        const options = responce.map((model) => {
                            return {
                                name: model.name,
                                value: model.model,
                                description: `model: ${model.model}<br> modules: ${model.modules}`,
                            };
                        });
                        return options;
                    });
                },
                getStates() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('odooApi');
                        const url = credentials.url;
                        const username = credentials.username;
                        const password = credentials.password;
                        const db = (0, GenericFunctions_1.odooGetDBName)(credentials.db, url);
                        const userID = yield GenericFunctions_1.odooGetUserID.call(this, db, username, password, url);
                        const body = {
                            jsonrpc: '2.0',
                            method: 'call',
                            params: {
                                service: 'object',
                                method: 'execute',
                                args: [db, userID, password, 'res.country.state', 'search_read', [], ['id', 'name']],
                            },
                            id: Math.floor(Math.random() * 100),
                        };
                        const responce = (yield GenericFunctions_1.odooJSONRPCRequest.call(this, body, url));
                        const options = responce.map((state) => {
                            return {
                                name: state.name,
                                value: state.id,
                            };
                        });
                        return options.sort((a, b) => { var _a; return ((_a = a.name) === null || _a === void 0 ? void 0 : _a.localeCompare(b.name)) || 0; });
                    });
                },
                getCountries() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('odooApi');
                        const url = credentials.url;
                        const username = credentials.username;
                        const password = credentials.password;
                        const db = (0, GenericFunctions_1.odooGetDBName)(credentials.db, url);
                        const userID = yield GenericFunctions_1.odooGetUserID.call(this, db, username, password, url);
                        const body = {
                            jsonrpc: '2.0',
                            method: 'call',
                            params: {
                                service: 'object',
                                method: 'execute',
                                args: [db, userID, password, 'res.country', 'search_read', [], ['id', 'name']],
                            },
                            id: Math.floor(Math.random() * 100),
                        };
                        const responce = (yield GenericFunctions_1.odooJSONRPCRequest.call(this, body, url));
                        const options = responce.map((country) => {
                            return {
                                name: country.name,
                                value: country.id,
                            };
                        });
                        return options.sort((a, b) => { var _a; return ((_a = a.name) === null || _a === void 0 ? void 0 : _a.localeCompare(b.name)) || 0; });
                    });
                },
            },
            credentialTest: {
                odooApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        try {
                            const body = {
                                jsonrpc: '2.0',
                                method: 'call',
                                params: {
                                    service: 'common',
                                    method: 'login',
                                    args: [(0, GenericFunctions_1.odooGetDBName)(credentials === null || credentials === void 0 ? void 0 : credentials.db, credentials === null || credentials === void 0 ? void 0 : credentials.url), credentials === null || credentials === void 0 ? void 0 : credentials.username, credentials === null || credentials === void 0 ? void 0 : credentials.password],
                                },
                                id: Math.floor(Math.random() * 100),
                            };
                            const options = {
                                headers: {
                                    'User-Agent': 'n8n',
                                    Connection: 'keep-alive',
                                    Accept: '*/*',
                                    'Content-Type': 'application/json',
                                },
                                method: 'POST',
                                body,
                                uri: `${(credentials === null || credentials === void 0 ? void 0 : credentials.url).replace(/\/$/, '')}/jsonrpc`,
                                json: true,
                            };
                            const result = yield this.helpers.request(options);
                            if (result.error || !result.result) {
                                return {
                                    status: 'Error',
                                    message: `Credentials are not valid`,
                                };
                            }
                            else if (result.error) {
                                return {
                                    status: 'Error',
                                    message: `Credentials are not valid: ${result.error.data.message}`,
                                };
                            }
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: `Settings are not valid: ${error}`,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Authentication successful!',
                        };
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this.getInputData();
            items = JSON.parse(JSON.stringify(items));
            const returnData = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const credentials = yield this.getCredentials('odooApi');
            const url = credentials.url.replace(/\/$/, '');
            const username = credentials.username;
            const password = credentials.password;
            const db = (0, GenericFunctions_1.odooGetDBName)(credentials.db, url);
            const userID = yield GenericFunctions_1.odooGetUserID.call(this, db, username, password, url);
            //----------------------------------------------------------------------
            //                            Main loop
            //----------------------------------------------------------------------
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'contact') {
                        if (operation === 'create') {
                            let additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.address) {
                                const addressFields = additionalFields.address.value;
                                if (addressFields) {
                                    additionalFields = Object.assign(Object.assign({}, additionalFields), addressFields);
                                }
                                delete additionalFields.address;
                            }
                            const name = this.getNodeParameter('contactName', i);
                            const fields = Object.assign({ name }, additionalFields);
                            responseData = yield GenericFunctions_1.odooCreate.call(this, db, userID, password, resource, operation, url, fields);
                        }
                        if (operation === 'delete') {
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.odooDelete.call(this, db, userID, password, resource, operation, url, contactId);
                        }
                        if (operation === 'get') {
                            const contactId = this.getNodeParameter('contactId', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            responseData = yield GenericFunctions_1.odooGet.call(this, db, userID, password, resource, operation, url, contactId, fields);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, fields);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, // filters, only for custom resource
                                fields, limit);
                            }
                        }
                        if (operation === 'update') {
                            const contactId = this.getNodeParameter('contactId', i);
                            let updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.address) {
                                const addressFields = updateFields.address.value;
                                if (addressFields) {
                                    updateFields = Object.assign(Object.assign({}, updateFields), addressFields);
                                }
                                delete updateFields.address;
                            }
                            responseData = yield GenericFunctions_1.odooUpdate.call(this, db, userID, password, resource, operation, url, contactId, updateFields);
                        }
                    }
                    if (resource === 'custom') {
                        const customResource = this.getNodeParameter('customResource', i);
                        if (operation === 'create') {
                            const fields = this.getNodeParameter('fieldsToCreateOrUpdate', i);
                            responseData = yield GenericFunctions_1.odooCreate.call(this, db, userID, password, customResource, operation, url, (0, GenericFunctions_1.processNameValueFields)(fields));
                        }
                        if (operation === 'delete') {
                            const customResourceId = this.getNodeParameter('customResourceId', i);
                            responseData = yield GenericFunctions_1.odooDelete.call(this, db, userID, password, customResource, operation, url, customResourceId);
                        }
                        if (operation === 'get') {
                            const customResourceId = this.getNodeParameter('customResourceId', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            responseData = yield GenericFunctions_1.odooGet.call(this, db, userID, password, customResource, operation, url, customResourceId, fields);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            const filter = this.getNodeParameter('filterRequest', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, customResource, operation, url, filter, fields);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, customResource, operation, url, filter, fields, limit);
                            }
                        }
                        if (operation === 'update') {
                            const customResourceId = this.getNodeParameter('customResourceId', i);
                            const fields = this.getNodeParameter('fieldsToCreateOrUpdate', i);
                            responseData = yield GenericFunctions_1.odooUpdate.call(this, db, userID, password, customResource, operation, url, customResourceId, (0, GenericFunctions_1.processNameValueFields)(fields));
                        }
                    }
                    if (resource === 'note') {
                        if (operation === 'create') {
                            // const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
                            const memo = this.getNodeParameter('memo', i);
                            const fields = {
                                memo,
                                // ...additionalFields,
                            };
                            responseData = yield GenericFunctions_1.odooCreate.call(this, db, userID, password, resource, operation, url, fields);
                        }
                        if (operation === 'delete') {
                            const noteId = this.getNodeParameter('noteId', i);
                            responseData = yield GenericFunctions_1.odooDelete.call(this, db, userID, password, resource, operation, url, noteId);
                        }
                        if (operation === 'get') {
                            const noteId = this.getNodeParameter('noteId', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            responseData = yield GenericFunctions_1.odooGet.call(this, db, userID, password, resource, operation, url, noteId, fields);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, fields);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, // filters, only for custom resource
                                fields, limit);
                            }
                        }
                        if (operation === 'update') {
                            const noteId = this.getNodeParameter('noteId', i);
                            const memo = this.getNodeParameter('memo', i);
                            const fields = {
                                memo,
                            };
                            responseData = yield GenericFunctions_1.odooUpdate.call(this, db, userID, password, resource, operation, url, noteId, fields);
                        }
                    }
                    if (resource === 'opportunity') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const name = this.getNodeParameter('opportunityName', i);
                            const fields = Object.assign({ name }, additionalFields);
                            responseData = yield GenericFunctions_1.odooCreate.call(this, db, userID, password, resource, operation, url, fields);
                        }
                        if (operation === 'delete') {
                            const opportunityId = this.getNodeParameter('opportunityId', i);
                            responseData = yield GenericFunctions_1.odooDelete.call(this, db, userID, password, resource, operation, url, opportunityId);
                        }
                        if (operation === 'get') {
                            const opportunityId = this.getNodeParameter('opportunityId', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            responseData = yield GenericFunctions_1.odooGet.call(this, db, userID, password, resource, operation, url, opportunityId, fields);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const fields = options.fieldsList || [];
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, fields);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.odooGetAll.call(this, db, userID, password, resource, operation, url, undefined, // filters, only for custom resource
                                fields, limit);
                            }
                        }
                        if (operation === 'update') {
                            const opportunityId = this.getNodeParameter('opportunityId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            responseData = yield GenericFunctions_1.odooUpdate.call(this, db, userID, password, resource, operation, url, opportunityId, updateFields);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Odoo = Odoo;
