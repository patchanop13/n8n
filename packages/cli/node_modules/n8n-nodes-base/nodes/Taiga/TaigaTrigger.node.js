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
exports.TaigaTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
// import {
// 	createHmac,
// } from 'crypto';
class TaigaTrigger {
    constructor() {
        this.description = {
            displayName: 'Taiga Trigger',
            name: 'taigaTrigger',
            icon: 'file:taiga.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{"project:" + $parameter["projectSlug"]}}',
            description: 'Handle Taiga events via webhook',
            defaults: {
                name: 'Taiga Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'taigaApi',
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
                    displayName: 'Project Name or ID',
                    name: 'projectId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getUserProjects',
                    },
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Resources',
                    name: 'resources',
                    type: 'multiOptions',
                    required: true,
                    default: [
                        'all',
                    ],
                    options: [
                        {
                            name: 'All',
                            value: 'all',
                        },
                        {
                            name: 'Issue',
                            value: 'issue',
                        },
                        {
                            name: 'Milestone (Sprint)',
                            value: 'milestone',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'User Story',
                            value: 'userstory',
                        },
                        {
                            name: 'Wikipage',
                            value: 'wikipage',
                        },
                    ],
                    description: 'Resources to listen to',
                },
                {
                    displayName: 'Operations',
                    name: 'operations',
                    type: 'multiOptions',
                    required: true,
                    default: [
                        'all',
                    ],
                    description: 'Operations to listen to',
                    options: [
                        {
                            name: 'All',
                            value: 'all',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                        },
                        {
                            name: 'Update',
                            value: 'change',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available projects to display them to user so that he can
                // select them easily
                getUserProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { id } = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/users/me');
                        const projects = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/projects', {}, { member: id });
                        for (const project of projects) {
                            const projectName = project.name;
                            const projectId = project.id;
                            returnData.push({
                                name: projectName,
                                value: projectId,
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
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/webhooks`;
                        const webhooks = yield GenericFunctions_1.taigaApiRequest.call(this, 'GET', endpoint);
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl) {
                                webhookData.webhookId = webhook.id;
                                webhookData.key = webhook.key;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('taigaApi');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const projectId = this.getNodeParameter('projectId');
                        const key = (0, GenericFunctions_1.getAutomaticSecret)(credentials);
                        const body = {
                            name: `n8n-webhook:${webhookUrl}`,
                            url: webhookUrl,
                            key,
                            project: projectId,
                        };
                        const { id } = yield GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/webhooks', body);
                        webhookData.webhookId = id;
                        webhookData.key = key;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        delete webhookData.key;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.getRequestObject().body;
            const operations = this.getNodeParameter('operations', []);
            const resources = this.getNodeParameter('resources', []);
            if (!operations.includes('all') && !operations.includes(body.action)) {
                return {};
            }
            if (!resources.includes('all') && !resources.includes(body.type)) {
                return {};
            }
            // TODO: Signature does not match payload hash
            // https://github.com/taigaio/taiga-back/issues/1031
            // const webhookData = this.getWorkflowStaticData('node');
            // const headerData = this.getHeaderData();
            // // @ts-ignore
            // const requestSignature = headerData['x-taiga-webhook-signature'];
            // if (requestSignature === undefined) {
            // 	return {};
            // }
            // const computedSignature = createHmac('sha1', webhookData.key as string).update(JSON.stringify(body)).digest('hex');
            // if (requestSignature !== computedSignature) {
            // 	return {};
            // }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(body),
                ],
            };
        });
    }
}
exports.TaigaTrigger = TaigaTrigger;
