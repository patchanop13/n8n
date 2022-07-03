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
exports.validateJSON = exports.zendeskApiRequestAllItems = exports.zendeskApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function zendeskApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        let credentials;
        if (authenticationMethod === 'apiToken') {
            credentials = (yield this.getCredentials('zendeskApi'));
        }
        else {
            credentials = (yield this.getCredentials('zendeskOAuth2Api'));
        }
        let options = {
            method,
            qs,
            body,
            uri: uri || getUri(resource, credentials.subdomain),
            json: true,
            qsStringifyOptions: {
                arrayFormat: 'brackets',
            },
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        const credentialType = authenticationMethod === 'apiToken' ? 'zendeskApi' : 'zendeskOAuth2Api';
        try {
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.zendeskApiRequest = zendeskApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function zendeskApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield zendeskApiRequest.call(this, method, resource, body, query, uri);
            uri = responseData.next_page;
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while (responseData.next_page !== undefined &&
            responseData.next_page !== null);
        return returnData;
    });
}
exports.zendeskApiRequestAllItems = zendeskApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;
function getUri(resource, subdomain) {
    if (resource.includes('webhooks')) {
        return `https://${subdomain}.zendesk.com/api/v2${resource}`;
    }
    else {
        return `https://${subdomain}.zendesk.com/api/v2${resource}.json`;
    }
}
