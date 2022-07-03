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
exports.Supabase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const RowDescription_1 = require("./RowDescription");
class Supabase {
    constructor() {
        this.description = {
            displayName: 'Supabase',
            name: 'supabase',
            icon: 'file:supabase.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Add, get, delete and update data in a table',
            defaults: {
                name: 'Supabase',
                color: '#ea5929',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'supabaseApi',
                    required: true,
                    testedBy: 'supabaseApiCredentialTest',
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
                ...RowDescription_1.rowOperations,
                ...RowDescription_1.rowFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { paths } = yield GenericFunctions_1.supabaseApiRequest.call(this, 'GET', '/');
                        for (const path of Object.keys(paths)) {
                            //omit introspection path
                            if (path === '/')
                                continue;
                            returnData.push({
                                name: path.replace('/', ''),
                                value: path.replace('/', ''),
                            });
                        }
                        return returnData;
                    });
                },
                getTableColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tableName = this.getCurrentNodeParameter('tableId');
                        const { definitions } = yield GenericFunctions_1.supabaseApiRequest.call(this, 'GET', '/');
                        for (const column of Object.keys(definitions[tableName].properties)) {
                            returnData.push({
                                name: `${column} - (${definitions[tableName].properties[column].type})`,
                                value: column,
                            });
                        }
                        return returnData;
                    });
                },
            },
            credentialTest: {
                supabaseApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: 'The Service Key is invalid',
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'row') {
                if (operation === 'create') {
                    const records = [];
                    const tableId = this.getNodeParameter('tableId', 0);
                    for (let i = 0; i < length; i++) {
                        const record = {};
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputDataToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputDataToIgnore.includes(key))
                                    continue;
                                record[key] = items[i].json[key];
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                record[`${field.fieldId}`] = field.fieldValue;
                            }
                        }
                        records.push(record);
                    }
                    const endpoint = `/${tableId}`;
                    let createdRow;
                    try {
                        createdRow = yield GenericFunctions_1.supabaseApiRequest.call(this, 'POST', endpoint, records);
                        returnData.push(...createdRow);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.description });
                        }
                        else {
                            throw error;
                        }
                    }
                }
                if (operation === 'delete') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const filterType = this.getNodeParameter('filterType', 0);
                    let endpoint = `/${tableId}`;
                    for (let i = 0; i < length; i++) {
                        if (filterType === 'manual') {
                            const matchType = this.getNodeParameter('matchType', 0);
                            const keys = this.getNodeParameter('filters.conditions', i, []);
                            if (!keys.length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined');
                            }
                            if (matchType === 'allFilters') {
                                const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildQuery)(obj, value), {});
                                Object.assign(qs, data);
                            }
                            if (matchType === 'anyFilter') {
                                const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                                Object.assign(qs, { or: `(${data.join(',')})` });
                            }
                        }
                        if (filterType === 'string') {
                            const filterString = this.getNodeParameter('filterString', i);
                            endpoint = `${endpoint}?${encodeURI(filterString)}`;
                        }
                        let rows;
                        try {
                            rows = yield GenericFunctions_1.supabaseApiRequest.call(this, 'DELETE', endpoint, {}, qs);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.description });
                                continue;
                            }
                        }
                        returnData.push(...rows);
                    }
                }
                if (operation === 'get') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const endpoint = `/${tableId}`;
                    for (let i = 0; i < length; i++) {
                        const keys = this.getNodeParameter('filters.conditions', i, []);
                        const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildGetQuery)(obj, value), {});
                        Object.assign(qs, data);
                        let rows;
                        if (!keys.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined');
                        }
                        try {
                            rows = yield GenericFunctions_1.supabaseApiRequest.call(this, 'GET', endpoint, {}, qs);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.description });
                                continue;
                            }
                        }
                        returnData.push(...rows);
                    }
                }
                if (operation === 'getAll') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    const filterType = this.getNodeParameter('filterType', 0);
                    let endpoint = `/${tableId}`;
                    for (let i = 0; i < length; i++) {
                        if (filterType === 'manual') {
                            const matchType = this.getNodeParameter('matchType', 0);
                            const keys = this.getNodeParameter('filters.conditions', i, []);
                            if (keys.length !== 0) {
                                if (matchType === 'allFilters') {
                                    const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildQuery)(obj, value), {});
                                    Object.assign(qs, data);
                                }
                                if (matchType === 'anyFilter') {
                                    const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                                    Object.assign(qs, { or: `(${data.join(',')})` });
                                }
                            }
                        }
                        if (filterType === 'string') {
                            const filterString = this.getNodeParameter('filterString', i);
                            endpoint = `${endpoint}?${encodeURI(filterString)}`;
                        }
                        if (returnAll === false) {
                            qs.limit = this.getNodeParameter('limit', 0);
                        }
                        let rows;
                        try {
                            rows = yield GenericFunctions_1.supabaseApiRequest.call(this, 'GET', endpoint, {}, qs);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.description });
                                continue;
                            }
                        }
                        returnData.push(...rows);
                    }
                }
                if (operation === 'update') {
                    const tableId = this.getNodeParameter('tableId', 0);
                    const filterType = this.getNodeParameter('filterType', 0);
                    let endpoint = `/${tableId}`;
                    for (let i = 0; i < length; i++) {
                        if (filterType === 'manual') {
                            const matchType = this.getNodeParameter('matchType', 0);
                            const keys = this.getNodeParameter('filters.conditions', i, []);
                            if (!keys.length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined');
                            }
                            if (matchType === 'allFilters') {
                                const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildQuery)(obj, value), {});
                                Object.assign(qs, data);
                            }
                            if (matchType === 'anyFilter') {
                                const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                                Object.assign(qs, { or: `(${data.join(',')})` });
                            }
                        }
                        if (filterType === 'string') {
                            const filterString = this.getNodeParameter('filterString', i);
                            endpoint = `${endpoint}?${encodeURI(filterString)}`;
                        }
                        const record = {};
                        const dataToSend = this.getNodeParameter('dataToSend', 0);
                        if (dataToSend === 'autoMapInputData') {
                            const incomingKeys = Object.keys(items[i].json);
                            const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                            const inputDataToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                            for (const key of incomingKeys) {
                                if (inputDataToIgnore.includes(key))
                                    continue;
                                record[key] = items[i].json[key];
                            }
                        }
                        else {
                            const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            for (const field of fields) {
                                record[`${field.fieldId}`] = field.fieldValue;
                            }
                        }
                        let updatedRow;
                        try {
                            updatedRow = yield GenericFunctions_1.supabaseApiRequest.call(this, 'PATCH', endpoint, record, qs);
                            returnData.push(...updatedRow);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.description });
                                continue;
                            }
                        }
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Supabase = Supabase;
