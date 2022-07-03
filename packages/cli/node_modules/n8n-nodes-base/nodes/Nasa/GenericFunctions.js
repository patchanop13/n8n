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
exports.nasaApiRequestAllItems = exports.nasaApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function nasaApiRequest(method, endpoint, qs, option = {}, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('nasaApi');
        qs.api_key = credentials['api_key'];
        const options = {
            method,
            qs,
            uri: uri || `https://api.nasa.gov${endpoint}`,
            json: true,
        };
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.nasaApiRequest = nasaApiRequest;
function nasaApiRequestAllItems(propertyName, method, resource, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.size = 20;
        let uri = undefined;
        do {
            responseData = yield nasaApiRequest.call(this, method, resource, query, {}, uri);
            uri = responseData.links.next;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.links.next !== undefined);
        return returnData;
    });
}
exports.nasaApiRequestAllItems = nasaApiRequestAllItems;
