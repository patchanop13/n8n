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
exports.QuickBase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const FieldDescription_1 = require("./FieldDescription");
const FileDescription_1 = require("./FileDescription");
const RecordDescription_1 = require("./RecordDescription");
const ReportDescription_1 = require("./ReportDescription");
class QuickBase {
    constructor() {
        this.description = {
            displayName: 'Quick Base',
            name: 'quickbase',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:quickbase.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Integrate with the Quick Base RESTful API',
            defaults: {
                name: 'Quick Base',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'quickbaseApi',
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
                            name: 'Field',
                            value: 'field',
                        },
                        {
                            name: 'File',
                            value: 'file',
                        },
                        {
                            name: 'Record',
                            value: 'record',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                    ],
                    default: 'record',
                },
                ...FieldDescription_1.fieldOperations,
                ...FieldDescription_1.fieldFields,
                ...FileDescription_1.fileOperations,
                ...FileDescription_1.fileFields,
                ...RecordDescription_1.recordOperations,
                ...RecordDescription_1.recordFields,
                ...ReportDescription_1.reportOperations,
                ...ReportDescription_1.reportFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTableFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tableId = this.getCurrentNodeParameter('tableId');
                        const fields = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'GET', '/fields', {}, { tableId });
                        for (const field of fields) {
                            returnData.push({
                                name: field.label,
                                value: field.id,
                            });
                        }
                        return returnData;
                    });
                },
                getUniqueTableFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tableId = this.getCurrentNodeParameter('tableId');
                        const fields = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'GET', '/fields', {}, { tableId });
                        for (const field of fields) {
                            //upsert can be achived just with fields that are set as unique and are no the primary key
                            if (field.unique === true && field.properties.primaryKey === false) {
                                returnData.push({
                                    name: field.label,
                                    value: field.id,
                                });
                            }
                        }
                        return returnData;
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
            if (resource === 'field') {
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const tableId = this.getNodeParameter('tableId', i);
                        const options = this.getNodeParameter('options', i);
                        const qs = {
                            tableId,
                        };
                        Object.assign(qs, options);
                        responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'GET', '/fields', {}, qs);
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            if (resource === 'file') {
                if (operation === 'delete') {
                    for (let i = 0; i < length; i++) {
                        const tableId = this.getNodeParameter('tableId', i);
                        const recordId = this.getNodeParameter('recordId', i);
                        const fieldId = this.getNodeParameter('fieldId', i);
                        const versionNumber = this.getNodeParameter('versionNumber', i);
                        responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'DELETE', `/files/${tableId}/${recordId}/${fieldId}/${versionNumber}`);
                        returnData.push(responseData);
                    }
                }
                if (operation === 'download') {
                    for (let i = 0; i < length; i++) {
                        const tableId = this.getNodeParameter('tableId', i);
                        const recordId = this.getNodeParameter('recordId', i);
                        const fieldId = this.getNodeParameter('fieldId', i);
                        const versionNumber = this.getNodeParameter('versionNumber', i);
                        const newItem = {
                            json: items[i].json,
                            binary: {},
                        };
                        if (items[i].binary !== undefined) {
                            // Create a shallow copy of the binary data so that the old
                            // data references which do not get changed still stay behind
                            // but the incoming data does not get changed.
                            Object.assign(newItem.binary, items[i].binary);
                        }
                        items[i] = newItem;
                        const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                        responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'GET', `/files/${tableId}/${recordId}/${fieldId}/${versionNumber}`, {}, {}, { json: false, resolveWithFullResponse: true });
                        //content-disposition': 'attachment; filename="dog-puppy-on-garden-royalty-free-image-1586966191.jpg"',
                        const contentDisposition = responseData.headers['content-disposition'];
                        const data = Buffer.from(responseData.body, 'base64');
                        items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(data, contentDisposition.split('=')[1]);
                    }
                    return this.prepareOutputData(items);
                }
            }
            if (resource === 'record') {
                if (operation === 'create') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    const data = [];
                    const options = this.getNodeParameter('options', 0);
                    for (let i = 0; i < length; i++) {
                        const record = {};
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        if (options.useFieldIDs === true) {
                            for (const key of Object.keys(items[i].json)) {
                                record[key] = { value: items[i].json[key] };
                            }
                        }
                        else {
                            const { fieldsLabelKey } = yield GenericFunctions_1.getFieldsObject.call(this, tableId);
                            for (const key of Object.keys(items[i].json)) {
                                if (fieldsLabelKey.hasOwnProperty(key) && columnList.includes(key)) {
                                    record[fieldsLabelKey[key].toString()] = { value: items[i].json[key] };
                                }
                            }
                        }
                        data.push(record);
                    }
                    const body = {
                        data,
                        to: tableId,
                    };
                    // If no fields are set return at least the record id
                    // 3 == Default Quickbase RecordID #
                    body.fieldsToReturn = [3];
                    if (options.fields) {
                        body.fieldsToReturn = options.fields;
                    }
                    responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'POST', '/records', body);
                    if (simple === true) {
                        const { data: records } = responseData;
                        responseData = [];
                        for (const record of records) {
                            const data = {};
                            for (const [key, value] of Object.entries(record)) {
                                data[key] = value.value;
                            }
                            responseData.push(data);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                if (operation === 'delete') {
                    for (let i = 0; i < length; i++) {
                        const tableId = this.getNodeParameter('tableId', i);
                        const where = this.getNodeParameter('where', i);
                        const body = {
                            from: tableId,
                            where,
                        };
                        responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'DELETE', '/records', body);
                        returnData.push(responseData);
                    }
                }
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const tableId = this.getNodeParameter('tableId', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {
                            from: tableId,
                        };
                        Object.assign(body, options);
                        if (options.sortByUi) {
                            const sort = options.sortByUi.sortByValues;
                            body.sortBy = sort;
                            delete body.sortByUi;
                        }
                        // if (options.groupByUi) {
                        // 	const group = (options.groupByUi as IDataObject).groupByValues as IDataObject[];
                        // 	body.groupBy = group;
                        // 	delete body.groupByUi;
                        // }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.quickbaseApiRequestAllItems.call(this, 'POST', '/records/query', body, qs);
                        }
                        else {
                            body.options = { top: this.getNodeParameter('limit', i) };
                            responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'POST', '/records/query', body, qs);
                            const { data: records, fields } = responseData;
                            responseData = [];
                            const fieldsIdKey = {};
                            for (const field of fields) {
                                fieldsIdKey[field.id] = field.label;
                            }
                            for (const record of records) {
                                const data = {};
                                for (const [key, value] of Object.entries(record)) {
                                    data[fieldsIdKey[key]] = value.value;
                                }
                                responseData.push(data);
                            }
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (operation === 'update') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const { fieldsLabelKey, fieldsIdKey } = yield GenericFunctions_1.getFieldsObject.call(this, tableId);
                    const simple = this.getNodeParameter('simple', 0);
                    const updateKey = this.getNodeParameter('updateKey', 0);
                    const data = [];
                    const options = this.getNodeParameter('options', 0);
                    for (let i = 0; i < length; i++) {
                        const record = {};
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        if (options.useFieldIDs === true) {
                            for (const key of Object.keys(items[i].json)) {
                                record[key] = { value: items[i].json[key] };
                            }
                        }
                        else {
                            const { fieldsLabelKey } = yield GenericFunctions_1.getFieldsObject.call(this, tableId);
                            for (const key of Object.keys(items[i].json)) {
                                if (fieldsLabelKey.hasOwnProperty(key) && columnList.includes(key)) {
                                    record[fieldsLabelKey[key].toString()] = { value: items[i].json[key] };
                                }
                            }
                        }
                        if (items[i].json[updateKey] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The update key ${updateKey} could not be found in the input`);
                        }
                        data.push(record);
                    }
                    const body = {
                        data,
                        to: tableId,
                    };
                    // If no fields are set return at least the record id
                    // 3 == Default Quickbase RecordID #
                    //body.fieldsToReturn = [fieldsLabelKey['Record ID#']];
                    if (options.fields) {
                        body.fieldsToReturn = options.fields;
                    }
                    responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'POST', '/records', body);
                    if (simple === true) {
                        const { data: records } = responseData;
                        responseData = [];
                        for (const record of records) {
                            const data = {};
                            for (const [key, value] of Object.entries(record)) {
                                data[fieldsIdKey[key]] = value.value;
                            }
                            responseData.push(data);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                if (operation === 'upsert') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    const updateKey = this.getNodeParameter('updateKey', 0);
                    const mergeFieldId = this.getNodeParameter('mergeFieldId', 0);
                    const data = [];
                    const options = this.getNodeParameter('options', 0);
                    for (let i = 0; i < length; i++) {
                        const record = {};
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        if (options.useFieldIDs === true) {
                            for (const key of Object.keys(items[i].json)) {
                                record[key] = { value: items[i].json[key] };
                            }
                        }
                        else {
                            const { fieldsLabelKey } = yield GenericFunctions_1.getFieldsObject.call(this, tableId);
                            for (const key of Object.keys(items[i].json)) {
                                if (fieldsLabelKey.hasOwnProperty(key) && columnList.includes(key)) {
                                    record[fieldsLabelKey[key].toString()] = { value: items[i].json[key] };
                                }
                            }
                        }
                        if (items[i].json[updateKey] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The update key ${updateKey} could not be found in the input`);
                        }
                        record[mergeFieldId] = { value: items[i].json[updateKey] };
                        data.push(record);
                    }
                    const body = {
                        data,
                        to: tableId,
                        mergeFieldId,
                    };
                    // If no fields are set return at least the record id
                    // 3 == Default Quickbase RecordID #
                    body.fieldsToReturn = [3];
                    if (options.fields) {
                        body.fieldsToReturn = options.fields;
                    }
                    responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'POST', '/records', body);
                    if (simple === true) {
                        const { data: records } = responseData;
                        responseData = [];
                        for (const record of records) {
                            const data = {};
                            for (const [key, value] of Object.entries(record)) {
                                data[key] = value.value;
                            }
                            responseData.push(data);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
            }
            if (resource === 'report') {
                if (operation === 'run') {
                    for (let i = 0; i < length; i++) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const tableId = this.getNodeParameter('tableId', i);
                        const reportId = this.getNodeParameter('reportId', i);
                        qs.tableId = tableId;
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.quickbaseApiRequestAllItems.call(this, 'POST', `/reports/${reportId}/run`, {}, qs);
                        }
                        else {
                            qs.top = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'POST', `/reports/${reportId}/run`, {}, qs);
                            const { data: records, fields } = responseData;
                            responseData = [];
                            const fieldsIdKey = {};
                            for (const field of fields) {
                                fieldsIdKey[field.id] = field.label;
                            }
                            for (const record of records) {
                                const data = {};
                                for (const [key, value] of Object.entries(record)) {
                                    data[fieldsIdKey[key]] = value.value;
                                }
                                responseData.push(data);
                            }
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        const reportId = this.getNodeParameter('reportId', i);
                        const tableId = this.getNodeParameter('tableId', i);
                        qs.tableId = tableId;
                        responseData = yield GenericFunctions_1.quickbaseApiRequest.call(this, 'GET', `/reports/${reportId}`, {}, qs);
                        returnData.push(responseData);
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.QuickBase = QuickBase;
