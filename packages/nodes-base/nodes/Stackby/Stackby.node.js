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
exports.Stackby = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunction_1 = require("./GenericFunction");
class Stackby {
    constructor() {
        this.description = {
            displayName: 'Stackby',
            name: 'stackby',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:stackby.png',
            group: ['transform'],
            version: 1,
            description: 'Read, write, and delete data in Stackby',
            defaults: {
                name: 'Stackby',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'stackbyApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Append',
                            value: 'append',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                        },
                        {
                            name: 'List',
                            value: 'list',
                        },
                        {
                            name: 'Read',
                            value: 'read',
                        },
                    ],
                    default: 'append',
                    placeholder: 'Action to perform',
                },
                // ----------------------------------
                //         All
                // ----------------------------------
                {
                    displayName: 'Stack ID',
                    name: 'stackId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The ID of the stack to access',
                },
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'string',
                    default: '',
                    placeholder: 'Stories',
                    required: true,
                    description: 'Enter Table Name',
                },
                // ----------------------------------
                //         read
                // ----------------------------------
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'read',
                                'delete',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID of the record to return',
                },
                // ----------------------------------
                //         list
                // ----------------------------------
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            'operation': [
                                'list',
                            ],
                            'returnAll': [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 1000,
                    },
                    default: 1000,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    default: {},
                    placeholder: 'Add Field',
                    options: [
                        {
                            displayName: 'View',
                            name: 'view',
                            type: 'string',
                            default: '',
                            placeholder: 'All Stories',
                            description: 'The name or ID of a view in the Stories table. If set, only the records in that view will be returned. The records will be sorted according to the order of the view.',
                        },
                    ],
                },
                // ----------------------------------
                //         append
                // ----------------------------------
                {
                    displayName: 'Columns',
                    name: 'columns',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'append',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    placeholder: 'id,name,description',
                    description: 'Comma-separated list of the properties which should used as columns for the new rows',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const qs = {};
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'read') {
                for (let i = 0; i < length; i++) {
                    try {
                        const stackId = this.getNodeParameter('stackId', i);
                        const table = encodeURI(this.getNodeParameter('table', i));
                        const rowIds = this.getNodeParameter('id', i);
                        qs.rowIds = [rowIds];
                        responseData = yield GenericFunction_1.apiRequest.call(this, 'GET', `/rowlist/${stackId}/${table}`, {}, qs);
                        // tslint:disable-next-line: no-any
                        returnData.push.apply(returnData, responseData.map((data) => data.field));
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'delete') {
                for (let i = 0; i < length; i++) {
                    try {
                        const stackId = this.getNodeParameter('stackId', i);
                        const table = encodeURI(this.getNodeParameter('table', i));
                        const rowIds = this.getNodeParameter('id', i);
                        qs.rowIds = [rowIds];
                        responseData = yield GenericFunction_1.apiRequest.call(this, 'DELETE', `/rowdelete/${stackId}/${table}`, {}, qs);
                        responseData = responseData.records;
                        returnData.push.apply(returnData, responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'append') {
                try {
                    const records = {};
                    let key = '';
                    for (let i = 0; i < length; i++) {
                        const stackId = this.getNodeParameter('stackId', i);
                        const table = encodeURI(this.getNodeParameter('table', i));
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        // tslint:disable-next-line: no-any
                        const record = {};
                        for (const column of columnList) {
                            if (items[i].json[column] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Column ${column} does not exist on input`);
                            }
                            else {
                                record[column] = items[i].json[column];
                            }
                        }
                        key = `${stackId}/${table}`;
                        if (records[key] === undefined) {
                            records[key] = [];
                        }
                        records[key].push({ field: record });
                    }
                    for (const key of Object.keys(records)) {
                        responseData = yield GenericFunction_1.apiRequest.call(this, 'POST', `/rowcreate/${key}`, { records: records[key] });
                    }
                    // tslint:disable-next-line: no-any
                    returnData.push.apply(returnData, responseData.map((data) => data.field));
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            if (operation === 'list') {
                for (let i = 0; i < length; i++) {
                    try {
                        const stackId = this.getNodeParameter('stackId', i);
                        const table = encodeURI(this.getNodeParameter('table', i));
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i, {});
                        if (additionalFields.view) {
                            qs.view = additionalFields.view;
                        }
                        if (returnAll === true) {
                            responseData = yield GenericFunction_1.apiRequestAllItems.call(this, 'GET', `/rowlist/${stackId}/${table}`, {}, qs);
                        }
                        else {
                            qs.maxrecord = this.getNodeParameter('limit', 0);
                            responseData = yield GenericFunction_1.apiRequest.call(this, 'GET', `/rowlist/${stackId}/${table}`, {}, qs);
                        }
                        // tslint:disable-next-line: no-any
                        returnData.push.apply(returnData, responseData.map((data) => data.field));
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Stackby = Stackby;
