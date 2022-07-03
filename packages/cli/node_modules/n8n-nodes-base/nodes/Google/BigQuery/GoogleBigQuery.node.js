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
exports.GoogleBigQuery = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const RecordDescription_1 = require("./RecordDescription");
const uuid_1 = require("uuid");
class GoogleBigQuery {
    constructor() {
        this.description = {
            displayName: 'Google BigQuery',
            name: 'googleBigQuery',
            icon: 'file:googleBigQuery.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Google BigQuery API',
            defaults: {
                name: 'Google BigQuery',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                },
                {
                    name: 'googleBigQueryOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'oAuth2',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Record',
                            value: 'record',
                        },
                    ],
                    default: 'record',
                },
                ...RecordDescription_1.recordOperations,
                ...RecordDescription_1.recordFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { projects } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', '/v2/projects');
                        for (const project of projects) {
                            returnData.push({
                                name: project.friendlyName,
                                value: project.id,
                            });
                        }
                        return returnData;
                    });
                },
                getDatasets() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getCurrentNodeParameter('projectId');
                        const returnData = [];
                        const { datasets } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v2/projects/${projectId}/datasets`);
                        for (const dataset of datasets) {
                            returnData.push({
                                name: dataset.datasetReference.datasetId,
                                value: dataset.datasetReference.datasetId,
                            });
                        }
                        return returnData;
                    });
                },
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getCurrentNodeParameter('projectId');
                        const datasetId = this.getCurrentNodeParameter('datasetId');
                        const returnData = [];
                        const { tables } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v2/projects/${projectId}/datasets/${datasetId}/tables`);
                        for (const table of tables) {
                            returnData.push({
                                name: table.tableReference.tableId,
                                value: table.tableReference.tableId,
                            });
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
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'record') {
                // *********************************************************************
                //                               record
                // *********************************************************************
                if (operation === 'create') {
                    // ----------------------------------
                    //         record: create
                    // ----------------------------------
                    // https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll
                    const projectId = this.getNodeParameter('projectId', 0);
                    const datasetId = this.getNodeParameter('datasetId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const rows = [];
                    const body = {};
                    for (let i = 0; i < length; i++) {
                        const options = this.getNodeParameter('options', i);
                        Object.assign(body, options);
                        if (body.traceId === undefined) {
                            body.traceId = (0, uuid_1.v4)();
                        }
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        const record = {};
                        for (const key of Object.keys(items[i].json)) {
                            if (columnList.includes(key)) {
                                record[`${key}`] = items[i].json[key];
                            }
                        }
                        rows.push({ json: record });
                    }
                    body.rows = rows;
                    try {
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`, body);
                        returnData.push(responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                        }
                        else {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                    }
                }
                else if (operation === 'getAll') {
                    // ----------------------------------
                    //         record: getAll
                    // ----------------------------------
                    // https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/get
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    const projectId = this.getNodeParameter('projectId', 0);
                    const datasetId = this.getNodeParameter('datasetId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    let fields;
                    if (simple === true) {
                        const { schema } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`, {});
                        fields = schema.fields.map((field) => field.name);
                    }
                    for (let i = 0; i < length; i++) {
                        try {
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            // if (qs.useInt64Timestamp !== undefined) {
                            // 	qs.formatOptions = {
                            // 		useInt64Timestamp: qs.useInt64Timestamp,
                            // 	};
                            // 	delete qs.useInt64Timestamp;
                            // }
                            if (qs.selectedFields) {
                                fields = qs.selectedFields.split(',');
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'rows', 'GET', `/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/data`, {}, qs);
                                returnData.push.apply(returnData, (simple) ? (0, GenericFunctions_1.simplify)(responseData, fields) : responseData);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/data`, {}, qs);
                                returnData.push.apply(returnData, (simple) ? (0, GenericFunctions_1.simplify)(responseData.rows, fields) : responseData.rows);
                            }
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GoogleBigQuery = GoogleBigQuery;
