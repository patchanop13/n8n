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
exports.Jenkins = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Jenkins {
    constructor() {
        this.description = {
            displayName: 'Jenkins',
            name: 'jenkins',
            icon: 'file:jenkins.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Jenkins API',
            defaults: {
                name: 'Jenkins',
                color: '#04AA51',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'jenkinsApi',
                    required: true,
                    testedBy: 'jenkinApiCredentialTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    options: [
                        {
                            name: 'Build',
                            value: 'build',
                        },
                        {
                            name: 'Instance',
                            value: 'instance',
                        },
                        {
                            name: 'Job',
                            value: 'job',
                        },
                    ],
                    default: 'job',
                    noDataExpression: true,
                },
                // --------------------------------------------------------------------------------------------------------
                //         Job Operations
                // --------------------------------------------------------------------------------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Copy',
                            value: 'copy',
                            description: 'Copy a specific job',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a new job',
                        },
                        {
                            name: 'Trigger',
                            value: 'trigger',
                            description: 'Trigger a specific job',
                        },
                        {
                            name: 'Trigger with Parameters',
                            value: 'triggerParams',
                            description: 'Trigger a specific job',
                        },
                    ],
                    default: 'trigger',
                    description: 'Possible operations',
                    noDataExpression: true,
                },
                {
                    displayName: 'Make sure the job is setup to support triggering with parameters. <a href="https://wiki.jenkins.io/display/JENKINS/Parameterized+Build" target="_blank">More info</a>',
                    name: 'triggerParamsNotice',
                    type: 'notice',
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'triggerParams',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Job Name or ID',
                    name: 'job',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getJobs',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'trigger',
                                'triggerParams',
                                'copy',
                            ],
                        },
                    },
                    required: true,
                    default: '',
                    description: 'Name of the job. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                // --------------------------------------------------------------------------------------------------------
                //         Trigger a Job
                // --------------------------------------------------------------------------------------------------------
                {
                    displayName: 'Parameters',
                    name: 'param',
                    type: 'fixedCollection',
                    placeholder: 'Add Parameter',
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'triggerParams',
                            ],
                        },
                    },
                    required: true,
                    default: {},
                    typeOptions: {
                        multipleValues: true,
                    },
                    options: [
                        {
                            name: 'params',
                            displayName: 'Parameters',
                            values: [
                                {
                                    displayName: 'Name or ID',
                                    name: 'name',
                                    type: 'options',
                                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                    typeOptions: {
                                        loadOptionsMethod: 'getJobParameters',
                                        loadOptionsDependsOn: [
                                            'job',
                                        ],
                                    },
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                    description: 'Parameters for Jenkins job',
                },
                // --------------------------------------------------------------------------------------------------------
                //         Copy or Create a Job
                // --------------------------------------------------------------------------------------------------------
                {
                    displayName: 'New Job Name',
                    name: 'newJob',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'copy',
                                'create',
                            ],
                        },
                    },
                    required: true,
                    default: '',
                    description: 'Name of the new Jenkins job',
                },
                {
                    displayName: 'XML',
                    name: 'xml',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    required: true,
                    default: '',
                    description: 'XML of Jenkins config',
                },
                {
                    displayName: 'To get the XML of an existing job, add ???config.xml??? to the end of the job URL',
                    name: 'createNotice',
                    type: 'notice',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'job',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                },
                // --------------------------------------------------------------------------------------------------------
                //         Jenkins operations
                // --------------------------------------------------------------------------------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'instance',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Cancel Quiet Down',
                            value: 'cancelQuietDown',
                            description: 'Cancel quiet down state',
                        },
                        {
                            name: 'Quiet Down',
                            value: 'quietDown',
                            description: 'Put Jenkins in quiet mode, no builds can be started, Jenkins is ready for shutdown',
                        },
                        {
                            name: 'Restart',
                            value: 'restart',
                            description: 'Restart Jenkins immediately on environments where it is possible',
                        },
                        {
                            name: 'Safely Restart',
                            value: 'safeRestart',
                            description: 'Restart Jenkins once no jobs are running on environments where it is possible',
                        },
                        {
                            name: 'Safely Shutdown',
                            value: 'safeExit',
                            description: 'Shutdown once no jobs are running',
                        },
                        {
                            name: 'Shutdown',
                            value: 'exit',
                            description: 'Shutdown Jenkins immediately',
                        },
                    ],
                    default: 'safeRestart',
                    description: 'Jenkins instance operations',
                    noDataExpression: true,
                },
                {
                    displayName: 'Reason',
                    name: 'reason',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'instance',
                            ],
                            operation: [
                                'quietDown',
                            ],
                        },
                    },
                    default: '',
                    description: 'Freeform reason for quiet down mode',
                },
                {
                    displayName: 'Instance operation can shutdown Jenkins instance and make it unresponsive. Some commands may not be available depending on instance implementation.',
                    name: 'instanceNotice',
                    type: 'notice',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'instance',
                            ],
                        },
                    },
                },
                // --------------------------------------------------------------------------------------------------------
                //         Builds operations
                // --------------------------------------------------------------------------------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'build',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'List Builds',
                        },
                    ],
                    default: 'getAll',
                    noDataExpression: true,
                },
                {
                    displayName: 'Job Name or ID',
                    name: 'job',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getJobs',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'build',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    required: true,
                    default: '',
                    description: 'Name of the job. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'build',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 50,
                    typeOptions: {
                        minValue: 1,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'build',
                            ],
                            operation: [
                                'getAll',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    description: 'Max number of results to return',
                },
            ],
        };
        this.methods = {
            credentialTest: {
                jenkinApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { baseUrl, username, apiKey } = credential.data;
                        const url = (0, GenericFunctions_1.tolerateTrailingSlash)(baseUrl);
                        const endpoint = '/api/json';
                        const options = {
                            auth: {
                                username,
                                password: apiKey,
                            },
                            method: 'GET',
                            body: {},
                            qs: {},
                            uri: `${url}${endpoint}`,
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
            loadOptions: {
                getJobs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = `/api/json`;
                        const { jobs } = yield GenericFunctions_1.jenkinsApiRequest.call(this, 'GET', endpoint);
                        for (const job of jobs) {
                            returnData.push({
                                name: job.name,
                                value: job.name,
                            });
                        }
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
                getJobParameters() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const job = this.getCurrentNodeParameter('job');
                        const returnData = [];
                        const endpoint = `/job/${job}/api/json?tree=actions[parameterDefinitions[*]]`;
                        const { actions } = yield GenericFunctions_1.jenkinsApiRequest.call(this, 'GET', endpoint);
                        for (const { _class, parameterDefinitions } of actions) {
                            if (_class === null || _class === void 0 ? void 0 : _class.includes('ParametersDefinitionProperty')) {
                                for (const { name, type } of parameterDefinitions) {
                                    returnData.push({
                                        name: `${name} - (${type})`,
                                        value: name,
                                    });
                                }
                            }
                        }
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
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'job') {
                        if (operation === 'trigger') {
                            const job = this.getNodeParameter('job', i);
                            const endpoint = `/job/${job}/build`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            responseData = { success: true };
                        }
                        if (operation === 'triggerParams') {
                            const job = this.getNodeParameter('job', i);
                            const params = this.getNodeParameter('param.params', i, []);
                            let body = {};
                            if (params.length) {
                                body = params.reduce((body, param) => {
                                    body[param.name] = param.value;
                                    return body;
                                }, {});
                            }
                            const endpoint = `/job/${job}/buildWithParameters`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint, {}, {}, {
                                form: body,
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded',
                                },
                            });
                            responseData = { success: true };
                        }
                        if (operation === 'copy') {
                            const job = this.getNodeParameter('job', i);
                            const name = this.getNodeParameter('newJob', i);
                            const queryParams = {
                                name,
                                mode: 'copy',
                                from: job,
                            };
                            const endpoint = `/createItem`;
                            try {
                                yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint, queryParams);
                                responseData = { success: true };
                            }
                            catch (error) {
                                if (error.httpCode === '302') {
                                    responseData = { success: true };
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                }
                            }
                        }
                        if (operation === 'create') {
                            const name = this.getNodeParameter('newJob', i);
                            const queryParams = {
                                name,
                            };
                            const headers = {
                                'content-type': 'application/xml',
                            };
                            const body = this.getNodeParameter('xml', i);
                            const endpoint = `/createItem`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint, queryParams, body, { headers, json: false });
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'instance') {
                        if (operation === 'quietDown') {
                            const reason = this.getNodeParameter('reason', i);
                            let queryParams;
                            if (reason) {
                                queryParams = {
                                    reason,
                                };
                            }
                            const endpoint = `/quietDown`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint, queryParams);
                            responseData = { success: true };
                        }
                        if (operation === 'cancelQuietDown') {
                            const endpoint = `/cancelQuietDown`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            responseData = { success: true };
                        }
                        if (operation === 'restart') {
                            const endpoint = `/restart`;
                            try {
                                yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            }
                            catch (error) {
                                if (error.httpCode === '503') {
                                    responseData = { success: true };
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                }
                            }
                        }
                        if (operation === 'safeRestart') {
                            const endpoint = `/safeRestart`;
                            try {
                                yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            }
                            catch (error) {
                                if (error.httpCode === '503') {
                                    responseData = { success: true };
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                }
                            }
                        }
                        if (operation === 'exit') {
                            const endpoint = `/exit`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            responseData = { success: true };
                        }
                        if (operation === 'safeExit') {
                            const endpoint = `/safeExit`;
                            yield GenericFunctions_1.jenkinsApiRequest.call(this, 'POST', endpoint);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'build') {
                        if (operation === 'getAll') {
                            const job = this.getNodeParameter('job', i);
                            let endpoint = `/job/${job}/api/json?tree=builds[*]`;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                endpoint += `{0,${limit}}`;
                            }
                            responseData = yield GenericFunctions_1.jenkinsApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.builds;
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
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
exports.Jenkins = Jenkins;
