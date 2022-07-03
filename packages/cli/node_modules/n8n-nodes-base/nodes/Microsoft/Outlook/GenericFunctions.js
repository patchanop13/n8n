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
exports.downloadAttachments = exports.createMessage = exports.makeRecipient = exports.microsoftApiRequestAllItemsSkip = exports.microsoftApiRequestAllItems = exports.microsoftApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function microsoftApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = { json: true }) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('microsoftOutlookOAuth2Api');
        let apiUrl = `https://graph.microsoft.com/v1.0/me${resource}`;
        // If accessing shared mailbox
        if (credentials.useShared && credentials.userPrincipalName) {
            apiUrl = `https://graph.microsoft.com/v1.0/users/${credentials.userPrincipalName}${resource}`;
        }
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || apiUrl,
        };
        try {
            Object.assign(options, option);
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'microsoftOutlookOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.microsoftApiRequest = microsoftApiRequest;
function microsoftApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query['$top'] = 100;
        do {
            responseData = yield microsoftApiRequest.call(this, method, endpoint, body, query, uri, headers);
            uri = responseData['@odata.nextLink'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['@odata.nextLink'] !== undefined);
        return returnData;
    });
}
exports.microsoftApiRequestAllItems = microsoftApiRequestAllItems;
function microsoftApiRequestAllItemsSkip(propertyName, method, endpoint, body = {}, query = {}, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query['$top'] = 100;
        query['$skip'] = 0;
        do {
            responseData = yield microsoftApiRequest.call(this, method, endpoint, body, query, undefined, headers);
            query['$skip'] += query['$top'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['value'].length !== 0);
        return returnData;
    });
}
exports.microsoftApiRequestAllItemsSkip = microsoftApiRequestAllItemsSkip;
function makeRecipient(email) {
    return {
        emailAddress: {
            address: email,
        },
    };
}
exports.makeRecipient = makeRecipient;
function createMessage(fields) {
    const message = {};
    // Create body object
    if (fields.bodyContent || fields.bodyContentType) {
        const bodyObject = {
            content: fields.bodyContent,
            contentType: fields.bodyContentType,
        };
        message['body'] = bodyObject;
        delete fields['bodyContent'];
        delete fields['bodyContentType'];
    }
    // Handle custom headers
    if ('internetMessageHeaders' in fields && 'headers' in fields.internetMessageHeaders) {
        fields.internetMessageHeaders = fields.internetMessageHeaders.headers;
    }
    // Handle recipient fields
    ['bccRecipients', 'ccRecipients', 'replyTo', 'sender', 'toRecipients'].forEach(key => {
        if (Array.isArray(fields[key])) {
            fields[key] = fields[key].map(email => makeRecipient(email));
        }
        else if (fields[key] !== undefined) {
            fields[key] = fields[key].split(',').map((recipient) => makeRecipient(recipient));
        }
    });
    ['from', 'sender'].forEach(key => {
        if (fields[key] !== undefined) {
            fields[key] = makeRecipient(fields[key]);
        }
    });
    Object.assign(message, fields);
    return message;
}
exports.createMessage = createMessage;
function downloadAttachments(messages, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const elements = [];
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        for (const message of messages) {
            const element = {
                json: message,
                binary: {},
            };
            if (message.hasAttachments === true) {
                const attachments = yield microsoftApiRequestAllItems.call(this, 'value', 'GET', `/messages/${message.id}/attachments`, {});
                for (const [index, attachment] of attachments.entries()) {
                    const response = yield microsoftApiRequest.call(this, 'GET', `/messages/${message.id}/attachments/${attachment.id}/$value`, undefined, {}, undefined, {}, { encoding: null, resolveWithFullResponse: true });
                    const data = Buffer.from(response.body, 'utf8');
                    element.binary[`${prefix}${index}`] = yield this.helpers.prepareBinaryData(data, attachment.name, attachment.contentType);
                }
            }
            if (Object.keys(element.binary).length === 0) {
                delete element.binary;
            }
            elements.push(element);
        }
        return elements;
    });
}
exports.downloadAttachments = downloadAttachments;
