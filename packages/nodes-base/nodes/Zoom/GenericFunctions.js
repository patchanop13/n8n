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
exports.zoomApiRequestAllItems = exports.zoomApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function zoomApiRequest(method, resource, body = {}, query = {}, headers = undefined, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken');
        let options = {
            method,
            headers: headers || {
                'Content-Type': 'application/json',
            },
            body,
            qs: query,
            uri: `https://api.zoom.us/v2${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('zoomApi');
                options.headers.Authorization = `Bearer ${credentials.accessToken}`;
                //@ts-ignore
                return yield this.helpers.request(options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'zoomOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.zoomApiRequest = zoomApiRequest;
function zoomApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page_number = 0;
        do {
            responseData = yield zoomApiRequest.call(this, method, endpoint, body, query);
            query.page_number++;
            returnData.push.apply(returnData, responseData[propertyName]);
            // zoom free plan rate limit is 1 request/second
            // TODO just wait when the plan is free
            yield wait();
        } while (responseData.page_count !== responseData.page_number);
        return returnData;
    });
}
exports.zoomApiRequestAllItems = zoomApiRequestAllItems;
function wait() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}
