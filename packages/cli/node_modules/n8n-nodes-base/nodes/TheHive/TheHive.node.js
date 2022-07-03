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
exports.TheHive = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AlertDescription_1 = require("./descriptions/AlertDescription");
const ObservableDescription_1 = require("./descriptions/ObservableDescription");
const CaseDescription_1 = require("./descriptions/CaseDescription");
const TaskDescription_1 = require("./descriptions/TaskDescription");
const LogDescription_1 = require("./descriptions/LogDescription");
const QueryFunctions_1 = require("./QueryFunctions");
const GenericFunctions_1 = require("./GenericFunctions");
class TheHive {
    constructor() {
        this.description = {
            displayName: 'TheHive',
            name: 'theHive',
            icon: 'file:thehive.svg',
            group: ['transform'],
            subtitle: '={{$parameter["operation"]}} : {{$parameter["resource"]}}',
            version: 1,
            description: 'Consume TheHive API',
            defaults: {
                name: 'TheHive',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'theHiveApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    options: [
                        {
                            name: 'Alert',
                            value: 'alert',
                        },
                        {
                            name: 'Case',
                            value: 'case',
                        },
                        {
                            name: 'Log',
                            value: 'log',
                        },
                        {
                            name: 'Observable',
                            value: 'observable',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    default: 'alert',
                },
                // Alert
                ...AlertDescription_1.alertOperations,
                ...AlertDescription_1.alertFields,
                // Observable
                ...ObservableDescription_1.observableOperations,
                ...ObservableDescription_1.observableFields,
                // Case
                ...CaseDescription_1.caseOperations,
                ...CaseDescription_1.caseFields,
                // Task
                ...TaskDescription_1.taskOperations,
                ...TaskDescription_1.taskFields,
                // Log
                ...LogDescription_1.logOperations,
                ...LogDescription_1.logFields,
            ],
        };
        this.methods = {
            loadOptions: {
                loadResponders() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // request the analyzers from instance
                        const resource = (0, GenericFunctions_1.mapResource)(this.getNodeParameter('resource'));
                        const resourceId = this.getNodeParameter('id');
                        const endpoint = `/connector/cortex/responder/${resource}/${resourceId}`;
                        const responders = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', endpoint);
                        const returnData = [];
                        for (const responder of responders) {
                            returnData.push({
                                name: responder.name,
                                value: responder.id,
                                description: responder.description,
                            });
                        }
                        return returnData;
                    });
                },
                loadAnalyzers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // request the analyzers from instance
                        const dataType = this.getNodeParameter('dataType');
                        const endpoint = `/connector/cortex/analyzer/type/${dataType}`;
                        const requestResult = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', endpoint);
                        const returnData = [];
                        for (const analyzer of requestResult) {
                            for (const cortexId of analyzer.cortexIds) {
                                returnData.push({
                                    name: `[${cortexId}] ${analyzer.name}`,
                                    value: `${analyzer.id}::${cortexId}`,
                                    description: analyzer.description,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                loadCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('theHiveApi');
                        const version = credentials.apiVersion;
                        const endpoint = version === 'v1' ? '/customField' : '/list/custom_fields';
                        const requestResult = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', endpoint);
                        const returnData = [];
                        // Convert TheHive3 response to the same format as TheHive 4
                        const customFields = version === 'v1' ? requestResult : Object.keys(requestResult).map(key => requestResult[key]);
                        for (const field of customFields) {
                            returnData.push({
                                name: `${field.name}: ${field.reference}`,
                                value: field.reference,
                                description: `${field.type}: ${field.description}`,
                            });
                        }
                        return returnData;
                    });
                },
                loadObservableOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // if v1 is not used we remove 'count' option
                        const version = (yield this.getCredentials('theHiveApi')).apiVersion;
                        const options = [
                            ...(version === 'v1') ? [{ name: 'Count', value: 'count', description: 'Count observables' }] : [],
                            { name: 'Create', value: 'create', description: 'Create observable' },
                            { name: 'Execute Analyzer', value: 'executeAnalyzer', description: 'Execute an responder on selected observable' },
                            { name: 'Execute Responder', value: 'executeResponder', description: 'Execute a responder on selected observable' },
                            { name: 'Get All', value: 'getAll', description: 'Get all observables of a specific case' },
                            { name: 'Get', value: 'get', description: 'Get a single observable' },
                            { name: 'Search', value: 'search', description: 'Search observables' },
                            { name: 'Update', value: 'update', description: 'Update observable' },
                        ];
                        return options;
                    });
                },
                loadObservableTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const version = (yield this.getCredentials('theHiveApi')).apiVersion;
                        const endpoint = version === 'v1' ? '/observable/type?range=all' : '/list/list_artifactDataType';
                        const dataTypes = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', endpoint);
                        let returnData = [];
                        if (version === 'v1') {
                            returnData = dataTypes.map((dataType) => {
                                return {
                                    name: dataType.name,
                                    value: dataType.name,
                                };
                            });
                        }
                        else {
                            returnData = Object.keys(dataTypes).map(key => {
                                const dataType = dataTypes[key];
                                return {
                                    name: dataType,
                                    value: dataType,
                                };
                            });
                        }
                        // Sort the array by option name
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                loadTaskOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('theHiveApi');
                        const version = credentials.apiVersion;
                        const options = [
                            ...(version === 'v1') ? [{ name: 'Count', value: 'count', description: 'Count tasks' }] : [],
                            { name: 'Create', value: 'create', description: 'Create a task' },
                            { name: 'Execute Responder', value: 'executeResponder', description: 'Execute a responder on the specified task' },
                            { name: 'Get All', value: 'getAll', description: 'Get all asks of a specific case' },
                            { name: 'Get', value: 'get', description: 'Get a single task' },
                            { name: 'Search', value: 'search', description: 'Search tasks' },
                            { name: 'Update', value: 'update', description: 'Update a task' },
                        ];
                        return options;
                    });
                },
                loadAlertOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('theHiveApi');
                        const version = credentials.apiVersion;
                        const options = [
                            ...(version === 'v1') ? [{ name: 'Count', value: 'count', description: 'Count alerts' }] : [],
                            { name: 'Create', value: 'create', description: 'Create alert' },
                            { name: 'Execute Responder', value: 'executeResponder', description: 'Execute a responder on the specified alert' },
                            { name: 'Get', value: 'get', description: 'Get an alert' },
                            { name: 'Get All', value: 'getAll', description: 'Get all alerts' },
                            { name: 'Mark as Read', value: 'markAsRead', description: 'Mark the alert as read' },
                            { name: 'Mark as Unread', value: 'markAsUnread', description: 'Mark the alert as unread' },
                            { name: 'Merge', value: 'merge', description: 'Merge alert into an existing case' },
                            { name: 'Promote', value: 'promote', description: 'Promote an alert into a case' },
                            { name: 'Update', value: 'update', description: 'Update alert' },
                        ];
                        return options;
                    });
                },
                loadCaseOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('theHiveApi');
                        const version = credentials.apiVersion;
                        const options = [
                            ...(version === 'v1') ? [{ name: 'Count', value: 'count', description: 'Count a case' }] : [],
                            { name: 'Create', value: 'create', description: 'Create a case' },
                            { name: 'Execute Responder', value: 'executeResponder', description: 'Execute a responder on the specified case' },
                            { name: 'Get All', value: 'getAll', description: 'Get all cases' },
                            { name: 'Get', value: 'get', description: 'Get a single case' },
                            { name: 'Update', value: 'update', description: 'Update a case' },
                        ];
                        return options;
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
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'alert') {
                        if (operation === 'count') {
                            const filters = this.getNodeParameter('filters', i, {});
                            const countQueryAttributs = (0, GenericFunctions_1.prepareOptional)(filters); // tslint:disable-line:no-any
                            const _countSearchQuery = (0, QueryFunctions_1.And)();
                            if ('customFieldsUi' in filters) {
                                const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, filters);
                                const searchQueries = (0, GenericFunctions_1.buildCustomFieldSearch)(customFields);
                                _countSearchQuery['_and'].push(...searchQueries);
                            }
                            for (const key of Object.keys(countQueryAttributs)) {
                                if (key === 'tags') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.In)(key, countQueryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'title') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, countQueryAttributs[key]));
                                }
                                else {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, countQueryAttributs[key]));
                                }
                            }
                            const body = {
                                'query': [
                                    {
                                        '_name': 'listAlert',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': _countSearchQuery['_and'],
                                    },
                                ],
                            };
                            body['query'].push({
                                '_name': 'count',
                            });
                            qs.name = 'count-Alert';
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);
                            responseData = { count: responseData };
                        }
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, additionalFields, jsonParameters);
                            const body = Object.assign({ title: this.getNodeParameter('title', i), description: this.getNodeParameter('description', i), severity: this.getNodeParameter('severity', i), date: Date.parse(this.getNodeParameter('date', i)), tags: (0, GenericFunctions_1.splitTags)(this.getNodeParameter('tags', i)), tlp: this.getNodeParameter('tlp', i), status: this.getNodeParameter('status', i), type: this.getNodeParameter('type', i), source: this.getNodeParameter('source', i), sourceRef: this.getNodeParameter('sourceRef', i), follow: this.getNodeParameter('follow', i, true), customFields }, (0, GenericFunctions_1.prepareOptional)(additionalFields));
                            const artifactUi = this.getNodeParameter('artifactUi', i);
                            if (artifactUi) {
                                const artifactValues = artifactUi.artifactValues;
                                if (artifactValues) {
                                    const artifactData = [];
                                    for (const artifactvalue of artifactValues) {
                                        const element = {};
                                        element.message = artifactvalue.message;
                                        element.tags = artifactvalue.tags.split(',');
                                        element.dataType = artifactvalue.dataType;
                                        element.data = artifactvalue.data;
                                        if (artifactvalue.dataType === 'file') {
                                            const item = items[i];
                                            if (item.binary === undefined) {
                                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                            }
                                            const binaryPropertyName = artifactvalue.binaryProperty;
                                            if (item.binary[binaryPropertyName] === undefined) {
                                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property '${binaryPropertyName}' does not exists on item!`);
                                            }
                                            const binaryData = item.binary[binaryPropertyName];
                                            element.data = `${binaryData.fileName};${binaryData.mimeType};${binaryData.data}`;
                                        }
                                        artifactData.push(element);
                                    }
                                    body.artifacts = artifactData;
                                }
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/alert', body);
                        }
                        /*
                            Execute responder feature differs from Cortex execute responder
                            if it doesn't interfere with n8n standards then we should keep it
                        */
                        if (operation === 'executeResponder') {
                            const alertId = this.getNodeParameter('id', i);
                            const responderId = this.getNodeParameter('responder', i);
                            let body;
                            let response;
                            responseData = [];
                            body = {
                                responderId,
                                objectId: alertId,
                                objectType: 'alert',
                            };
                            response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/action', body);
                            body = {
                                query: [
                                    {
                                        '_name': 'listAction',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': [
                                            {
                                                '_field': 'cortexId',
                                                '_value': response.cortexId,
                                            },
                                            {
                                                '_field': 'objectId',
                                                '_value': response.objectId,
                                            },
                                            {
                                                '_field': 'startDate',
                                                '_value': response.startDate,
                                            },
                                        ],
                                    },
                                ],
                            };
                            qs.name = 'log-actions';
                            do {
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/v1/query`, body, qs);
                            } while (response.status === 'Waiting' || response.status === 'InProgress');
                            responseData = response;
                        }
                        if (operation === 'get') {
                            const alertId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', `/alert/${alertId}`, {});
                        }
                        if (operation === 'getAll') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const filters = this.getNodeParameter('filters', i, {});
                            const queryAttributs = (0, GenericFunctions_1.prepareOptional)(filters); // tslint:disable-line:no-any
                            const options = this.getNodeParameter('options', i);
                            const _searchQuery = (0, QueryFunctions_1.And)();
                            if ('customFieldsUi' in filters) {
                                const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, filters);
                                const searchQueries = (0, GenericFunctions_1.buildCustomFieldSearch)(customFields);
                                _searchQuery['_and'].push(...searchQueries);
                            }
                            for (const key of Object.keys(queryAttributs)) {
                                if (key === 'tags') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.In)(key, queryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'title') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, queryAttributs[key]));
                                }
                                else {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, queryAttributs[key]));
                                }
                            }
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'listAlert',
                                        },
                                        {
                                            '_name': 'filter',
                                            '_and': _searchQuery['_and'],
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'alerts';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/alert/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = _searchQuery;
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'markAsRead') {
                            const alertId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/alert/${alertId}/markAsRead`);
                        }
                        if (operation === 'markAsUnread') {
                            const alertId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/alert/${alertId}/markAsUnread`);
                        }
                        if (operation === 'merge') {
                            const alertId = this.getNodeParameter('id', i);
                            const caseId = this.getNodeParameter('caseId', i);
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/alert/${alertId}/merge/${caseId}`, {});
                        }
                        if (operation === 'promote') {
                            const alertId = this.getNodeParameter('id', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/alert/${alertId}/createCase`, body);
                        }
                        if (operation === 'update') {
                            const alertId = this.getNodeParameter('id', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, updateFields, jsonParameters);
                            const artifactUi = updateFields.artifactUi;
                            delete updateFields.artifactUi;
                            const body = {
                                customFields,
                            };
                            Object.assign(body, updateFields);
                            if (artifactUi) {
                                const artifactValues = artifactUi.artifactValues;
                                if (artifactValues) {
                                    const artifactData = [];
                                    for (const artifactvalue of artifactValues) {
                                        const element = {};
                                        element.message = artifactvalue.message;
                                        element.tags = artifactvalue.tags.split(',');
                                        element.dataType = artifactvalue.dataType;
                                        element.data = artifactvalue.data;
                                        if (artifactvalue.dataType === 'file') {
                                            const item = items[i];
                                            if (item.binary === undefined) {
                                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                            }
                                            const binaryPropertyName = artifactvalue.binaryProperty;
                                            if (item.binary[binaryPropertyName] === undefined) {
                                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property '${binaryPropertyName}' does not exists on item!`);
                                            }
                                            const binaryData = item.binary[binaryPropertyName];
                                            element.data = `${binaryData.fileName};${binaryData.mimeType};${binaryData.data}`;
                                        }
                                        artifactData.push(element);
                                    }
                                    body.artifacts = artifactData;
                                }
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'PATCH', `/alert/${alertId}`, body);
                        }
                    }
                    if (resource === 'observable') {
                        if (operation === 'count') {
                            const countQueryAttributs = (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('filters', i, {})); // tslint:disable-line:no-any
                            const _countSearchQuery = (0, QueryFunctions_1.And)();
                            for (const key of Object.keys(countQueryAttributs)) {
                                if (key === 'dataType' || key === 'tags') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.In)(key, countQueryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'keywork' || key === 'message') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, countQueryAttributs[key]));
                                }
                                else if (key === 'range') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.Between)('startDate', countQueryAttributs['range']['dateRange']['fromDate'], countQueryAttributs['range']['dateRange']['toDate']));
                                }
                                else {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, countQueryAttributs[key]));
                                }
                            }
                            const body = {
                                'query': [
                                    {
                                        '_name': 'listObservable',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': _countSearchQuery['_and'],
                                    },
                                ],
                            };
                            body['query'].push({
                                '_name': 'count',
                            });
                            qs.name = 'count-observables';
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);
                            responseData = { count: responseData };
                        }
                        if (operation === 'executeAnalyzer') {
                            const observableId = this.getNodeParameter('id', i);
                            const analyzers = this.getNodeParameter('analyzers', i)
                                .map(analyzer => {
                                const parts = analyzer.split('::');
                                return {
                                    analyzerId: parts[0],
                                    cortexId: parts[1],
                                };
                            });
                            let response; // tslint:disable-line:no-any
                            let body;
                            responseData = [];
                            for (const analyzer of analyzers) {
                                body = Object.assign(Object.assign({}, analyzer), { artifactId: observableId });
                                // execute the analyzer
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/job', body, qs);
                                const jobId = response.id;
                                qs.name = 'observable-jobs';
                                // query the job result (including the report)
                                do {
                                    responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'GET', `/connector/cortex/job/${jobId}`, body, qs);
                                } while (responseData.status === 'Waiting' || responseData.status === 'InProgress');
                            }
                        }
                        if (operation === 'executeResponder') {
                            const observableId = this.getNodeParameter('id', i);
                            const responderId = this.getNodeParameter('responder', i);
                            let body;
                            let response;
                            responseData = [];
                            body = {
                                responderId,
                                objectId: observableId,
                                objectType: 'case_artifact',
                            };
                            response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/action', body);
                            body = {
                                query: [
                                    {
                                        '_name': 'listAction',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': [
                                            {
                                                '_field': 'cortexId',
                                                '_value': response.cortexId,
                                            },
                                            {
                                                '_field': 'objectId',
                                                '_value': response.objectId,
                                            },
                                            {
                                                '_field': 'startDate',
                                                '_value': response.startDate,
                                            },
                                        ],
                                    },
                                ],
                            };
                            qs.name = 'log-actions';
                            do {
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/v1/query`, body, qs);
                            } while (response.status === 'Waiting' || response.status === 'InProgress');
                            responseData = response;
                        }
                        if (operation === 'create') {
                            const caseId = this.getNodeParameter('caseId', i);
                            let body = Object.assign({ dataType: this.getNodeParameter('dataType', i), message: this.getNodeParameter('message', i), startDate: Date.parse(this.getNodeParameter('startDate', i)), tlp: this.getNodeParameter('tlp', i), ioc: this.getNodeParameter('ioc', i), sighted: this.getNodeParameter('sighted', i), status: this.getNodeParameter('status', i) }, (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('options', i, {})));
                            let options = {};
                            if (body.dataType === 'file') {
                                const item = items[i];
                                if (item.binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                const binaryPropertyName = this.getNodeParameter('binaryProperty', i);
                                if (item.binary[binaryPropertyName] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property '${binaryPropertyName}' does not exists on item!`);
                                }
                                const binaryData = item.binary[binaryPropertyName];
                                const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                options = {
                                    formData: {
                                        attachment: {
                                            value: dataBuffer,
                                            options: {
                                                contentType: binaryData.mimeType,
                                                filename: binaryData.fileName,
                                            },
                                        },
                                        _json: JSON.stringify(body),
                                    },
                                };
                                body = {};
                            }
                            else {
                                body.data = this.getNodeParameter('data', i);
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/case/${caseId}/artifact`, body, qs, '', options);
                        }
                        if (operation === 'get') {
                            const observableId = this.getNodeParameter('id', i);
                            const credentials = yield this.getCredentials('theHiveApi');
                            const version = credentials.apiVersion;
                            let endpoint;
                            let method;
                            let body = {};
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getObservable',
                                            'idOrName': observableId,
                                        },
                                    ],
                                };
                                qs.name = `get-observable-${observableId}`;
                            }
                            else {
                                method = 'GET';
                                endpoint = `/case/artifact/${observableId}`;
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'getAll') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const options = this.getNodeParameter('options', i);
                            const caseId = this.getNodeParameter('caseId', i);
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getCase',
                                            'idOrName': caseId,
                                        },
                                        {
                                            '_name': 'observables',
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'observables';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/artifact/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = (0, QueryFunctions_1.Parent)('case', (0, QueryFunctions_1.Id)(caseId));
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'search') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const queryAttributs = (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('filters', i, {})); // tslint:disable-line:no-any
                            const _searchQuery = (0, QueryFunctions_1.And)();
                            const options = this.getNodeParameter('options', i);
                            for (const key of Object.keys(queryAttributs)) {
                                if (key === 'dataType' || key === 'tags') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.In)(key, queryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'keywork' || key === 'message') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, queryAttributs[key]));
                                }
                                else if (key === 'range') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.Between)('startDate', queryAttributs['range']['dateRange']['fromDate'], queryAttributs['range']['dateRange']['toDate']));
                                }
                                else {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, queryAttributs[key]));
                                }
                            }
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'listObservable',
                                        },
                                        {
                                            '_name': 'filter',
                                            '_and': _searchQuery['_and'],
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'observables';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/artifact/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = _searchQuery;
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const body = Object.assign({}, (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('updateFields', i, {})));
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'PATCH', `/case/artifact/${id}`, body, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'case') {
                        if (operation === 'count') {
                            const filters = this.getNodeParameter('filters', i, {});
                            const countQueryAttributs = (0, GenericFunctions_1.prepareOptional)(filters); // tslint:disable-line:no-any
                            const _countSearchQuery = (0, QueryFunctions_1.And)();
                            if ('customFieldsUi' in filters) {
                                const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, filters);
                                const searchQueries = (0, GenericFunctions_1.buildCustomFieldSearch)(customFields);
                                _countSearchQuery['_and'].push(...searchQueries);
                            }
                            for (const key of Object.keys(countQueryAttributs)) {
                                if (key === 'tags') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.In)(key, countQueryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'summary' || key === 'title') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, countQueryAttributs[key]));
                                }
                                else {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, countQueryAttributs[key]));
                                }
                            }
                            const body = {
                                'query': [
                                    {
                                        '_name': 'listCase',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': _countSearchQuery['_and'],
                                    },
                                ],
                            };
                            body['query'].push({
                                '_name': 'count',
                            });
                            qs.name = 'count-cases';
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);
                            responseData = { count: responseData };
                        }
                        if (operation === 'executeResponder') {
                            const caseId = this.getNodeParameter('id', i);
                            const responderId = this.getNodeParameter('responder', i);
                            let body;
                            let response;
                            responseData = [];
                            body = {
                                responderId,
                                objectId: caseId,
                                objectType: 'case',
                            };
                            response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/action', body);
                            body = {
                                query: [
                                    {
                                        '_name': 'listAction',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': [
                                            {
                                                '_field': 'cortexId',
                                                '_value': response.cortexId,
                                            },
                                            {
                                                '_field': 'objectId',
                                                '_value': response.objectId,
                                            },
                                            {
                                                '_field': 'startDate',
                                                '_value': response.startDate,
                                            },
                                        ],
                                    },
                                ],
                            };
                            qs.name = 'log-actions';
                            do {
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/v1/query`, body, qs);
                            } while (response.status === 'Waiting' || response.status === 'InProgress');
                            responseData = response;
                        }
                        if (operation === 'create') {
                            const options = this.getNodeParameter('options', i, {});
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, options, jsonParameters);
                            const body = Object.assign({ title: this.getNodeParameter('title', i), description: this.getNodeParameter('description', i), severity: this.getNodeParameter('severity', i), startDate: Date.parse(this.getNodeParameter('startDate', i)), owner: this.getNodeParameter('owner', i), flag: this.getNodeParameter('flag', i), tlp: this.getNodeParameter('tlp', i), tags: (0, GenericFunctions_1.splitTags)(this.getNodeParameter('tags', i)), customFields }, (0, GenericFunctions_1.prepareOptional)(options));
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/case', body);
                        }
                        if (operation === 'get') {
                            const caseId = this.getNodeParameter('id', i);
                            const credentials = yield this.getCredentials('theHiveApi');
                            const version = credentials.apiVersion;
                            let endpoint;
                            let method;
                            let body = {};
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getCase',
                                            'idOrName': caseId,
                                        },
                                    ],
                                };
                                qs.name = `get-case-${caseId}`;
                            }
                            else {
                                method = 'GET';
                                endpoint = `/case/${caseId}`;
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'getAll') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const filters = this.getNodeParameter('filters', i, {});
                            const queryAttributs = (0, GenericFunctions_1.prepareOptional)(filters); // tslint:disable-line:no-any
                            const _searchQuery = (0, QueryFunctions_1.And)();
                            const options = this.getNodeParameter('options', i);
                            if ('customFieldsUi' in filters) {
                                const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, filters);
                                const searchQueries = (0, GenericFunctions_1.buildCustomFieldSearch)(customFields);
                                _searchQuery['_and'].push(...searchQueries);
                            }
                            for (const key of Object.keys(queryAttributs)) {
                                if (key === 'tags') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.In)(key, queryAttributs[key]));
                                }
                                else if (key === 'description' || key === 'summary' || key === 'title') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, queryAttributs[key]));
                                }
                                else {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, queryAttributs[key]));
                                }
                            }
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'listCase',
                                        },
                                        {
                                            '_name': 'filter',
                                            '_and': _searchQuery['_and'],
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'cases';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = _searchQuery;
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i, {});
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const customFields = yield GenericFunctions_1.prepareCustomFields.call(this, updateFields, jsonParameters);
                            const body = Object.assign({ customFields }, (0, GenericFunctions_1.prepareOptional)(updateFields));
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'PATCH', `/case/${id}`, body);
                        }
                    }
                    if (resource === 'task') {
                        if (operation === 'count') {
                            const countQueryAttributs = (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('filters', i, {})); // tslint:disable-line:no-any
                            const _countSearchQuery = (0, QueryFunctions_1.And)();
                            for (const key of Object.keys(countQueryAttributs)) {
                                if (key === 'title' || key === 'description') {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, countQueryAttributs[key]));
                                }
                                else {
                                    _countSearchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, countQueryAttributs[key]));
                                }
                            }
                            const body = {
                                'query': [
                                    {
                                        '_name': 'listTask',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': _countSearchQuery['_and'],
                                    },
                                ],
                            };
                            body['query'].push({
                                '_name': 'count',
                            });
                            qs.name = 'count-tasks';
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);
                            responseData = { count: responseData };
                        }
                        if (operation === 'create') {
                            const caseId = this.getNodeParameter('caseId', i);
                            const body = Object.assign({ title: this.getNodeParameter('title', i), status: this.getNodeParameter('status', i), flag: this.getNodeParameter('flag', i) }, (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('options', i, {})));
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/case/${caseId}/task`, body);
                        }
                        if (operation === 'executeResponder') {
                            const taskId = this.getNodeParameter('id', i);
                            const responderId = this.getNodeParameter('responder', i);
                            let body;
                            let response;
                            responseData = [];
                            body = {
                                responderId,
                                objectId: taskId,
                                objectType: 'case_task',
                            };
                            response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/action', body);
                            body = {
                                query: [
                                    {
                                        '_name': 'listAction',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': [
                                            {
                                                '_field': 'cortexId',
                                                '_value': response.cortexId,
                                            },
                                            {
                                                '_field': 'objectId',
                                                '_value': response.objectId,
                                            },
                                            {
                                                '_field': 'startDate',
                                                '_value': response.startDate,
                                            },
                                        ],
                                    },
                                ],
                            };
                            qs.name = 'task-actions';
                            do {
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/v1/query`, body, qs);
                            } while (response.status === 'Waiting' || response.status === 'InProgress');
                            responseData = response;
                        }
                        if (operation === 'get') {
                            const taskId = this.getNodeParameter('id', i);
                            const credentials = yield this.getCredentials('theHiveApi');
                            const version = credentials.apiVersion;
                            let endpoint;
                            let method;
                            let body = {};
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getTask',
                                            'idOrName': taskId,
                                        },
                                    ],
                                };
                                qs.name = `get-task-${taskId}`;
                            }
                            else {
                                method = 'GET';
                                endpoint = `/case/task/${taskId}`;
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'getAll') {
                            // get all require a case id (it retursn all tasks for a specific case)
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const caseId = this.getNodeParameter('caseId', i);
                            const options = this.getNodeParameter('options', i);
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getCase',
                                            'idOrName': caseId,
                                        },
                                        {
                                            '_name': 'tasks',
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'case-tasks';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/task/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = (0, QueryFunctions_1.And)((0, QueryFunctions_1.Parent)('case', (0, QueryFunctions_1.Id)(caseId)));
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'search') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const queryAttributs = (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('filters', i, {})); // tslint:disable-line:no-any
                            const _searchQuery = (0, QueryFunctions_1.And)();
                            const options = this.getNodeParameter('options', i);
                            for (const key of Object.keys(queryAttributs)) {
                                if (key === 'title' || key === 'description') {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.ContainsString)(key, queryAttributs[key]));
                                }
                                else {
                                    _searchQuery['_and'].push((0, QueryFunctions_1.Eq)(key, queryAttributs[key]));
                                }
                            }
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'listTask',
                                        },
                                        {
                                            '_name': 'filter',
                                            '_and': _searchQuery['_and'],
                                        },
                                    ],
                                };
                                //@ts-ignore
                                (0, GenericFunctions_1.prepareSortQuery)(options.sort, body);
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'tasks';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/task/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = _searchQuery;
                                Object.assign(qs, (0, GenericFunctions_1.prepareOptional)(options));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const body = Object.assign({}, (0, GenericFunctions_1.prepareOptional)(this.getNodeParameter('updateFields', i, {})));
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'PATCH', `/case/task/${id}`, body);
                        }
                    }
                    if (resource === 'log') {
                        if (operation === 'create') {
                            const taskId = this.getNodeParameter('taskId', i);
                            let body = {
                                message: this.getNodeParameter('message', i),
                                startDate: Date.parse(this.getNodeParameter('startDate', i)),
                                status: this.getNodeParameter('status', i),
                            };
                            const optionals = this.getNodeParameter('options', i);
                            let options = {};
                            if (optionals.attachementUi) {
                                const attachmentValues = optionals.attachementUi.attachmentValues;
                                if (attachmentValues) {
                                    const item = items[i];
                                    if (item.binary === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                    }
                                    const binaryPropertyName = attachmentValues.binaryProperty;
                                    if (item.binary[binaryPropertyName] === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property '${binaryPropertyName}' does not exists on item!`);
                                    }
                                    const binaryData = item.binary[binaryPropertyName];
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                    options = {
                                        formData: {
                                            attachment: {
                                                value: dataBuffer,
                                                options: {
                                                    contentType: binaryData.mimeType,
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            _json: JSON.stringify(body),
                                        },
                                    };
                                    body = {};
                                }
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/case/task/${taskId}/log`, body, qs, '', options);
                        }
                        if (operation === 'executeResponder') {
                            const logId = this.getNodeParameter('id', i);
                            const responderId = this.getNodeParameter('responder', i);
                            let body;
                            let response;
                            responseData = [];
                            body = {
                                responderId,
                                objectId: logId,
                                objectType: 'case_task_log',
                            };
                            response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/action', body);
                            body = {
                                query: [
                                    {
                                        '_name': 'listAction',
                                    },
                                    {
                                        '_name': 'filter',
                                        '_and': [
                                            {
                                                '_field': 'cortexId',
                                                '_value': response.cortexId,
                                            },
                                            {
                                                '_field': 'objectId',
                                                '_value': response.objectId,
                                            },
                                            {
                                                '_field': 'startDate',
                                                '_value': response.startDate,
                                            },
                                        ],
                                    },
                                ],
                            };
                            qs.name = 'log-actions';
                            do {
                                response = yield GenericFunctions_1.theHiveApiRequest.call(this, 'POST', `/v1/query`, body, qs);
                            } while (response.status === 'Waiting' || response.status === 'InProgress');
                            responseData = response;
                        }
                        if (operation === 'get') {
                            const logId = this.getNodeParameter('id', i);
                            const credentials = yield this.getCredentials('theHiveApi');
                            const version = credentials.apiVersion;
                            let endpoint;
                            let method;
                            let body = {};
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    query: [
                                        {
                                            _name: 'getLog',
                                            idOrName: logId,
                                        },
                                    ],
                                };
                                qs.name = `get-log-${logId}`;
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/task/log/_search';
                                body.query = { _id: logId };
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'getAll') {
                            const credentials = yield this.getCredentials('theHiveApi');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const version = credentials.apiVersion;
                            const taskId = this.getNodeParameter('taskId', i);
                            let endpoint;
                            let method;
                            let body = {};
                            let limit = undefined;
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                            }
                            if (version === 'v1') {
                                endpoint = '/v1/query';
                                method = 'POST';
                                body = {
                                    'query': [
                                        {
                                            '_name': 'getTask',
                                            'idOrName': taskId,
                                        },
                                        {
                                            '_name': 'logs',
                                        },
                                    ],
                                };
                                if (limit !== undefined) {
                                    //@ts-ignore
                                    (0, GenericFunctions_1.prepareRangeQuery)(`0-${limit}`, body);
                                }
                                qs.name = 'case-task-logs';
                            }
                            else {
                                method = 'POST';
                                endpoint = '/case/task/log/_search';
                                if (limit !== undefined) {
                                    qs.range = `0-${limit}`;
                                }
                                body.query = (0, QueryFunctions_1.And)((0, QueryFunctions_1.Parent)('task', (0, QueryFunctions_1.Id)(taskId)));
                            }
                            responseData = yield GenericFunctions_1.theHiveApiRequest.call(this, method, endpoint, body, qs);
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
exports.TheHive = TheHive;
