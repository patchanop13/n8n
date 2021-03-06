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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twist = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ChannelDescription_1 = require("./ChannelDescription");
const MessageConversationDescription_1 = require("./MessageConversationDescription");
const ThreadDescription_1 = require("./ThreadDescription");
const CommentDescription_1 = require("./CommentDescription");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
class Twist {
    constructor() {
        this.description = {
            displayName: 'Twist',
            name: 'twist',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:twist.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Twist API',
            defaults: {
                name: 'Twist',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'twistOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Channel',
                            value: 'channel',
                        },
                        {
                            name: 'Comment',
                            value: 'comment',
                        },
                        {
                            name: 'Message Conversation',
                            value: 'messageConversation',
                        },
                        {
                            name: 'Thread',
                            value: 'thread',
                        },
                    ],
                    default: 'messageConversation',
                },
                ...ChannelDescription_1.channelOperations,
                ...ChannelDescription_1.channelFields,
                ...CommentDescription_1.commentOperations,
                ...CommentDescription_1.commentFields,
                ...MessageConversationDescription_1.messageConversationOperations,
                ...MessageConversationDescription_1.messageConversationFields,
                ...ThreadDescription_1.threadOperations,
                ...ThreadDescription_1.threadFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available workspaces to display them to user so that he can
                // select them easily
                getWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const workspaces = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/workspaces/get');
                        for (const workspace of workspaces) {
                            returnData.push({
                                name: workspace.name,
                                value: workspace.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available conversations to display them to user so that he can
                // select them easily
                getConversations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            workspace_id: this.getCurrentNodeParameter('workspaceId'),
                        };
                        const conversations = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/conversations/get', {}, qs);
                        for (const conversation of conversations) {
                            returnData.push({
                                name: conversation.title || conversation.id,
                                value: conversation.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available users to display them to user so that he can
                // select them easily
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            id: this.getCurrentNodeParameter('workspaceId'),
                        };
                        const users = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/workspaces/get_users', {}, qs);
                        for (const user of users) {
                            returnData.push({
                                name: user.name,
                                value: user.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            workspace_id: this.getCurrentNodeParameter('workspaceId'),
                        };
                        const groups = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/groups/get', {}, qs);
                        for (const group of groups) {
                            returnData.push({
                                name: group.name,
                                value: group.id,
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
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'channel') {
                        //https://developer.twist.com/v3/#add-channel
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                workspace_id: workspaceId,
                                name,
                            };
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/channels/add', body);
                        }
                        //https://developer.twist.com/v3/#remove-channel
                        if (operation === 'delete') {
                            qs.id = this.getNodeParameter('channelId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/channels/remove', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-channel
                        if (operation === 'get') {
                            qs.id = this.getNodeParameter('channelId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/channels/getone', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-all-channels
                        if (operation === 'getAll') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            qs.workspace_id = workspaceId;
                            Object.assign(qs, filters);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/channels/get', {}, qs);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        //https://developer.twist.com/v3/#update-channel
                        if (operation === 'update') {
                            const channelId = this.getNodeParameter('channelId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: channelId,
                            };
                            Object.assign(body, updateFields);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/channels/update', body);
                        }
                        //https://developer.twist.com/v3/#archive-channel
                        if (operation === 'archive') {
                            qs.id = this.getNodeParameter('channelId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/channels/archive', {}, qs);
                        }
                        //https://developer.twist.com/v3/#unarchive-channel
                        if (operation === 'unarchive') {
                            qs.id = this.getNodeParameter('channelId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/channels/unarchive', {}, qs);
                        }
                    }
                    if (resource === 'comment') {
                        //https://developer.twist.com/v3/#add-comment
                        if (operation === 'create') {
                            const threadId = this.getNodeParameter('threadId', i);
                            const content = this.getNodeParameter('content', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                thread_id: threadId,
                                content,
                            };
                            Object.assign(body, additionalFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new Error(`No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/comments/add', body);
                        }
                        //https://developer.twist.com/v3/#remove-comment
                        if (operation === 'delete') {
                            qs.id = this.getNodeParameter('commentId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/comments/remove', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-comment
                        if (operation === 'get') {
                            qs.id = this.getNodeParameter('commentId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/comments/getone', {}, qs);
                            responseData = responseData === null || responseData === void 0 ? void 0 : responseData.comment;
                        }
                        //https://developer.twist.com/v3/#get-all-comments
                        if (operation === 'getAll') {
                            const threadId = this.getNodeParameter('threadId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            qs.thread_id = threadId;
                            Object.assign(qs, filters);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (qs.older_than_ts) {
                                qs.older_than_ts = (0, moment_1.default)(qs.older_than_ts).unix();
                            }
                            if (qs.newer_than_ts) {
                                qs.newer_than_ts = (0, moment_1.default)(qs.newer_than_ts).unix();
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/comments/get', {}, qs);
                            if (qs.as_ids) {
                                responseData = responseData.map(id => ({ ID: id }));
                            }
                        }
                        //https://developer.twist.com/v3/#update-comment
                        if (operation === 'update') {
                            const commentId = this.getNodeParameter('commentId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: commentId,
                            };
                            Object.assign(body, updateFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new Error(`No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/comments/update', body);
                        }
                    }
                    if (resource === 'messageConversation') {
                        //https://developer.twist.com/v3/#add-message-to-conversation
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const conversationId = this.getNodeParameter('conversationId', i);
                            const content = this.getNodeParameter('content', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                conversation_id: conversationId,
                                workspace_id: workspaceId,
                                content,
                            };
                            Object.assign(body, additionalFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            // if (body.direct_group_mentions) {
                            // 	const directGroupMentions: string[] = [];
                            // 	for (const directGroupMention of body.direct_group_mentions as number[]) {
                            // 		directGroupMentions.push(`[Group name](twist-group-mention://${directGroupMention})`);
                            // 	}
                            // 	body.content = `${directGroupMentions.join(' ')} ${body.content}`;
                            // }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/conversation_messages/add', body);
                        }
                        //https://developer.twist.com/v3/#get-message
                        if (operation === 'get') {
                            qs.id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/conversation_messages/getone', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-all-messages
                        if (operation === 'getAll') {
                            const conversationId = this.getNodeParameter('conversationId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.conversation_id = conversationId;
                            Object.assign(qs, additionalFields);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/conversation_messages/get', {}, qs);
                        }
                        //https://developer.twist.com/v3/#remove-message-from-conversation
                        if (operation === 'delete') {
                            qs.id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/conversation_messages/remove', {}, qs);
                        }
                        //https://developer.twist.com/v3/#update-message-in-conversation
                        if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id,
                            };
                            Object.assign(body, updateFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new Error(`No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/conversation_messages/update', body);
                        }
                    }
                    if (resource === 'thread') {
                        //https://developer.twist.com/v3/#add-thread
                        if (operation === 'create') {
                            const channelId = this.getNodeParameter('channelId', i);
                            const title = this.getNodeParameter('title', i);
                            const content = this.getNodeParameter('content', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                channel_id: channelId,
                                content,
                                title,
                            };
                            Object.assign(body, additionalFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new Error(`No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/threads/add', body);
                        }
                        //https://developer.twist.com/v3/#remove-thread
                        if (operation === 'delete') {
                            qs.id = this.getNodeParameter('threadId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/threads/remove', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-thread
                        if (operation === 'get') {
                            qs.id = this.getNodeParameter('threadId', i);
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/threads/getone', {}, qs);
                        }
                        //https://developer.twist.com/v3/#get-all-threads
                        if (operation === 'getAll') {
                            const channelId = this.getNodeParameter('channelId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            qs.channel_id = channelId;
                            Object.assign(qs, filters);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (qs.older_than_ts) {
                                qs.older_than_ts = (0, moment_1.default)(qs.older_than_ts).unix();
                            }
                            if (qs.newer_than_ts) {
                                qs.newer_than_ts = (0, moment_1.default)(qs.newer_than_ts).unix();
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'GET', '/threads/get', {}, qs);
                            if (qs.as_ids) {
                                responseData = responseData.map(id => ({ ID: id }));
                            }
                        }
                        //https://developer.twist.com/v3/#update-thread
                        if (operation === 'update') {
                            const threadId = this.getNodeParameter('threadId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: threadId,
                            };
                            Object.assign(body, updateFields);
                            if (body.actionsUi) {
                                const actions = body.actionsUi.actionValues;
                                if (actions) {
                                    body.actions = actions;
                                    delete body.actionsUi;
                                }
                            }
                            if (body.binaryProperties) {
                                const binaryProperties = body.binaryProperties.split(',');
                                const attachments = [];
                                for (const binaryProperty of binaryProperties) {
                                    const item = items[i].binary;
                                    const binaryData = item[binaryProperty];
                                    if (binaryData === undefined) {
                                        throw new Error(`No binary data property "${binaryProperty}" does not exists on item!`);
                                    }
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                    attachments.push(yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/attachments/upload', {}, {}, {
                                        formData: {
                                            file_name: {
                                                value: dataBuffer,
                                                options: {
                                                    filename: binaryData.fileName,
                                                },
                                            },
                                            attachment_id: (0, uuid_1.v4)(),
                                        },
                                    }));
                                }
                                body.attachments = attachments;
                            }
                            if (body.direct_mentions) {
                                const directMentions = [];
                                for (const directMention of body.direct_mentions) {
                                    directMentions.push(`[name](twist-mention://${directMention})`);
                                }
                                body.content = `${directMentions.join(' ')} ${body.content}`;
                            }
                            responseData = yield GenericFunctions_1.twistApiRequest.call(this, 'POST', '/threads/update', body);
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
exports.Twist = Twist;
