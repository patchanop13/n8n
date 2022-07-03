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
exports.BitbucketTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class BitbucketTrigger {
    constructor() {
        this.description = {
            displayName: 'Bitbucket Trigger',
            name: 'bitbucketTrigger',
            icon: 'file:bitbucket.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Bitbucket events via webhooks',
            defaults: {
                name: 'Bitbucket Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'bitbucketApi',
                    required: true,
                    testedBy: 'bitbucketApiTest',
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
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
                            name: 'Repository',
                            value: 'repository',
                        },
                        {
                            name: 'Workspace',
                            value: 'workspace',
                        },
                    ],
                    default: 'workspace',
                },
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'workspace',
                                'repository',
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    required: true,
                    default: '',
                    description: 'The repository of which to listen to the events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Event Names or IDs',
                    name: 'events',
                    type: 'multiOptions',
                    displayOptions: {
                        show: {
                            resource: [
                                'workspace',
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaceEvents',
                    },
                    options: [],
                    required: true,
                    default: [],
                    description: 'The events to listen to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Repository Name or ID',
                    name: 'repository',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'repository',
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getRepositories',
                        loadOptionsDependsOn: [
                            'workspace',
                        ],
                    },
                    required: true,
                    default: '',
                    description: 'The repository of which to listen to the events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Event Names or IDs',
                    name: 'events',
                    type: 'multiOptions',
                    displayOptions: {
                        show: {
                            resource: [
                                'repository',
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getRepositoriesEvents',
                    },
                    options: [],
                    required: true,
                    default: [],
                    description: 'The events to listen to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
            ],
        };
        this.methods = {
            credentialTest: {
                bitbucketApiTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        const options = {
                            method: 'GET',
                            auth: {
                                user: credentials.username,
                                password: credentials.appPassword,
                            },
                            uri: 'https://api.bitbucket.org/2.0/user',
                            json: true,
                            timeout: 5000,
                        };
                        try {
                            const response = yield this.helpers.request(options);
                            if (!response.username) {
                                return {
                                    status: 'Error',
                                    message: `Token is not valid: ${response.error}`,
                                };
                            }
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: `Settings are not valid: ${error}`,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Authentication successful!',
                        };
                    });
                },
            },
            loadOptions: {
                getWorkspaceEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const events = yield GenericFunctions_1.bitbucketApiRequestAllItems.call(this, 'values', 'GET', '/hook_events/workspace');
                        for (const event of events) {
                            returnData.push({
                                name: event.event,
                                value: event.event,
                                description: event.description,
                            });
                        }
                        return returnData;
                    });
                },
                getRepositoriesEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const events = yield GenericFunctions_1.bitbucketApiRequestAllItems.call(this, 'values', 'GET', '/hook_events/repository');
                        for (const event of events) {
                            returnData.push({
                                name: event.event,
                                value: event.event,
                                description: event.description,
                            });
                        }
                        return returnData;
                    });
                },
                getRepositories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const workspace = this.getCurrentNodeParameter('workspace');
                        const repositories = yield GenericFunctions_1.bitbucketApiRequestAllItems.call(this, 'values', 'GET', `/repositories/${workspace}`);
                        for (const repository of repositories) {
                            returnData.push({
                                name: repository.slug,
                                value: repository.slug,
                                description: repository.description,
                            });
                        }
                        return returnData;
                    });
                },
                getWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const workspaces = yield GenericFunctions_1.bitbucketApiRequestAllItems.call(this, 'values', 'GET', `/workspaces`);
                        for (const workspace of workspaces) {
                            returnData.push({
                                name: workspace.name,
                                value: workspace.slug,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let endpoint = '';
                        const resource = this.getNodeParameter('resource', 0);
                        const workspace = this.getNodeParameter('workspace', 0);
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        if (resource === 'workspace') {
                            endpoint = `/workspaces/${workspace}/hooks`;
                        }
                        if (resource === 'repository') {
                            const repository = this.getNodeParameter('repository', 0);
                            endpoint = `/repositories/${workspace}/${repository}/hooks`;
                        }
                        const { values: hooks } = yield GenericFunctions_1.bitbucketApiRequest.call(this, 'GET', endpoint);
                        for (const hook of hooks) {
                            if (webhookUrl === hook.url && hook.active === true) {
                                webhookData.webhookId = hook.uuid.replace('{', '').replace('}', '');
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let responseData;
                        let endpoint = '';
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const events = this.getNodeParameter('events');
                        const resource = this.getNodeParameter('resource', 0);
                        const workspace = this.getNodeParameter('workspace', 0);
                        if (resource === 'workspace') {
                            endpoint = `/workspaces/${workspace}/hooks`;
                        }
                        if (resource === 'repository') {
                            const repository = this.getNodeParameter('repository', 0);
                            endpoint = `/repositories/${workspace}/${repository}/hooks`;
                        }
                        const body = {
                            description: 'n8n webhook',
                            url: webhookUrl,
                            active: true,
                            events,
                        };
                        responseData = yield GenericFunctions_1.bitbucketApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = responseData.uuid.replace('{', '').replace('}', '');
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let endpoint = '';
                        const webhookData = this.getWorkflowStaticData('node');
                        const workspace = this.getNodeParameter('workspace', 0);
                        const resource = this.getNodeParameter('resource', 0);
                        if (resource === 'workspace') {
                            endpoint = `/workspaces/${workspace}/hooks/${webhookData.webhookId}`;
                        }
                        if (resource === 'repository') {
                            const repository = this.getNodeParameter('repository', 0);
                            endpoint = `/repositories/${workspace}/${repository}/hooks/${webhookData.webhookId}`;
                        }
                        try {
                            yield GenericFunctions_1.bitbucketApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const headerData = this.getHeaderData();
            const webhookData = this.getWorkflowStaticData('node');
            if (headerData['x-hook-uuid'] !== webhookData.webhookId) {
                return {};
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.BitbucketTrigger = BitbucketTrigger;
