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
exports.ClickUpTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class ClickUpTrigger {
    constructor() {
        this.description = {
            displayName: 'ClickUp Trigger',
            name: 'clickUpTrigger',
            icon: 'file:clickup.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle ClickUp events via webhooks (Beta)',
            defaults: {
                name: 'ClickUp Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'clickUpApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'clickUpOAuth2Api',
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Team Name or ID',
                    name: 'team',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getTeams',
                    },
                    required: true,
                    default: '',
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: [],
                    options: [
                        {
                            name: '*',
                            value: '*',
                        },
                        {
                            name: 'folder.created',
                            value: 'folderCreated',
                        },
                        {
                            name: 'folder.deleted',
                            value: 'folderDeleted',
                        },
                        {
                            name: 'folder.updated',
                            value: 'folderUpdated',
                        },
                        {
                            name: 'goal.created',
                            value: 'goalCreated',
                        },
                        {
                            name: 'goal.deleted',
                            value: 'goalDeleted',
                        },
                        {
                            name: 'goal.updated',
                            value: 'goalUpdated',
                        },
                        {
                            name: 'keyResult.created',
                            value: 'keyResultCreated',
                        },
                        {
                            name: 'keyResult.deleted',
                            value: 'keyResultDelete',
                        },
                        {
                            name: 'keyResult.updated',
                            value: 'keyResultUpdated',
                        },
                        {
                            name: 'list.created',
                            value: 'listCreated',
                        },
                        {
                            name: 'list.deleted',
                            value: 'listDeleted',
                        },
                        {
                            name: 'list.updated',
                            value: 'listUpdated',
                        },
                        {
                            name: 'space.created',
                            value: 'spaceCreated',
                        },
                        {
                            name: 'space.deleted',
                            value: 'spaceDeleted',
                        },
                        {
                            name: 'space.updated',
                            value: 'spaceUpdated',
                        },
                        {
                            name: 'task.assignee.updated',
                            value: 'taskAssigneeUpdated',
                        },
                        {
                            name: 'task.comment.posted',
                            value: 'taskCommentPosted',
                        },
                        {
                            name: 'task.comment.updated',
                            value: 'taskCommentUpdated',
                        },
                        {
                            name: 'task.created',
                            value: 'taskCreated',
                        },
                        {
                            name: 'task.deleted',
                            value: 'taskDeleted',
                        },
                        {
                            name: 'task.dueDate.updated',
                            value: 'taskDueDateUpdated',
                        },
                        {
                            name: 'task.moved',
                            value: 'taskMoved',
                        },
                        {
                            name: 'task.status.updated',
                            value: 'taskStatusUpdated',
                        },
                        {
                            name: 'task.tag.updated',
                            value: 'taskTagUpdated',
                        },
                        {
                            name: 'task.timeEstimate.updated',
                            value: 'taskTimeEstimateUpdated',
                        },
                        {
                            name: 'task.timeTracked.updated',
                            value: 'taskTimeTrackedUpdated',
                        },
                        {
                            name: 'task.updated',
                            value: 'taskUpdated',
                        },
                    ],
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Folder ID',
                            name: 'folderId',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'List ID',
                            name: 'listId',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Space ID',
                            name: 'spaceId',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Task ID',
                            name: 'taskId',
                            type: 'string',
                            default: '',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available teams to display them to user so that he can
                // select them easily
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { teams } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', '/team');
                        for (const team of teams) {
                            const teamName = team.name;
                            const teamId = team.id;
                            returnData.push({
                                name: teamName,
                                value: teamId,
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
                        const teamId = this.getNodeParameter('team');
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const endpoint = `/team/${teamId}/webhook`;
                        const { webhooks } = yield GenericFunctions_1.clickupApiRequest.call(this, 'GET', endpoint);
                        if (Array.isArray(webhooks)) {
                            for (const webhook of webhooks) {
                                if (webhook.id === webhookData.webhookId) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const filters = this.getNodeParameter('filters');
                        const teamId = this.getNodeParameter('team');
                        const events = this.getNodeParameter('events');
                        const endpoint = `/team/${teamId}/webhook`;
                        const body = {
                            endpoint: webhookUrl,
                            events,
                        };
                        if (events.includes('*')) {
                            body.events = '*';
                        }
                        if (filters.listId) {
                            body.list_id = filters.listId.replace('#', '');
                        }
                        if (filters.taskId) {
                            body.task_id = filters.taskId.replace('#', '');
                        }
                        if (filters.spaceId) {
                            body.space_id = filters.spaceId.replace('#', '');
                        }
                        if (filters.folderId) {
                            body.folder_id = filters.folderId.replace('#', '');
                        }
                        const { webhook } = yield GenericFunctions_1.clickupApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = webhook.id;
                        webhookData.secret = webhook.secret;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/webhook/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.clickupApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        delete webhookData.secret;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookData = this.getWorkflowStaticData('node');
            const headerData = this.getHeaderData();
            const req = this.getRequestObject();
            const computedSignature = (0, crypto_1.createHmac)('sha256', webhookData.secret).update(JSON.stringify(req.body)).digest('hex');
            if (headerData['x-signature'] !== computedSignature) {
                // Signature is not valid so ignore call
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
exports.ClickUpTrigger = ClickUpTrigger;
