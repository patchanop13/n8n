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
exports.Gmail = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const MessageDescription_1 = require("./MessageDescription");
const MessageLabelDescription_1 = require("./MessageLabelDescription");
const LabelDescription_1 = require("./LabelDescription");
const DraftDescription_1 = require("./DraftDescription");
const lodash_1 = require("lodash");
class Gmail {
    constructor() {
        this.description = {
            displayName: 'Gmail',
            name: 'gmail',
            icon: 'file:gmail.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Gmail API',
            defaults: {
                name: 'Gmail',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                },
                {
                    name: 'gmailOAuth2',
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
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'oAuth2',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Draft',
                            value: 'draft',
                        },
                        {
                            name: 'Label',
                            value: 'label',
                        },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Message Label',
                            value: 'messageLabel',
                        },
                    ],
                    default: 'draft',
                },
                //-------------------------------
                // Draft Operations
                //-------------------------------
                ...DraftDescription_1.draftOperations,
                ...DraftDescription_1.draftFields,
                //-------------------------------
                // Label Operations
                //-------------------------------
                ...LabelDescription_1.labelOperations,
                ...LabelDescription_1.labelFields,
                //-------------------------------
                // Message Operations
                //-------------------------------
                ...MessageDescription_1.messageOperations,
                ...MessageDescription_1.messageFields,
                //-------------------------------
                // MessageLabel Operations
                //-------------------------------
                ...MessageLabelDescription_1.messageLabelOperations,
                ...MessageLabelDescription_1.messageLabelFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the labels to display them to user so that he can
                // select them easily
                getLabels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const labels = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'labels', 'GET', '/gmail/v1/users/me/labels');
                        for (const label of labels) {
                            const labelName = label.name;
                            const labelId = label.id;
                            returnData.push({
                                name: labelName,
                                value: labelId,
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let method = '';
            let body = {};
            let qs = {};
            let endpoint = '';
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'label') {
                        if (operation === 'create') {
                            //https://developers.google.com/gmail/api/v1/reference/users/labels/create
                            const labelName = this.getNodeParameter('name', i);
                            const labelListVisibility = this.getNodeParameter('labelListVisibility', i);
                            const messageListVisibility = this.getNodeParameter('messageListVisibility', i);
                            method = 'POST';
                            endpoint = '/gmail/v1/users/me/labels';
                            body = {
                                labelListVisibility,
                                messageListVisibility,
                                name: labelName,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'delete') {
                            //https://developers.google.com/gmail/api/v1/reference/users/labels/delete
                            const labelId = this.getNodeParameter('labelId', i);
                            method = 'DELETE';
                            endpoint = `/gmail/v1/users/me/labels/${labelId}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            // https://developers.google.com/gmail/api/v1/reference/users/labels/get
                            const labelId = this.getNodeParameter('labelId', i);
                            method = 'GET';
                            endpoint = `/gmail/v1/users/me/labels/${labelId}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/labels`, {}, qs);
                            responseData = responseData.labels;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                    }
                    if (resource === 'messageLabel') {
                        if (operation === 'remove') {
                            //https://developers.google.com/gmail/api/v1/reference/users/messages/modify
                            const messageID = this.getNodeParameter('messageId', i);
                            const labelIds = this.getNodeParameter('labelIds', i);
                            method = 'POST';
                            endpoint = `/gmail/v1/users/me/messages/${messageID}/modify`;
                            body = {
                                removeLabelIds: labelIds,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'add') {
                            // https://developers.google.com/gmail/api/v1/reference/users/messages/modify
                            const messageID = this.getNodeParameter('messageId', i);
                            const labelIds = this.getNodeParameter('labelIds', i);
                            method = 'POST';
                            endpoint = `/gmail/v1/users/me/messages/${messageID}/modify`;
                            body = {
                                addLabelIds: labelIds,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                    }
                    if (resource === 'message') {
                        if (operation === 'send') {
                            // https://developers.google.com/gmail/api/v1/reference/users/messages/send
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let toStr = '';
                            let ccStr = '';
                            let bccStr = '';
                            let attachmentsList = [];
                            const toList = this.getNodeParameter('toList', i);
                            toList.forEach((email) => {
                                toStr += `<${email}>, `;
                            });
                            if (additionalFields.ccList) {
                                const ccList = additionalFields.ccList;
                                ccList.forEach((email) => {
                                    ccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.bccList) {
                                const bccList = additionalFields.bccList;
                                bccList.forEach((email) => {
                                    bccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.attachmentsUi) {
                                const attachmentsUi = additionalFields.attachmentsUi;
                                const attachmentsBinary = [];
                                if (!(0, lodash_1.isEmpty)(attachmentsUi)) {
                                    if (attachmentsUi.hasOwnProperty('attachmentsBinary')
                                        && !(0, lodash_1.isEmpty)(attachmentsUi.attachmentsBinary)
                                        && items[i].binary) {
                                        // @ts-ignore
                                        for (const { property } of attachmentsUi.attachmentsBinary) {
                                            for (const binaryProperty of property.split(',')) {
                                                if (items[i].binary[binaryProperty] !== undefined) {
                                                    const binaryData = items[i].binary[binaryProperty];
                                                    const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                                    attachmentsBinary.push({
                                                        name: binaryData.fileName || 'unknown',
                                                        content: binaryDataBuffer,
                                                        type: binaryData.mimeType,
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    qs = {
                                        userId: 'me',
                                        uploadType: 'media',
                                    };
                                    attachmentsList = attachmentsBinary;
                                }
                            }
                            const email = {
                                from: additionalFields.senderName || '',
                                to: toStr,
                                cc: ccStr,
                                bcc: bccStr,
                                subject: this.getNodeParameter('subject', i),
                                body: this.getNodeParameter('message', i),
                                attachments: attachmentsList,
                            };
                            if (this.getNodeParameter('includeHtml', i, false) === true) {
                                email.htmlBody = this.getNodeParameter('htmlMessage', i);
                            }
                            endpoint = '/gmail/v1/users/me/messages/send';
                            method = 'POST';
                            body = {
                                raw: yield (0, GenericFunctions_1.encodeEmail)(email),
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'reply') {
                            const id = this.getNodeParameter('messageId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let toStr = '';
                            let ccStr = '';
                            let bccStr = '';
                            let attachmentsList = [];
                            const toList = this.getNodeParameter('toList', i);
                            toList.forEach((email) => {
                                toStr += `<${email}>, `;
                            });
                            if (additionalFields.ccList) {
                                const ccList = additionalFields.ccList;
                                ccList.forEach((email) => {
                                    ccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.bccList) {
                                const bccList = additionalFields.bccList;
                                bccList.forEach((email) => {
                                    bccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.attachmentsUi) {
                                const attachmentsUi = additionalFields.attachmentsUi;
                                const attachmentsBinary = [];
                                if (!(0, lodash_1.isEmpty)(attachmentsUi)) {
                                    if (attachmentsUi.hasOwnProperty('attachmentsBinary')
                                        && !(0, lodash_1.isEmpty)(attachmentsUi.attachmentsBinary)
                                        && items[i].binary) {
                                        // @ts-ignore
                                        for (const { property } of attachmentsUi.attachmentsBinary) {
                                            for (const binaryProperty of property.split(',')) {
                                                if (items[i].binary[binaryProperty] !== undefined) {
                                                    const binaryData = items[i].binary[binaryProperty];
                                                    const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                                    attachmentsBinary.push({
                                                        name: binaryData.fileName || 'unknown',
                                                        content: binaryDataBuffer,
                                                        type: binaryData.mimeType,
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    qs = {
                                        userId: 'me',
                                        uploadType: 'media',
                                    };
                                    attachmentsList = attachmentsBinary;
                                }
                            }
                            // if no recipient is defined then grab the one who sent the email
                            if (toStr === '') {
                                endpoint = `/gmail/v1/users/me/messages/${id}`;
                                qs.format = 'metadata';
                                const { payload } = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                                for (const header of payload.headers) {
                                    if (header.name === 'From') {
                                        toStr = `<${(0, GenericFunctions_1.extractEmail)(header.value)}>,`;
                                        break;
                                    }
                                }
                            }
                            const email = {
                                from: additionalFields.senderName || '',
                                to: toStr,
                                cc: ccStr,
                                bcc: bccStr,
                                subject: this.getNodeParameter('subject', i),
                                body: this.getNodeParameter('message', i),
                                attachments: attachmentsList,
                            };
                            if (this.getNodeParameter('includeHtml', i, false) === true) {
                                email.htmlBody = this.getNodeParameter('htmlMessage', i);
                            }
                            endpoint = '/gmail/v1/users/me/messages/send';
                            method = 'POST';
                            email.inReplyTo = id;
                            email.reference = id;
                            body = {
                                raw: yield (0, GenericFunctions_1.encodeEmail)(email),
                                threadId: this.getNodeParameter('threadId', i),
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'get') {
                            //https://developers.google.com/gmail/api/v1/reference/users/messages/get
                            method = 'GET';
                            const id = this.getNodeParameter('messageId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const format = additionalFields.format || 'resolved';
                            if (format === 'resolved') {
                                qs.format = 'raw';
                            }
                            else {
                                qs.format = format;
                            }
                            endpoint = `/gmail/v1/users/me/messages/${id}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                            let nodeExecutionData;
                            if (format === 'resolved') {
                                const dataPropertyNameDownload = additionalFields.dataPropertyAttachmentsPrefixName || 'attachment_';
                                nodeExecutionData = yield GenericFunctions_1.parseRawEmail.call(this, responseData, dataPropertyNameDownload);
                            }
                            else {
                                nodeExecutionData = {
                                    json: responseData,
                                };
                            }
                            responseData = nodeExecutionData;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (qs.labelIds) {
                                // tslint:disable-next-line: triple-equals
                                if (qs.labelIds == '') {
                                    delete qs.labelIds;
                                }
                                else {
                                    qs.labelIds = qs.labelIds;
                                }
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'messages', 'GET', `/gmail/v1/users/me/messages`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/messages`, {}, qs);
                                responseData = responseData.messages;
                            }
                            if (responseData === undefined) {
                                responseData = [];
                            }
                            const format = additionalFields.format || 'resolved';
                            if (format !== 'ids') {
                                if (format === 'resolved') {
                                    qs.format = 'raw';
                                }
                                else {
                                    qs.format = format;
                                }
                                for (let i = 0; i < responseData.length; i++) {
                                    responseData[i] = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/messages/${responseData[i].id}`, body, qs);
                                    if (format === 'resolved') {
                                        const dataPropertyNameDownload = additionalFields.dataPropertyAttachmentsPrefixName || 'attachment_';
                                        responseData[i] = yield GenericFunctions_1.parseRawEmail.call(this, responseData[i], dataPropertyNameDownload);
                                    }
                                }
                            }
                            if (format !== 'resolved') {
                                responseData = this.helpers.returnJsonArray(responseData);
                            }
                        }
                        if (operation === 'delete') {
                            // https://developers.google.com/gmail/api/v1/reference/users/messages/delete
                            method = 'DELETE';
                            const id = this.getNodeParameter('messageId', i);
                            endpoint = `/gmail/v1/users/me/messages/${id}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'draft') {
                        if (operation === 'create') {
                            // https://developers.google.com/gmail/api/v1/reference/users/drafts/create
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let toStr = '';
                            let ccStr = '';
                            let bccStr = '';
                            let attachmentsList = [];
                            if (additionalFields.toList) {
                                const toList = additionalFields.toList;
                                toList.forEach((email) => {
                                    toStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.ccList) {
                                const ccList = additionalFields.ccList;
                                ccList.forEach((email) => {
                                    ccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.bccList) {
                                const bccList = additionalFields.bccList;
                                bccList.forEach((email) => {
                                    bccStr += `<${email}>, `;
                                });
                            }
                            if (additionalFields.attachmentsUi) {
                                const attachmentsUi = additionalFields.attachmentsUi;
                                const attachmentsBinary = [];
                                if (!(0, lodash_1.isEmpty)(attachmentsUi)) {
                                    if (!(0, lodash_1.isEmpty)(attachmentsUi)) {
                                        if (attachmentsUi.hasOwnProperty('attachmentsBinary')
                                            && !(0, lodash_1.isEmpty)(attachmentsUi.attachmentsBinary)
                                            && items[i].binary) {
                                            for (const { property } of attachmentsUi.attachmentsBinary) {
                                                for (const binaryProperty of property.split(',')) {
                                                    if (items[i].binary[binaryProperty] !== undefined) {
                                                        const binaryData = items[i].binary[binaryProperty];
                                                        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                                                        attachmentsBinary.push({
                                                            name: binaryData.fileName || 'unknown',
                                                            content: binaryDataBuffer,
                                                            type: binaryData.mimeType,
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    qs = {
                                        userId: 'me',
                                        uploadType: 'media',
                                    };
                                    attachmentsList = attachmentsBinary;
                                }
                            }
                            const email = {
                                to: toStr,
                                cc: ccStr,
                                bcc: bccStr,
                                subject: this.getNodeParameter('subject', i),
                                body: this.getNodeParameter('message', i),
                                attachments: attachmentsList,
                            };
                            if (this.getNodeParameter('includeHtml', i, false) === true) {
                                email.htmlBody = this.getNodeParameter('htmlMessage', i);
                            }
                            endpoint = '/gmail/v1/users/me/drafts';
                            method = 'POST';
                            body = {
                                message: {
                                    raw: yield (0, GenericFunctions_1.encodeEmail)(email),
                                },
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                        }
                        if (operation === 'get') {
                            // https://developers.google.com/gmail/api/v1/reference/users/drafts/get
                            method = 'GET';
                            const id = this.getNodeParameter('messageId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const format = additionalFields.format || 'resolved';
                            if (format === 'resolved') {
                                qs.format = 'raw';
                            }
                            else {
                                qs.format = format;
                            }
                            endpoint = `/gmail/v1/users/me/drafts/${id}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                            const binaryData = {};
                            let nodeExecutionData;
                            if (format === 'resolved') {
                                const dataPropertyNameDownload = additionalFields.dataPropertyAttachmentsPrefixName || 'attachment_';
                                nodeExecutionData = yield GenericFunctions_1.parseRawEmail.call(this, responseData.message, dataPropertyNameDownload);
                                // Add the draft-id
                                nodeExecutionData.json.messageId = nodeExecutionData.json.id;
                                nodeExecutionData.json.id = responseData.id;
                            }
                            else {
                                nodeExecutionData = {
                                    json: responseData,
                                    binary: Object.keys(binaryData).length ? binaryData : undefined,
                                };
                            }
                            responseData = nodeExecutionData;
                        }
                        if (operation === 'delete') {
                            // https://developers.google.com/gmail/api/v1/reference/users/drafts/delete
                            method = 'DELETE';
                            const id = this.getNodeParameter('messageId', i);
                            endpoint = `/gmail/v1/users/me/drafts/${id}`;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'drafts', 'GET', `/gmail/v1/users/me/drafts`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/drafts`, {}, qs);
                                responseData = responseData.drafts;
                            }
                            if (responseData === undefined) {
                                responseData = [];
                            }
                            const format = additionalFields.format || 'resolved';
                            if (format !== 'ids') {
                                if (format === 'resolved') {
                                    qs.format = 'raw';
                                }
                                else {
                                    qs.format = format;
                                }
                                for (let i = 0; i < responseData.length; i++) {
                                    responseData[i] = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/drafts/${responseData[i].id}`, body, qs);
                                    if (format === 'resolved') {
                                        const dataPropertyNameDownload = additionalFields.dataPropertyAttachmentsPrefixName || 'attachment_';
                                        const id = responseData[i].id;
                                        responseData[i] = yield GenericFunctions_1.parseRawEmail.call(this, responseData[i].message, dataPropertyNameDownload);
                                        // Add the draft-id
                                        responseData[i].json.messageId = responseData[i].json.id;
                                        responseData[i].json.id = id;
                                    }
                                }
                            }
                            if (format !== 'resolved') {
                                responseData = this.helpers.returnJsonArray(responseData);
                            }
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
            if (['draft', 'message'].includes(resource) && ['get', 'getAll'].includes(operation)) {
                //@ts-ignore
                return this.prepareOutputData(returnData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Gmail = Gmail;
