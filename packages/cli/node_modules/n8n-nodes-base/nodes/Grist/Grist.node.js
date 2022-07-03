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
exports.Grist = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const OperationDescription_1 = require("./OperationDescription");
class Grist {
    constructor() {
        this.description = {
            displayName: 'Grist',
            name: 'grist',
            icon: 'file:grist.svg',
            subtitle: '={{$parameter["operation"]}}',
            group: ['input'],
            version: 1,
            description: 'Consume the Grist API',
            defaults: {
                name: 'Grist',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'gristApi',
                    required: true,
                    testedBy: 'gristApiTest',
                },
            ],
            properties: OperationDescription_1.operationFields,
        };
        this.methods = {
            loadOptions: {
                getTableColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const docId = this.getNodeParameter('docId', 0);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/docs/${docId}/tables/${tableId}/columns`;
                        const { columns } = yield GenericFunctions_1.gristApiRequest.call(this, 'GET', endpoint);
                        return columns.map(({ id }) => ({ name: id, value: id }));
                    });
                },
            },
            credentialTest: {
                gristApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { apiKey, planType, customSubdomain, selfHostedUrl, } = credential.data;
                        const endpoint = '/orgs';
                        const gristapiurl = (planType === 'free') ? `https://docs.getgrist.com/api${endpoint}` :
                            (planType === 'paid') ? `https://${customSubdomain}.getgrist.com/api${endpoint}` :
                                `${selfHostedUrl}/api${endpoint}`;
                        const options = {
                            headers: {
                                Authorization: `Bearer ${apiKey}`,
                            },
                            method: 'GET',
                            uri: gristapiurl,
                            qs: { limit: 1 },
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
                                message: error.message,
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
            let responseData;
            const returnData = [];
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (operation === 'create') {
                        // ----------------------------------
                        //             create
                        // ----------------------------------
                        // https://support.getgrist.com/api/#tag/records/paths/~1docs~1{docId}~1tables~1{tableId}~1records/post
                        const body = { records: [] };
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputs') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            const fields = (0, GenericFunctions_1.parseAutoMappedInputs)(incomingKeys, inputsToIgnore, items[i].json);
                            body.records.push({ fields });
                        }
                        else if (dataToSend === 'defineInNode') {
                            const { properties } = this.getNodeParameter('fieldsToSend', i, []);
                            GenericFunctions_1.throwOnZeroDefinedFields.call(this, properties);
                            body.records.push({ fields: (0, GenericFunctions_1.parseDefinedFields)(properties) });
                        }
                        const docId = this.getNodeParameter('docId', 0);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                        responseData = yield GenericFunctions_1.gristApiRequest.call(this, 'POST', endpoint, body);
                        responseData = Object.assign({ id: responseData.records[0].id }, body.records[0].fields);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //            delete
                        // ----------------------------------
                        // https://support.getgrist.com/api/#tag/data/paths/~1docs~1{docId}~1tables~1{tableId}~1data~1delete/post
                        const docId = this.getNodeParameter('docId', 0);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/docs/${docId}/tables/${tableId}/data/delete`;
                        const rawRowIds = this.getNodeParameter('rowId', i).toString();
                        const body = rawRowIds.split(',').map(c => c.trim()).map(Number);
                        yield GenericFunctions_1.gristApiRequest.call(this, 'POST', endpoint, body);
                        responseData = { success: true };
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //            update
                        // ----------------------------------
                        // https://support.getgrist.com/api/#tag/records/paths/~1docs~1{docId}~1tables~1{tableId}~1records/patch
                        const body = { records: [] };
                        const rowId = this.getNodeParameter('rowId', i);
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputs') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            const fields = (0, GenericFunctions_1.parseAutoMappedInputs)(incomingKeys, inputsToIgnore, items[i].json);
                            body.records.push({ id: Number(rowId), fields });
                        }
                        else if (dataToSend === 'defineInNode') {
                            const { properties } = this.getNodeParameter('fieldsToSend', i, []);
                            GenericFunctions_1.throwOnZeroDefinedFields.call(this, properties);
                            const fields = (0, GenericFunctions_1.parseDefinedFields)(properties);
                            body.records.push({ id: Number(rowId), fields });
                        }
                        const docId = this.getNodeParameter('docId', 0);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                        yield GenericFunctions_1.gristApiRequest.call(this, 'PATCH', endpoint, body);
                        responseData = Object.assign({ id: rowId }, body.records[0].fields);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //             getAll
                        // ----------------------------------
                        // https://support.getgrist.com/api/#tag/records
                        const docId = this.getNodeParameter('docId', 0);
                        const tableId = this.getNodeParameter('tableId', 0);
                        const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                        const qs = {};
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (!returnAll) {
                            qs.limit = this.getNodeParameter('limit', i);
                        }
                        const { sort, filter } = this.getNodeParameter('additionalOptions', i);
                        if (sort === null || sort === void 0 ? void 0 : sort.sortProperties.length) {
                            qs.sort = (0, GenericFunctions_1.parseSortProperties)(sort.sortProperties);
                        }
                        if (filter === null || filter === void 0 ? void 0 : filter.filterProperties.length) {
                            const parsed = (0, GenericFunctions_1.parseFilterProperties)(filter.filterProperties);
                            qs.filter = JSON.stringify(parsed);
                        }
                        responseData = yield GenericFunctions_1.gristApiRequest.call(this, 'GET', endpoint, {}, qs);
                        responseData = responseData.records.map((data) => {
                            return Object.assign({ id: data.id }, data.fields);
                        });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Grist = Grist;
