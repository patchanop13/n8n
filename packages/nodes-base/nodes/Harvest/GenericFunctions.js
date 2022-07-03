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
exports.getAllResource = exports.harvestApiRequestAllItems = exports.harvestApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function harvestApiRequest(method, qs = {}, path, body = {}, option = {}, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Harvest-Account-Id': `${this.getNodeParameter('accountId', 0)}`,
                'User-Agent': 'Harvest App',
                'Authorization': '',
            },
            method,
            body,
            uri: uri || `https://api.harvestapp.com/v2/${path}`,
            qs,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('harvestApi');
                //@ts-ignore
                options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'harvestOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.harvestApiRequest = harvestApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function harvestApiRequestAllItems(method, qs = {}, uri, resource, body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield harvestApiRequest.call(this, method, qs, uri, body, option);
            qs.page = responseData.next_page;
            returnData.push.apply(returnData, responseData[resource]);
        } while (responseData.next_page);
        return returnData;
    });
}
exports.harvestApiRequestAllItems = harvestApiRequestAllItems;
/**
 * fetch All resource using paginated calls
 */
function getAllResource(resource, i) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = resource;
        const qs = {};
        const requestMethod = 'GET';
        qs.per_page = 100;
        const additionalFields = this.getNodeParameter('filters', i);
        const returnAll = this.getNodeParameter('returnAll', i);
        Object.assign(qs, additionalFields);
        let responseData = {};
        if (returnAll) {
            responseData[resource] = yield harvestApiRequestAllItems.call(this, requestMethod, qs, endpoint, resource);
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            qs.per_page = limit;
            responseData = yield harvestApiRequest.call(this, requestMethod, qs, endpoint);
        }
        return responseData[resource];
    });
}
exports.getAllResource = getAllResource;
