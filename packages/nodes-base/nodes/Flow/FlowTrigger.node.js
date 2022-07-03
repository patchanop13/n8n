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
exports.FlowTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class FlowTrigger {
    constructor() {
        this.description = {
            displayName: 'Flow Trigger',
            name: 'flowTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:flow.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle Flow events via webhooks',
            defaults: {
                name: 'Flow Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'flowApi',
                    required: true,
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
                    default: '',
                    options: [
                        {
                            name: 'Project',
                            value: 'list',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    description: 'Resource that triggers the webhook',
                },
                {
                    displayName: 'Project ID',
                    name: 'listIds',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'list',
                            ],
                        },
                        hide: {
                            resource: [
                                'task',
                            ],
                        },
                    },
                    description: 'Lists IDs, perhaps known better as "Projects" separated by a comma (,)',
                },
                {
                    displayName: 'Task ID',
                    name: 'taskIds',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'task',
                            ],
                        },
                        hide: {
                            resource: [
                                'list',
                            ],
                        },
                    },
                    description: 'Task IDs separated by a comma (,)',
                },
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('flowApi');
                        let webhooks;
                        const qs = {};
                        const webhookData = this.getWorkflowStaticData('node');
                        if (!Array.isArray(webhookData.webhookIds)) {
                            webhookData.webhookIds = [];
                        }
                        if (!webhookData.webhookIds.length) {
                            return false;
                        }
                        qs.organization_id = credentials.organizationId;
                        const endpoint = `/integration_webhooks`;
                        try {
                            webhooks = yield GenericFunctions_1.flowApiRequest.call(this, 'GET', endpoint, {}, qs);
                            webhooks = webhooks.integration_webhooks;
                        }
                        catch (error) {
                            throw error;
                        }
                        for (const webhook of webhooks) {
                            // @ts-ignore
                            if (webhookData.webhookIds.includes(webhook.id)) {
                                continue;
                            }
                            else {
                                return false;
                            }
                        }
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('flowApi');
                        let resourceIds, body, responseData;
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const resource = this.getNodeParameter('resource');
                        const endpoint = `/integration_webhooks`;
                        if (resource === 'list') {
                            resourceIds = this.getNodeParameter('listIds').split(',');
                        }
                        if (resource === 'task') {
                            resourceIds = this.getNodeParameter('taskIds').split(',');
                        }
                        // @ts-ignore
                        for (const resourceId of resourceIds) {
                            body = {
                                organization_id: credentials.organizationId,
                                integration_webhook: {
                                    name: 'n8n-trigger',
                                    url: webhookUrl,
                                    resource_type: resource,
                                    resource_id: parseInt(resourceId, 10),
                                },
                            };
                            try {
                                responseData = yield GenericFunctions_1.flowApiRequest.call(this, 'POST', endpoint, body);
                            }
                            catch (error) {
                                return false;
                            }
                            if (responseData.integration_webhook === undefined
                                || responseData.integration_webhook.id === undefined) {
                                // Required data is missing so was not successful
                                return false;
                            }
                            // @ts-ignore
                            webhookData.webhookIds.push(responseData.integration_webhook.id);
                        }
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('flowApi');
                        const qs = {};
                        const webhookData = this.getWorkflowStaticData('node');
                        qs.organization_id = credentials.organizationId;
                        // @ts-ignore
                        if (webhookData.webhookIds.length > 0) {
                            // @ts-ignore
                            for (const webhookId of webhookData.webhookIds) {
                                const endpoint = `/integration_webhooks/${webhookId}`;
                                try {
                                    yield GenericFunctions_1.flowApiRequest.call(this, 'DELETE', endpoint, {}, qs);
                                }
                                catch (error) {
                                    return false;
                                }
                            }
                            delete webhookData.webhookIds;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.FlowTrigger = FlowTrigger;
