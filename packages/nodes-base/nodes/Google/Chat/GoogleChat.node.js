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
exports.GoogleChat = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class GoogleChat {
    constructor() {
        this.description = {
            displayName: 'Google Chat',
            name: 'googleChat',
            icon: 'file:googleChat.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Google Chat API',
            defaults: {
                name: 'Google Chat',
                color: '#0aa55c',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    testedBy: 'testGoogleTokenAuth',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    required: true,
                    noDataExpression: true,
                    type: 'options',
                    options: [
                        // {
                        // 	name: 'Attachment',
                        // 	value: 'attachment',
                        // },
                        // {
                        // 	name: 'Incoming Webhook',
                        // 	value: 'incomingWebhook',
                        // },
                        // {
                        // 	name: 'Media',
                        // 	value: 'media',
                        // },
                        {
                            name: 'Member',
                            value: 'member',
                        },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Space',
                            value: 'space',
                        },
                    ],
                    default: 'message',
                },
                // ...attachmentOperations,
                // ...attachmentFields,
                // ...incomingWebhookOperations,
                // ...incomingWebhookFields,
                // ...mediaOperations,
                // ...mediaFields,
                ...descriptions_1.memberOperations,
                ...descriptions_1.memberFields,
                ...descriptions_1.messageOperations,
                ...descriptions_1.messageFields,
                ...descriptions_1.spaceOperations,
                ...descriptions_1.spaceFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the spaces to display them to user so that he can
                // select them easily
                getSpaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const spaces = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'spaces', 'GET', `/v1/spaces`);
                        for (const space of spaces) {
                            returnData.push({
                                name: space.displayName,
                                value: space.name,
                            });
                        }
                        return returnData;
                    });
                },
            },
            credentialTest: {
                testGoogleTokenAuth(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const scopes = [
                            'https://www.googleapis.com/auth/chat.bot',
                        ];
                        const now = (0, moment_timezone_1.default)().unix();
                        const email = credential.data.email.trim();
                        const privateKey = credential.data.privateKey.replace(/\\n/g, '\n').trim();
                        try {
                            const signature = jsonwebtoken_1.default.sign({
                                'iss': email,
                                'sub': credential.data.delegatedEmail || email,
                                'scope': scopes.join(' '),
                                'aud': `https://oauth2.googleapis.com/token`,
                                'iat': now,
                                'exp': now,
                            }, privateKey, {
                                algorithm: 'RS256',
                                header: {
                                    'kid': privateKey,
                                    'typ': 'JWT',
                                    'alg': 'RS256',
                                },
                            });
                            const options = {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                method: 'POST',
                                form: {
                                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                                    assertion: signature,
                                },
                                uri: 'https://oauth2.googleapis.com/token',
                                json: true,
                            };
                            const response = yield this.helpers.request(options);
                            if (!response.access_token) {
                                return {
                                    status: 'Error',
                                    message: JSON.stringify(response),
                                };
                            }
                        }
                        catch (err) {
                            return {
                                status: 'Error',
                                message: `${err.message}`,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
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
                    if (resource === 'media') {
                        if (operation === 'download') {
                            // ----------------------------------------
                            //             media: download
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/media/download
                            const resourceName = this.getNodeParameter('resourceName', i);
                            const endpoint = `/v1/media/${resourceName}?alt=media`;
                            // Return the data as a buffer
                            const encoding = null;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', endpoint, undefined, undefined, undefined, undefined, encoding);
                            const newItem = {
                                json: items[i].json,
                                binary: {},
                            };
                            if (items[i].binary !== undefined) {
                                // Create a shallow copy of the binary data so that the old
                                // data references which do not get changed still stay behind
                                // but the incoming data does not get changed.
                                Object.assign(newItem.binary, items[i].binary);
                            }
                            items[i] = newItem;
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            items[i].binary[binaryPropertyName] = yield this.helpers.prepareBinaryData(responseData, endpoint);
                        }
                    }
                    else if (resource === 'space') {
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             space: get
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces/get
                            const spaceId = this.getNodeParameter('spaceId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/${spaceId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             space: getAll
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces/list
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'spaces', 'GET', `/v1/spaces`);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.pageSize = limit;
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/spaces`, undefined, qs);
                                responseData = responseData.spaces;
                            }
                        }
                    }
                    else if (resource === 'member') {
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             member: get
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.members/get
                            const memberId = this.getNodeParameter('memberId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/${memberId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             member: getAll
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.members/list
                            const spaceId = this.getNodeParameter('spaceId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'memberships', 'GET', `/v1/${spaceId}/members`, undefined, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.pageSize = limit;
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/${spaceId}/members`, undefined, qs);
                                responseData = responseData.memberships;
                            }
                        }
                    }
                    else if (resource === 'message') {
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             message: create
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.messages/create
                            const spaceId = this.getNodeParameter('spaceId', i);
                            // get additional fields for threadKey and requestId
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.threadKey) {
                                qs.threadKey = additionalFields.threadKey;
                            }
                            if (additionalFields.requestId) {
                                qs.requestId = additionalFields.requestId;
                            }
                            let message = {};
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const messageJson = this.getNodeParameter('messageJson', i);
                                if (messageJson instanceof Object) {
                                    // if it is an object
                                    message = messageJson;
                                }
                                else {
                                    // if it is a string
                                    if ((0, GenericFunctions_1.validateJSON)(messageJson) !== undefined) {
                                        message = JSON.parse(messageJson);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Message (JSON) must be a valid json');
                                    }
                                }
                            }
                            else {
                                const messageUi = this.getNodeParameter('messageUi', i);
                                if (messageUi.text && messageUi.text !== '') {
                                    message.text = messageUi.text;
                                }
                                else {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Message Text must be provided.');
                                }
                                // 	// TODO: get cards from the UI
                                // if (messageUi?.cards?.metadataValues && messageUi?.cards?.metadataValues.length !== 0) {
                                // 	const cards = messageUi.cards.metadataValues as IDataObject[]; // TODO: map cards to messageUi.cards.metadataValues
                                // 	message.cards = cards;
                                // }
                            }
                            const body = {};
                            Object.assign(body, message);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/v1/${spaceId}/messages`, body, qs);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             message: delete
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.messages/delete
                            const messageId = this.getNodeParameter('messageId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/v1/${messageId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             message: get
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.messages/get
                            const messageId = this.getNodeParameter('messageId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/${messageId}`);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             message: update
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.messages/update
                            const messageId = this.getNodeParameter('messageId', i);
                            let message = {};
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const updateFieldsJson = this.getNodeParameter('updateFieldsJson', i);
                                if (updateFieldsJson instanceof Object) {
                                    // if it is an object
                                    message = updateFieldsJson;
                                }
                                else {
                                    // if it is a string
                                    if ((0, GenericFunctions_1.validateJSON)(updateFieldsJson) !== undefined) {
                                        message = JSON.parse(updateFieldsJson);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Update Fields (JSON) must be a valid json');
                                    }
                                }
                            }
                            else {
                                const updateFieldsUi = this.getNodeParameter('updateFieldsUi', i);
                                if (updateFieldsUi.text) {
                                    message.text = updateFieldsUi.text;
                                }
                                // // TODO: get cards from the UI
                                // if (updateFieldsUi.cards) {
                                // 	message.cards = updateFieldsUi.cards as IDataObject[];
                                // }
                            }
                            const body = {};
                            Object.assign(body, message);
                            // get update mask
                            let updateMask = '';
                            if (message.text) {
                                updateMask += 'text,';
                            }
                            if (message.cards) {
                                updateMask += 'cards,';
                            }
                            updateMask = updateMask.slice(0, -1); // remove trailing comma
                            qs.updateMask = updateMask;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/v1/${messageId}`, body, qs);
                        }
                    }
                    else if (resource === 'attachment') {
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             attachment: get
                            // ----------------------------------------
                            // https://developers.google.com/chat/reference/rest/v1/spaces.messages.attachments/get
                            const attachmentName = this.getNodeParameter('attachmentName', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/v1/${attachmentName}`);
                        }
                    }
                    else if (resource === 'incomingWebhook') {
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             incomingWebhook: create
                            // ----------------------------------------
                            // https://developers.google.com/chat/how-tos/webhooks
                            const uri = this.getNodeParameter('incomingWebhookUrl', i);
                            // get additional fields for threadKey
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.threadKey) {
                                qs.threadKey = additionalFields.threadKey;
                            }
                            let message = {};
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const messageJson = this.getNodeParameter('messageJson', i);
                                if (messageJson instanceof Object) {
                                    // if it is an object
                                    message = messageJson;
                                }
                                else {
                                    // if it is a string
                                    if ((0, GenericFunctions_1.validateJSON)(messageJson) !== undefined) {
                                        message = JSON.parse(messageJson);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Message (JSON) must be a valid json');
                                    }
                                }
                            }
                            else {
                                const messageUi = this.getNodeParameter('messageUi', i);
                                if (messageUi.text && messageUi.text !== '') {
                                    message.text = messageUi.text;
                                }
                                else {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Message Text must be provided.');
                                }
                            }
                            const body = {};
                            Object.assign(body, message);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '', body, qs, uri, true);
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
                        // Return the actual reason as error
                        if (operation === 'download') {
                            items[i].json = { error: error.message };
                        }
                        else {
                            returnData.push({ error: error.message });
                        }
                        continue;
                    }
                    throw error;
                }
            }
            if (operation === 'download') {
                // For file downloads the files get attached to the existing items
                return this.prepareOutputData(items);
            }
            else {
                // For all other ones does the output get replaced
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.GoogleChat = GoogleChat;
