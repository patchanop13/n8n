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
exports.NocoDB = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const OperationDescription_1 = require("./OperationDescription");
class NocoDB {
    constructor() {
        this.description = {
            displayName: 'NocoDB',
            name: 'nocoDb',
            icon: 'file:nocodb.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Read, update, write and delete data from NocoDB',
            defaults: {
                name: 'NocoDB',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'nocoDb',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Row',
                            value: 'row',
                        },
                    ],
                    default: 'row',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'row',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a row',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a row',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve a row',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Retrieve all rows',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a row',
                        },
                    ],
                    default: 'get',
                },
                ...OperationDescription_1.operationFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const projectId = this.getNodeParameter('projectId', 0);
            const table = this.getNodeParameter('table', 0);
            let returnAll = false;
            let endpoint = '';
            let requestMethod = '';
            let qs = {};
            if (resource === 'row') {
                if (operation === 'create') {
                    requestMethod = 'POST';
                    endpoint = `/nc/${projectId}/api/v1/${table}/bulk`;
                    const body = [];
                    for (let i = 0; i < items.length; i++) {
                        const newItem = {};
                        const dataToSend = this.getNodeParameter('dataToSend', i);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputDataToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputDataToIgnore.includes(key))
                                    continue;
                                newItem[key] = items[i].json[key];
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                if (!field.binaryData) {
                                    newItem[field.fieldName] = field.fieldValue;
                                }
                                else if (field.binaryProperty) {
                                    if (!items[i].binary) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                    }
                                    const binaryPropertyName = field.binaryProperty;
                                    if (binaryPropertyName && !items[i].binary[binaryPropertyName]) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Binary property ${binaryPropertyName} does not exist on item!`);
                                    }
                                    const binaryData = items[i].binary[binaryPropertyName];
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                    const formData = {
                                        file: {
                                            value: dataBuffer,
                                            options: {
                                                filename: binaryData.fileName,
                                                contentType: binaryData.mimeType,
                                            },
                                        },
                                        json: JSON.stringify({
                                            api: 'xcAttachmentUpload',
                                            project_id: projectId,
                                            dbAlias: 'db',
                                            args: {},
                                        }),
                                    };
                                    const qs = { project_id: projectId };
                                    responseData = yield GenericFunctions_1.apiRequest.call(this, 'POST', '/dashboard', {}, qs, undefined, { formData });
                                    newItem[field.fieldName] = JSON.stringify([responseData]);
                                }
                            }
                        }
                        body.push(newItem);
                    }
                    try {
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                        // Calculate ID manually and add to return data
                        let id = responseData[0];
                        for (let i = body.length - 1; i >= 0; i--) {
                            body[i].id = id--;
                        }
                        returnData.push(...body);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.toString() });
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                }
                else if (operation === 'delete') {
                    requestMethod = 'DELETE';
                    endpoint = `/nc/${projectId}/api/v1/${table}/bulk`;
                    const body = [];
                    for (let i = 0; i < items.length; i++) {
                        const id = this.getNodeParameter('id', i);
                        body.push({ id });
                    }
                    try {
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                        returnData.push(...items.map(item => item.json));
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.toString() });
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                }
                else if (operation === 'getAll') {
                    const data = [];
                    const downloadAttachments = this.getNodeParameter('downloadAttachments', 0);
                    try {
                        for (let i = 0; i < items.length; i++) {
                            requestMethod = 'GET';
                            endpoint = `/nc/${projectId}/api/v1/${table}`;
                            returnAll = this.getNodeParameter('returnAll', 0);
                            qs = this.getNodeParameter('options', i, {});
                            if (qs.sort) {
                                const properties = qs.sort.property;
                                qs.sort = properties.map(prop => `${prop.direction === 'asc' ? '' : '-'}${prop.field}`).join(',');
                            }
                            if (qs.fields) {
                                qs.fields = qs.fields.join(',');
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.apiRequestAllItems.call(this, requestMethod, endpoint, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, {}, qs);
                            }
                            returnData.push.apply(returnData, responseData);
                            if (downloadAttachments === true) {
                                const downloadFieldNames = this.getNodeParameter('downloadFieldNames', 0).split(',');
                                const response = yield GenericFunctions_1.downloadRecordAttachments.call(this, responseData, downloadFieldNames);
                                data.push(...response);
                            }
                        }
                        if (downloadAttachments) {
                            return [data];
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.toString() });
                        }
                        throw error;
                    }
                }
                else if (operation === 'get') {
                    requestMethod = 'GET';
                    const newItems = [];
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const id = this.getNodeParameter('id', i);
                            endpoint = `/nc/${projectId}/api/v1/${table}/${id}`;
                            responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, {}, qs);
                            const newItem = { json: responseData };
                            const downloadAttachments = this.getNodeParameter('downloadAttachments', i);
                            if (downloadAttachments === true) {
                                const downloadFieldNames = this.getNodeParameter('downloadFieldNames', i).split(',');
                                const data = yield GenericFunctions_1.downloadRecordAttachments.call(this, [responseData], downloadFieldNames);
                                newItem.binary = data[0].binary;
                            }
                            newItems.push(newItem);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                newItems.push({ json: { error: error.toString() } });
                                continue;
                            }
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                    }
                    return this.prepareOutputData(newItems);
                }
                else if (operation === 'update') {
                    requestMethod = 'PUT';
                    endpoint = `/nc/${projectId}/api/v1/${table}/bulk`;
                    const body = [];
                    for (let i = 0; i < items.length; i++) {
                        const id = this.getNodeParameter('id', i);
                        const newItem = { id };
                        const dataToSend = this.getNodeParameter('dataToSend', i);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputDataToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputDataToIgnore.includes(key))
                                    continue;
                                newItem[key] = items[i].json[key];
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                if (!field.upload) {
                                    newItem[field.fieldName] = field.fieldValue;
                                }
                                else if (field.binaryProperty) {
                                    if (!items[i].binary) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                    }
                                    const binaryPropertyName = field.binaryProperty;
                                    if (binaryPropertyName && !items[i].binary[binaryPropertyName]) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Binary property ${binaryPropertyName} does not exist on item!`);
                                    }
                                    const binaryData = items[i].binary[binaryPropertyName];
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                    const formData = {
                                        file: {
                                            value: dataBuffer,
                                            options: {
                                                filename: binaryData.fileName,
                                                contentType: binaryData.mimeType,
                                            },
                                        },
                                        json: JSON.stringify({
                                            api: 'xcAttachmentUpload',
                                            project_id: projectId,
                                            dbAlias: 'db',
                                            args: {},
                                        }),
                                    };
                                    const qs = { project_id: projectId };
                                    responseData = yield GenericFunctions_1.apiRequest.call(this, 'POST', '/dashboard', {}, qs, undefined, { formData });
                                    newItem[field.fieldName] = JSON.stringify([responseData]);
                                }
                            }
                        }
                        body.push(newItem);
                    }
                    try {
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                        returnData.push(...body);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.toString() });
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.NocoDB = NocoDB;
