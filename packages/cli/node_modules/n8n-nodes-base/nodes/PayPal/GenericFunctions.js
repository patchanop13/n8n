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
exports.upperFist = exports.validateJSON = exports.payPalApiRequestAllItems = exports.payPalApiRequest = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
function payPalApiRequest(endpoint, method, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('payPalApi');
        const env = getEnvironment(credentials.env);
        const tokenInfo = yield getAccessToken.call(this);
        const headerWithAuthentication = Object.assign({}, { Authorization: `Bearer ${tokenInfo.access_token}`, 'Content-Type': 'application/json' });
        const options = {
            headers: headerWithAuthentication,
            method,
            qs: query || {},
            uri: uri || `${env}/v1${endpoint}`,
            body,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.payPalApiRequest = payPalApiRequest;
function getEnvironment(env) {
    // @ts-ignore
    return {
        'sanbox': 'https://api-m.sandbox.paypal.com',
        'live': 'https://api-m.paypal.com',
    }[env];
}
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('payPalApi');
        const env = getEnvironment(credentials.env);
        const data = Buffer.from(`${credentials.clientId}:${credentials.secret}`).toString(n8n_core_1.BINARY_ENCODING);
        const headerWithAuthentication = Object.assign({}, { Authorization: `Basic ${data}`, 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = {
            headers: headerWithAuthentication,
            method: 'POST',
            form: {
                grant_type: 'client_credentials',
            },
            uri: `${env}/v1/oauth2/token`,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    });
}
/**
 * Make an API request to paginated paypal endpoint
 * and return all results
 */
function payPalApiRequestAllItems(propertyName, endpoint, method, body = {}, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page_size = 1000;
        do {
            responseData = yield payPalApiRequest.call(this, endpoint, method, body, query, uri);
            uri = getNext(responseData.links);
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (getNext(responseData.links) !== undefined);
        return returnData;
    });
}
exports.payPalApiRequestAllItems = payPalApiRequestAllItems;
function getNext(links) {
    for (const link of links) {
        if (link.rel === 'next') {
            return link.href;
        }
    }
    return undefined;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
exports.validateJSON = validateJSON;
function upperFist(s) {
    return s.split('.').map(e => {
        return e.toLowerCase().charAt(0).toUpperCase() + e.toLowerCase().slice(1);
    }).join(' ');
}
exports.upperFist = upperFist;
