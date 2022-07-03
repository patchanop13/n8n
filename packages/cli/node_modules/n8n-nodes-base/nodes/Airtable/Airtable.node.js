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
exports.Airtable = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Airtable {
    constructor() {
        this.description = {
            displayName: 'Airtable',
            name: 'airtable',
            icon: 'file:airtable.svg',
            group: ['input'],
            version: 1,
            description: 'Read, update, write and delete data from Airtable',
            defaults: {
                name: 'Airtable',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'airtableApi',
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
                            description: 'Append the data to a table',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete data from a table',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'List data from a table',
                        },
                        {
                            name: 'Read',
                            value: 'read',
                            description: 'Read data from a table',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update data in a table',
                        },
                    ],
                    default: 'read',
                },
                // ----------------------------------
                //         All
                // ----------------------------------
                {
                    displayName: 'Base ID',
                    name: 'application',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The ID of the base to access',
                },
                {
                    displayName: 'Table ID',
                    name: 'table',
                    type: 'string',
                    default: '',
                    placeholder: 'Stories',
                    required: true,
                    description: 'The ID of the table to access',
                },
                // ----------------------------------
                //         append
                // ----------------------------------
                {
                    displayName: 'Add All Fields',
                    name: 'addAllFields',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'append',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether all fields should be sent to Airtable or only specific ones',
                },
                {
                    displayName: 'Fields',
                    name: 'fields',
                    type: 'string',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add Field',
                    },
                    displayOptions: {
                        show: {
                            addAllFields: [
                                false,
                            ],
                            operation: [
                                'append',
                            ],
                        },
                    },
                    default: [],
                    placeholder: 'Name',
                    required: true,
                    description: 'The name of fields for which data should be sent to Airtable',
                },
                // ----------------------------------
                //         delete
                // ----------------------------------
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID of the record to delete',
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
                            operation: [
                                'list',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 100,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Download Attachments',
                    name: 'downloadAttachments',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether the attachment fields define in \'Download Fields\' will be downloaded',
                },
                {
                    displayName: 'Download Fields',
                    name: 'downloadFieldNames',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                            downloadAttachments: [
                                true,
                            ],
                        },
                    },
                    default: '',
                    description: 'Name of the fields of type \'attachment\' that should be downloaded. Multiple ones can be defined separated by comma. Case sensitive and cannot include spaces after a comma.',
                },
                {
                    displayName: 'Additional Options',
                    name: 'additionalOptions',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'list',
                            ],
                        },
                    },
                    default: {},
                    description: 'Additional options which decide which records should be returned',
                    placeholder: 'Add Option',
                    options: [
                        {
                            displayName: 'Fields',
                            name: 'fields',
                            type: 'string',
                            typeOptions: {
                                multipleValues: true,
                                multipleValueButtonText: 'Add Field',
                            },
                            default: [],
                            placeholder: 'Name',
                            description: 'Only data for fields whose names are in this list will be included in the records',
                        },
                        {
                            displayName: 'Filter By Formula',
                            name: 'filterByFormula',
                            type: 'string',
                            default: '',
                            placeholder: 'NOT({Name} = \'\')',
                            description: 'A formula used to filter records. The formula will be evaluated for each record, and if the result is not 0, false, "", NaN, [], or #Error! the record will be included in the response.',
                        },
                        {
                            displayName: 'Sort',
                            name: 'sort',
                            placeholder: 'Add Sort Rule',
                            description: 'Defines how the returned records should be ordered',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                            },
                            default: {},
                            options: [
                                {
                                    name: 'property',
                                    displayName: 'Property',
                                    values: [
                                        {
                                            displayName: 'Field',
                                            name: 'field',
                                            type: 'string',
                                            default: '',
                                            description: 'Name of the field to sort on',
                                        },
                                        {
                                            displayName: 'Direction',
                                            name: 'direction',
                                            type: 'options',
                                            options: [
                                                {
                                                    name: 'ASC',
                                                    value: 'asc',
                                                    description: 'Sort in ascending order (small -> large)',
                                                },
                                                {
                                                    name: 'DESC',
                                                    value: 'desc',
                                                    description: 'Sort in descending order (large -> small)',
                                                },
                                            ],
                                            default: 'asc',
                                            description: 'The sort direction',
                                        },
                                    ],
                                },
                            ],
                        },
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
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID of the record to return',
                },
                // ----------------------------------
                //         update
                // ----------------------------------
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID of the record to update',
                },
                {
                    displayName: 'Update All Fields',
                    name: 'updateAllFields',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether all fields should be sent to Airtable or only specific ones',
                },
                {
                    displayName: 'Fields',
                    name: 'fields',
                    type: 'string',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add Field',
                    },
                    displayOptions: {
                        show: {
                            updateAllFields: [
                                false,
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: [],
                    placeholder: 'Name',
                    required: true,
                    description: 'The name of fields for which data should be sent to Airtable',
                },
                // ----------------------------------
                //         append + delete + update
                // ----------------------------------
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    displayOptions: {
                        show: {
                            operation: [
                                'append',
                                'delete',
                                'update',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Bulk Size',
                            name: 'bulkSize',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 10,
                            },
                            default: 10,
                            description: 'Number of records to process at once',
                        },
                        {
                            displayName: 'Ignore Fields',
                            name: 'ignoreFields',
                            type: 'string',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'update',
                                    ],
                                    '/updateAllFields': [
                                        true,
                                    ],
                                },
                            },
                            default: '',
                            description: 'Comma-separated list of fields to ignore',
                        },
                        {
                            displayName: 'Typecast',
                            name: 'typecast',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'append',
                                        'update',
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether the Airtable API should attempt mapping of string values for linked records & select options',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const operation = this.getNodeParameter('operation', 0);
            const application = this.getNodeParameter('application', 0);
            const table = encodeURI(this.getNodeParameter('table', 0));
            let returnAll = false;
            let endpoint = '';
            let requestMethod = '';
            const body = {};
            const qs = {};
            if (operation === 'append') {
                // ----------------------------------
                //         append
                // ----------------------------------
                requestMethod = 'POST';
                endpoint = `${application}/${table}`;
                let addAllFields;
                let fields;
                let options;
                const rows = [];
                let bulkSize = 10;
                for (let i = 0; i < items.length; i++) {
                    try {
                        addAllFields = this.getNodeParameter('addAllFields', i);
                        options = this.getNodeParameter('options', i, {});
                        bulkSize = options.bulkSize || bulkSize;
                        const row = {};
                        if (addAllFields === true) {
                            // Add all the fields the item has
                            row.fields = Object.assign({}, items[i].json);
                            // tslint:disable-next-line: no-any
                            delete row.fields.id;
                        }
                        else {
                            // Add only the specified fields
                            row.fields = {};
                            fields = this.getNodeParameter('fields', i, []);
                            for (const fieldName of fields) {
                                // @ts-ignore
                                row.fields[fieldName] = items[i].json[fieldName];
                            }
                        }
                        rows.push(row);
                        if (rows.length === bulkSize || i === items.length - 1) {
                            if (options.typecast === true) {
                                body['typecast'] = true;
                            }
                            body['records'] = rows;
                            responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                            returnData.push(...responseData.records);
                            // empty rows
                            rows.length = 0;
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
            }
            else if (operation === 'delete') {
                requestMethod = 'DELETE';
                const rows = [];
                const options = this.getNodeParameter('options', 0, {});
                const bulkSize = options.bulkSize || 10;
                for (let i = 0; i < items.length; i++) {
                    try {
                        let id;
                        id = this.getNodeParameter('id', i);
                        rows.push(id);
                        if (rows.length === bulkSize || i === items.length - 1) {
                            endpoint = `${application}/${table}`;
                            // Make one request after another. This is slower but makes
                            // sure that we do not run into the rate limit they have in
                            // place and so block for 30 seconds. Later some global
                            // functionality in core should make it easy to make requests
                            // according to specific rules like not more than 5 requests
                            // per seconds.
                            qs.records = rows;
                            responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                            returnData.push(...responseData.records);
                            // empty rows
                            rows.length = 0;
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
            }
            else if (operation === 'list') {
                // ----------------------------------
                //         list
                // ----------------------------------
                try {
                    requestMethod = 'GET';
                    endpoint = `${application}/${table}`;
                    returnAll = this.getNodeParameter('returnAll', 0);
                    const downloadAttachments = this.getNodeParameter('downloadAttachments', 0);
                    const additionalOptions = this.getNodeParameter('additionalOptions', 0, {});
                    for (const key of Object.keys(additionalOptions)) {
                        if (key === 'sort' && additionalOptions.sort.property !== undefined) {
                            qs[key] = additionalOptions[key].property;
                        }
                        else {
                            qs[key] = additionalOptions[key];
                        }
                    }
                    if (returnAll === true) {
                        responseData = yield GenericFunctions_1.apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
                    }
                    else {
                        qs.maxRecords = this.getNodeParameter('limit', 0);
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                    }
                    returnData.push.apply(returnData, responseData.records);
                    if (downloadAttachments === true) {
                        const downloadFieldNames = this.getNodeParameter('downloadFieldNames', 0).split(',');
                        const data = yield GenericFunctions_1.downloadRecordAttachments.call(this, responseData.records, downloadFieldNames);
                        return [data];
                    }
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
            else if (operation === 'read') {
                // ----------------------------------
                //         read
                // ----------------------------------
                requestMethod = 'GET';
                let id;
                for (let i = 0; i < items.length; i++) {
                    id = this.getNodeParameter('id', i);
                    endpoint = `${application}/${table}/${id}`;
                    // Make one request after another. This is slower but makes
                    // sure that we do not run into the rate limit they have in
                    // place and so block for 30 seconds. Later some global
                    // functionality in core should make it easy to make requests
                    // according to specific rules like not more than 5 requests
                    // per seconds.
                    try {
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                        returnData.push(responseData);
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
            else if (operation === 'update') {
                // ----------------------------------
                //         update
                // ----------------------------------
                requestMethod = 'PATCH';
                let updateAllFields;
                let fields;
                let options;
                const rows = [];
                let bulkSize = 10;
                for (let i = 0; i < items.length; i++) {
                    try {
                        updateAllFields = this.getNodeParameter('updateAllFields', i);
                        options = this.getNodeParameter('options', i, {});
                        bulkSize = options.bulkSize || bulkSize;
                        const row = {};
                        row.fields = {};
                        if (updateAllFields === true) {
                            // Update all the fields the item has
                            row.fields = Object.assign({}, items[i].json);
                            // remove id field
                            // tslint:disable-next-line: no-any
                            delete row.fields.id;
                            if (options.ignoreFields && options.ignoreFields !== '') {
                                const ignoreFields = options.ignoreFields.split(',').map(field => field.trim()).filter(field => !!field);
                                if (ignoreFields.length) {
                                    // From: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
                                    row.fields = Object.entries(items[i].json)
                                        .filter(([key]) => !ignoreFields.includes(key))
                                        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
                                }
                            }
                        }
                        else {
                            fields = this.getNodeParameter('fields', i, []);
                            for (const fieldName of fields) {
                                // @ts-ignore
                                row.fields[fieldName] = items[i].json[fieldName];
                            }
                        }
                        row.id = this.getNodeParameter('id', i);
                        rows.push(row);
                        if (rows.length === bulkSize || i === items.length - 1) {
                            endpoint = `${application}/${table}`;
                            // Make one request after another. This is slower but makes
                            // sure that we do not run into the rate limit they have in
                            // place and so block for 30 seconds. Later some global
                            // functionality in core should make it easy to make requests
                            // according to specific rules like not more than 5 requests
                            // per seconds.
                            const data = { records: rows, typecast: (options.typecast) ? true : false };
                            responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, data, qs);
                            returnData.push(...responseData.records);
                            // empty rows
                            rows.length = 0;
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
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Airtable = Airtable;
