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
exports.Strapi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const EntryDescription_1 = require("./EntryDescription");
class Strapi {
    constructor() {
        this.description = {
            displayName: 'Strapi',
            name: 'strapi',
            icon: 'file:strapi.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Strapi API',
            defaults: {
                name: 'Strapi',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'strapiApi',
                    required: true,
                    testedBy: 'strapiApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    noDataExpression: true,
                    type: 'options',
                    options: [
                        {
                            name: 'Entry',
                            value: 'entry',
                        },
                    ],
                    default: 'entry',
                },
                ...EntryDescription_1.entryOperations,
                ...EntryDescription_1.entryFields,
            ],
        };
        this.methods = {
            credentialTest: {
                strapiApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield credential.data;
                        let options = {};
                        options = {
                            headers: {
                                'content-type': `application/json`,
                            },
                            method: 'POST',
                            body: {
                                identifier: credentials.email,
                                password: credentials.password,
                            },
                            uri: credentials.apiVersion === 'v4' ? `${credentials.url}/api/auth/local` : `${credentials.url}/auth/local`,
                            json: true,
                        };
                        try {
                            yield this.helpers.request(options);
                            return {
                                status: 'OK',
                                message: 'Authentication successful',
                            };
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: `Auth settings are not valid: ${error}`,
                            };
                        }
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            const headers = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const { apiVersion } = yield this.getCredentials('strapiApi');
            const { jwt } = yield GenericFunctions_1.getToken.call(this);
            headers.Authorization = `Bearer ${jwt}`;
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'entry') {
                        if (operation === 'create') {
                            const body = {};
                            const contentType = this.getNodeParameter('contentType', i);
                            const columns = this.getNodeParameter('columns', i);
                            const columnList = columns.split(',').map(column => column.trim());
                            for (const key of Object.keys(items[i].json)) {
                                if (columnList.includes(key)) {
                                    apiVersion === 'v4' ? body.data = items[i].json : body[key] = items[i].json[key];
                                }
                            }
                            responseData = yield GenericFunctions_1.strapiApiRequest.call(this, 'POST', `/${contentType}`, body, qs, undefined, headers);
                            returnData.push(responseData);
                        }
                        if (operation === 'delete') {
                            const contentType = this.getNodeParameter('contentType', i);
                            const entryId = this.getNodeParameter('entryId', i);
                            responseData = yield GenericFunctions_1.strapiApiRequest.call(this, 'DELETE', `/${contentType}/${entryId}`, {}, qs, undefined, headers);
                            returnData.push(responseData);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const contentType = this.getNodeParameter('contentType', i);
                            const options = this.getNodeParameter('options', i);
                            if (apiVersion === 'v4') {
                                // Sort Option
                                if (options.sort && options.sort.length !== 0) {
                                    const sortFields = options.sort;
                                    qs.sort = sortFields.join(',');
                                }
                                // Filter Option
                                if (options.where) {
                                    const query = (0, GenericFunctions_1.validateJSON)(options.where);
                                    if (query !== undefined) {
                                        qs.filters = query;
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Query must be a valid JSON');
                                    }
                                }
                                // Publication Option
                                if (options.publicationState) {
                                    qs.publicationState = options.publicationState;
                                }
                                // Limit Option
                                if (returnAll) {
                                    responseData = yield GenericFunctions_1.strapiApiRequestAllItems.call(this, 'GET', `/${contentType}`, {}, qs, headers);
                                }
                                else {
                                    qs['pagination[pageSize]'] = this.getNodeParameter('limit', i);
                                    ({ data: responseData } = yield GenericFunctions_1.strapiApiRequest.call(this, 'GET', `/${contentType}`, {}, qs, undefined, headers));
                                }
                            }
                            else {
                                // Sort Option
                                if (options.sort && options.sort.length !== 0) {
                                    const sortFields = options.sort;
                                    qs._sort = sortFields.join(',');
                                }
                                // Filter Option
                                if (options.where) {
                                    const query = (0, GenericFunctions_1.validateJSON)(options.where);
                                    if (query !== undefined) {
                                        qs._where = query;
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Query must be a valid JSON');
                                    }
                                }
                                // Publication Option
                                if (options.publicationState) {
                                    qs._publicationState = options.publicationState;
                                }
                                // Limit Option
                                if (returnAll) {
                                    responseData = yield GenericFunctions_1.strapiApiRequestAllItems.call(this, 'GET', `/${contentType}`, {}, qs, headers);
                                }
                                else {
                                    qs._limit = this.getNodeParameter('limit', i);
                                    responseData = yield GenericFunctions_1.strapiApiRequest.call(this, 'GET', `/${contentType}`, {}, qs, undefined, headers);
                                }
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        if (operation === 'get') {
                            const contentType = this.getNodeParameter('contentType', i);
                            const entryId = this.getNodeParameter('entryId', i);
                            responseData = yield GenericFunctions_1.strapiApiRequest.call(this, 'GET', `/${contentType}/${entryId}`, {}, qs, undefined, headers);
                            apiVersion === 'v4' ? returnData.push(responseData.data) : returnData.push(responseData);
                        }
                        if (operation === 'update') {
                            const body = {};
                            const contentType = this.getNodeParameter('contentType', i);
                            const columns = this.getNodeParameter('columns', i);
                            const updateKey = this.getNodeParameter('updateKey', i);
                            const columnList = columns.split(',').map(column => column.trim());
                            const entryId = items[i].json[updateKey];
                            for (const key of Object.keys(items[i].json)) {
                                if (columnList.includes(key)) {
                                    apiVersion === 'v4' ? body.data = items[i].json : body[key] = items[i].json[key];
                                }
                            }
                            responseData = yield GenericFunctions_1.strapiApiRequest.call(this, 'PUT', `/${contentType}/${entryId}`, body, qs, undefined, headers);
                            apiVersion === 'v4' ? returnData.push(responseData.data) : returnData.push(responseData);
                        }
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
exports.Strapi = Strapi;
