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
exports.BoxTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class BoxTrigger {
    constructor() {
        this.description = {
            displayName: 'Box Trigger',
            name: 'boxTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:box.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Box events occur',
            defaults: {
                name: 'Box Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'boxOAuth2Api',
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
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Collaboration Accepted',
                            value: 'COLLABORATION.ACCEPTED',
                            description: 'A collaboration has been accepted',
                        },
                        {
                            name: 'Collaboration Created',
                            value: 'COLLABORATION.CREATED',
                            description: 'A collaboration is created',
                        },
                        {
                            name: 'Collaboration Rejected',
                            value: 'COLLABORATION.REJECTED',
                            description: 'A collaboration has been rejected',
                        },
                        {
                            name: 'Collaboration Removed',
                            value: 'COLLABORATION.REMOVED',
                            description: 'A collaboration has been removed',
                        },
                        {
                            name: 'Collaboration Updated',
                            value: 'COLLABORATION.UPDATED',
                            description: 'A collaboration has been updated',
                        },
                        {
                            name: 'Comment Created',
                            value: 'COMMENT.CREATED',
                            description: 'A comment object is created',
                        },
                        {
                            name: 'Comment Deleted',
                            value: 'COMMENT.DELETED',
                            description: 'A comment object is removed',
                        },
                        {
                            name: 'Comment Updated',
                            value: 'COMMENT.UPDATED',
                            description: 'A comment object is edited',
                        },
                        {
                            name: 'File Copied',
                            value: 'FILE.COPIED',
                            description: 'A file is copied',
                        },
                        {
                            name: 'File Deleted',
                            value: 'FILE.DELETED',
                            description: 'A file is moved to the trash',
                        },
                        {
                            name: 'File Downloaded',
                            value: 'FILE.DOWNLOADED',
                            description: 'A file is downloaded',
                        },
                        {
                            name: 'File Locked',
                            value: 'FILE.LOCKED',
                            description: 'A file is locked',
                        },
                        {
                            name: 'File Moved',
                            value: 'FILE.MOVED',
                            description: 'A file is moved from one folder to another',
                        },
                        {
                            name: 'File Previewed',
                            value: 'FILE.PREVIEWED',
                            description: 'A file is previewed',
                        },
                        {
                            name: 'File Renamed',
                            value: 'FILE.RENAMED',
                            description: 'A file was renamed',
                        },
                        {
                            name: 'File Restored',
                            value: 'FILE.RESTORED',
                            description: 'A file is restored from the trash',
                        },
                        {
                            name: 'File Trashed',
                            value: 'FILE.TRASHED',
                            description: 'A file is moved to the trash',
                        },
                        {
                            name: 'File Unlocked',
                            value: 'FILE.UNLOCKED',
                            description: 'A file is unlocked',
                        },
                        {
                            name: 'File Uploaded',
                            value: 'FILE.UPLOADED',
                            description: 'A file is uploaded to or moved to this folder',
                        },
                        {
                            name: 'Folder Copied',
                            value: 'FOLDER.COPIED',
                            description: 'A copy of a folder is made',
                        },
                        {
                            name: 'Folder Created',
                            value: 'FOLDER.CREATED',
                            description: 'A folder is created',
                        },
                        {
                            name: 'Folder Deleted',
                            value: 'FOLDER.DELETED',
                            description: 'A folder is permanently removed',
                        },
                        {
                            name: 'Folder Downloaded',
                            value: 'FOLDER.DOWNLOADED',
                            description: 'A folder is downloaded',
                        },
                        {
                            name: 'Folder Moved',
                            value: 'FOLDER.MOVED',
                            description: 'A folder is moved to a different folder',
                        },
                        {
                            name: 'Folder Renamed',
                            value: 'FOLDER.RENAMED',
                            description: 'A folder was renamed',
                        },
                        {
                            name: 'Folder Restored',
                            value: 'FOLDER.RESTORED',
                            description: 'A folder is restored from the trash',
                        },
                        {
                            name: 'Folder Trashed',
                            value: 'FOLDER.TRASHED',
                            description: 'A folder is moved to the trash',
                        },
                        {
                            name: 'Metadata Instance Created',
                            value: 'METADATA_INSTANCE.CREATED',
                            description: 'A new metadata template instance is associated with a file or folder',
                        },
                        {
                            name: 'Metadata Instance Deleted',
                            value: 'METADATA_INSTANCE.DELETED',
                            description: 'An existing metadata template instance associated with a file or folder is deleted',
                        },
                        {
                            name: 'Metadata Instance Updated',
                            value: 'METADATA_INSTANCE.UPDATED',
                            description: 'An attribute (value) is updated/deleted for an existing metadata template instance associated with a file or folder',
                        },
                        {
                            name: 'Sharedlink Created',
                            value: 'SHARED_LINK.CREATED',
                            description: 'A shared link was created',
                        },
                        {
                            name: 'Sharedlink Deleted',
                            value: 'SHARED_LINK.DELETED',
                            description: 'A shared link was deleted',
                        },
                        {
                            name: 'Sharedlink Updated',
                            value: 'SHARED_LINK.UPDATED',
                            description: 'A shared link was updated',
                        },
                        {
                            name: 'Task Assignment Created',
                            value: 'TASK_ASSIGNMENT.CREATED',
                            description: 'A task is created',
                        },
                        {
                            name: 'Task Assignment Updated',
                            value: 'TASK_ASSIGNMENT.UPDATED',
                            description: 'A task is updated',
                        },
                        {
                            name: 'Webhook Deleted',
                            value: 'WEBHOOK.DELETED',
                            description: 'When a webhook is deleted',
                        },
                    ],
                    required: true,
                    default: [],
                    description: 'The events to listen to',
                },
                {
                    displayName: 'Target Type',
                    name: 'targetType',
                    type: 'options',
                    options: [
                        {
                            name: 'File',
                            value: 'file',
                        },
                        {
                            name: 'Folder',
                            value: 'folder',
                        },
                    ],
                    default: '',
                    description: 'The type of item to trigger a webhook',
                },
                {
                    displayName: 'Target ID',
                    name: 'targetId',
                    type: 'string',
                    default: '',
                    description: 'The ID of the item to trigger a webhook',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const events = this.getNodeParameter('events');
                        const targetId = this.getNodeParameter('targetId');
                        const targetType = this.getNodeParameter('targetType');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/webhooks';
                        const webhooks = yield GenericFunctions_1.boxApiRequestAllItems.call(this, 'entries', 'GET', endpoint, {});
                        for (const webhook of webhooks) {
                            if (webhook.address === webhookUrl &&
                                webhook.target.id === targetId &&
                                webhook.target.type === targetType) {
                                for (const event of events) {
                                    if (!webhook.triggers.includes(event)) {
                                        return false;
                                    }
                                }
                            }
                            // Set webhook-id to be sure that it can be deleted
                            webhookData.webhookId = webhook.id;
                            return true;
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events');
                        const targetId = this.getNodeParameter('targetId');
                        const targetType = this.getNodeParameter('targetType');
                        const endpoint = '/webhooks';
                        const body = {
                            address: webhookUrl,
                            triggers: events,
                            target: {
                                id: targetId,
                                type: targetType,
                            },
                        };
                        const responseData = yield GenericFunctions_1.boxApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.boxApiRequest.call(this, 'DELETE', endpoint);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.BoxTrigger = BoxTrigger;
