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
exports.Zulip = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const MessageDescription_1 = require("./MessageDescription");
const change_case_1 = require("change-case");
const StreamDescription_1 = require("./StreamDescription");
const UserDescription_1 = require("./UserDescription");
const GenericFunctions_2 = require("./GenericFunctions");
class Zulip {
    constructor() {
        this.description = {
            displayName: 'Zulip',
            name: 'zulip',
            icon: 'file:zulip.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Zulip API',
            defaults: {
                name: 'Zulip',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'zulipApi',
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
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Stream',
                            value: 'stream',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'message',
                },
                // MESSAGE
                ...MessageDescription_1.messageOperations,
                ...MessageDescription_1.messageFields,
                // STREAM
                ...StreamDescription_1.streamOperations,
                ...StreamDescription_1.streamFields,
                // USER
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available streams to display them to user so that he can
                // select them easily
                getStreams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { streams } = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', '/streams');
                        for (const stream of streams) {
                            const streamName = stream.name;
                            const streamId = stream.stream_id;
                            returnData.push({
                                name: streamName,
                                value: streamId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available topics to display them to user so that he can
                // select them easily
                getTopics() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const streamId = this.getCurrentNodeParameter('stream');
                        const returnData = [];
                        const { topics } = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/users/me/${streamId}/topics`);
                        for (const topic of topics) {
                            const topicName = topic.name;
                            const topicId = topic.name;
                            returnData.push({
                                name: topicName,
                                value: topicId,
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
                        const { members } = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', '/users');
                        for (const member of members) {
                            const memberName = member.full_name;
                            const memberId = member.email;
                            returnData.push({
                                name: memberName,
                                value: memberId,
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
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'message') {
                        //https://zulipchat.com/api/send-message
                        if (operation === 'sendPrivate') {
                            const to = this.getNodeParameter('to', i).join(',');
                            const content = this.getNodeParameter('content', i);
                            const body = {
                                type: 'private',
                                to,
                                content,
                            };
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'POST', '/messages', body);
                        }
                        //https://zulipchat.com/api/send-message
                        if (operation === 'sendStream') {
                            const stream = this.getNodeParameter('stream', i);
                            const topic = this.getNodeParameter('topic', i);
                            const content = this.getNodeParameter('content', i);
                            const body = {
                                type: 'stream',
                                to: stream,
                                topic,
                                content,
                            };
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'POST', '/messages', body);
                        }
                        //https://zulipchat.com/api/update-message
                        if (operation === 'update') {
                            const messageId = this.getNodeParameter('messageId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.content) {
                                body.content = updateFields.content;
                            }
                            if (updateFields.propagateMode) {
                                body.propagat_mode = (0, change_case_1.snakeCase)(updateFields.propagateMode);
                            }
                            if (updateFields.topic) {
                                body.topic = updateFields.topic;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'PATCH', `/messages/${messageId}`, body);
                        }
                        //https://zulipchat.com/api/get-raw-message
                        if (operation === 'get') {
                            const messageId = this.getNodeParameter('messageId', i);
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/messages/${messageId}`);
                        }
                        //https://zulipchat.com/api/delete-message
                        if (operation === 'delete') {
                            const messageId = this.getNodeParameter('messageId', i);
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'DELETE', `/messages/${messageId}`);
                        }
                        //https://zulipchat.com/api/upload-file
                        if (operation === 'updateFile') {
                            const credentials = yield this.getCredentials('zulipApi');
                            const binaryProperty = this.getNodeParameter('dataBinaryProperty', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            //@ts-ignore
                            if (items[i].binary[binaryProperty] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryProperty}" does not exists on item!`);
                            }
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                            const formData = {
                                file: {
                                    //@ts-ignore
                                    value: binaryDataBuffer,
                                    options: {
                                        //@ts-ignore
                                        filename: items[i].binary[binaryProperty].fileName,
                                        //@ts-ignore
                                        contentType: items[i].binary[binaryProperty].mimeType,
                                    },
                                },
                            };
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'POST', '/user_uploads', {}, {}, undefined, { formData });
                            responseData.uri = `${credentials.url}${responseData.uri}`;
                        }
                    }
                    if (resource === 'stream') {
                        const body = {};
                        if (operation === 'getAll') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.includePublic) {
                                body.include_public = additionalFields.includePublic;
                            }
                            if (additionalFields.includeSubscribed) {
                                body.include_subscribed = additionalFields.includeSubscribed;
                            }
                            if (additionalFields.includeAllActive) {
                                body.include_all_active = additionalFields.includeAllActive;
                            }
                            if (additionalFields.includeDefault) {
                                body.include_default = additionalFields.includeDefault;
                            }
                            if (additionalFields.includeOwnersubscribed) {
                                body.include_owner_subscribed = additionalFields.includeOwnersubscribed;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/streams`, body);
                            responseData = responseData.streams;
                        }
                        if (operation === 'getSubscribed') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.includeSubscribers) {
                                body.include_subscribers = additionalFields.includeSubscribers;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/users/me/subscriptions`, body);
                            responseData = responseData.subscriptions;
                        }
                        if (operation === 'create') {
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            const subscriptions = this.getNodeParameter('subscriptions', i);
                            body.subscriptions = JSON.stringify(subscriptions.properties);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_2.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                const subscriptions = this.getNodeParameter('subscriptions', i);
                                body.subscriptions = JSON.stringify(subscriptions.properties);
                                if (additionalFields.inviteOnly) {
                                    body.invite_only = additionalFields.inviteOnly;
                                }
                                if (additionalFields.principals) {
                                    const principals = [];
                                    //@ts-ignore
                                    additionalFields.principals.properties.map((principal) => {
                                        principals.push(principal.email);
                                    });
                                    body.principals = JSON.stringify(principals);
                                }
                                if (additionalFields.authorizationErrorsFatal) {
                                    body.authorization_errors_fatal = additionalFields.authorizationErrorsFatal;
                                }
                                if (additionalFields.historyPublicToSubscribers) {
                                    body.history_public_to_subscribers = additionalFields.historyPublicToSubscribers;
                                }
                                if (additionalFields.streamPostPolicy) {
                                    body.stream_post_policy = additionalFields.streamPostPolicy;
                                }
                                if (additionalFields.announce) {
                                    body.announce = additionalFields.announce;
                                }
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'POST', `/users/me/subscriptions`, body);
                        }
                        if (operation === 'delete') {
                            const streamId = this.getNodeParameter('streamId', i);
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'DELETE', `/streams/${streamId}`, {});
                        }
                        if (operation === 'update') {
                            const streamId = this.getNodeParameter('streamId', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_2.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.description) {
                                    body.description = JSON.stringify(additionalFields.description);
                                }
                                if (additionalFields.newName) {
                                    body.new_name = JSON.stringify(additionalFields.newName);
                                }
                                if (additionalFields.isPrivate) {
                                    body.is_private = additionalFields.isPrivate;
                                }
                                if (additionalFields.isAnnouncementOnly) {
                                    body.is_announcement_only = additionalFields.isAnnouncementOnly;
                                }
                                if (additionalFields.streamPostPolicy) {
                                    body.stream_post_policy = additionalFields.streamPostPolicy;
                                }
                                if (additionalFields.historyPublicToSubscribers) {
                                    body.history_public_to_subscribers = additionalFields.historyPublicToSubscribers;
                                }
                                responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'PATCH', `/streams/${streamId}`, body);
                            }
                        }
                    }
                    if (resource === 'user') {
                        const body = {};
                        if (operation === 'get') {
                            const userId = this.getNodeParameter('userId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.clientGravatar) {
                                body.client_gravatar = additionalFields.client_gravatar;
                            }
                            if (additionalFields.includeCustomProfileFields) {
                                body.include_custom_profile_fields = additionalFields.includeCustomProfileFields;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/users/${userId}`, body);
                        }
                        if (operation === 'getAll') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.clientGravatar) {
                                body.client_gravatar = additionalFields.client_gravatar;
                            }
                            if (additionalFields.includeCustomProfileFields) {
                                body.include_custom_profile_fields = additionalFields.includeCustomProfileFields;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'GET', `/users`, body);
                            responseData = responseData.members;
                        }
                        if (operation === 'create') {
                            body.email = this.getNodeParameter('email', i);
                            body.password = this.getNodeParameter('password', i);
                            body.full_name = this.getNodeParameter('fullName', i);
                            body.short_name = this.getNodeParameter('shortName', i);
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'POST', `/users`, body);
                        }
                        if (operation === 'update') {
                            const userId = this.getNodeParameter('userId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.fullName) {
                                body.full_name = JSON.stringify(additionalFields.fullName);
                            }
                            if (additionalFields.isAdmin) {
                                body.is_admin = additionalFields.isAdmin;
                            }
                            if (additionalFields.isGuest) {
                                body.is_guest = additionalFields.isGuest;
                            }
                            if (additionalFields.role) {
                                body.role = additionalFields.role;
                            }
                            if (additionalFields.profileData) {
                                //@ts-ignore
                                body.profile_data = additionalFields.profileData.properties;
                            }
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'PATCH', `/users/${userId}`, body);
                        }
                        if (operation === 'deactivate') {
                            const userId = this.getNodeParameter('userId', i);
                            responseData = yield GenericFunctions_1.zulipApiRequest.call(this, 'DELETE', `/users/${userId}`, body);
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
exports.Zulip = Zulip;
