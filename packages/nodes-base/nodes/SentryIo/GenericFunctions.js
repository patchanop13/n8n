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
exports.sentryApiRequestAllItems = exports.sentryIoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function sentryIoApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authentication = this.getNodeParameter('authentication', 0);
        const version = this.getNodeParameter('sentryVersion', 0);
        const options = {
            headers: {},
            method,
            qs,
            body,
            uri: uri || `https://sentry.io${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (options.qs.limit) {
            delete options.qs.limit;
        }
        let credentialName;
        try {
            if (authentication === 'accessToken') {
                if (version === 'cloud') {
                    credentialName = 'sentryIoApi';
                }
                else {
                    credentialName = 'sentryIoServerApi';
                }
                const credentials = yield this.getCredentials(credentialName);
                if (credentials.url) {
                    options.uri = `${credentials === null || credentials === void 0 ? void 0 : credentials.url}${resource}`;
                }
                options.headers = {
                    Authorization: `Bearer ${credentials === null || credentials === void 0 ? void 0 : credentials.token}`,
                };
                //@ts-ignore
                return this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'sentryIoOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.sentryIoApiRequest = sentryIoApiRequest;
function sentryApiRequestAllItems(method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let link;
        let uri;
        do {
            responseData = yield sentryIoApiRequest.call(this, method, resource, body, query, uri, { resolveWithFullResponse: true });
            link = responseData.headers.link;
            uri = getNext(link);
            returnData.push.apply(returnData, responseData.body);
            if (query.limit && (query.limit >= returnData.length)) {
                return;
            }
        } while (hasMore(link));
        return returnData;
    });
}
exports.sentryApiRequestAllItems = sentryApiRequestAllItems;
function getNext(link) {
    if (link === undefined) {
        return;
    }
    const next = link.split(',')[1];
    if (next.includes('rel="next"')) {
        return next.split(';')[0].replace('<', '').replace('>', '').trim();
    }
}
function hasMore(link) {
    if (link === undefined) {
        return;
    }
    const next = link.split(',')[1];
    if (next.includes('rel="next"')) {
        return next.includes('results="true"');
    }
}
