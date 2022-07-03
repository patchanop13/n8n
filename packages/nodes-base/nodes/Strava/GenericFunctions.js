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
exports.stravaApiRequestAllItems = exports.stravaApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function stravaApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            form: body,
            qs,
            uri: uri || `https://www.strava.com/api/v3${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (this.getNode().type.includes('Trigger') && resource.includes('/push_subscriptions')) {
                const credentials = yield this.getCredentials('stravaOAuth2Api');
                if (method === 'GET') {
                    qs.client_id = credentials.clientId;
                    qs.client_secret = credentials.clientSecret;
                }
                else {
                    body.client_id = credentials.clientId;
                    body.client_secret = credentials.clientSecret;
                }
                //@ts-ignore
                return (_a = this.helpers) === null || _a === void 0 ? void 0 : _a.request(options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'stravaOAuth2Api', options, { includeCredentialsOnRefreshOnBody: true });
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.stravaApiRequest = stravaApiRequest;
function stravaApiRequestAllItems(method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 30;
        query.page = 1;
        do {
            responseData = yield stravaApiRequest.call(this, method, resource, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData);
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.stravaApiRequestAllItems = stravaApiRequestAllItems;
