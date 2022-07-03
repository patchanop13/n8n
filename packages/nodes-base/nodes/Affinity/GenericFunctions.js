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
exports.mapResource = exports.eventsExist = exports.affinityApiRequestAllItems = exports.affinityApiRequest = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
function affinityApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('affinityApi');
        const apiKey = `:${credentials.apiKey}`;
        const endpoint = 'https://api.affinity.co';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(apiKey).toString(n8n_core_1.BINARY_ENCODING)}`,
            },
            method,
            body,
            qs: query,
            uri: uri || `${endpoint}${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.affinityApiRequest = affinityApiRequest;
function affinityApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page_size = 500;
        do {
            responseData = yield affinityApiRequest.call(this, method, resource, body, query);
            // @ts-ignore
            query.page_token = responseData.page_token;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.page_token !== undefined &&
            responseData.page_token !== null);
        return returnData;
    });
}
exports.affinityApiRequestAllItems = affinityApiRequestAllItems;
function eventsExist(subscriptions, currentSubsriptions) {
    for (const subscription of currentSubsriptions) {
        if (!subscriptions.includes(subscription)) {
            return false;
        }
    }
    return true;
}
exports.eventsExist = eventsExist;
function mapResource(key) {
    //@ts-ignore
    return {
        person: 'persons',
        list: 'lists',
        note: 'notes',
        organization: 'organizatitons',
        list_entry: 'list-entries',
        field: 'fields',
        file: 'files',
    }[key];
}
exports.mapResource = mapResource;
