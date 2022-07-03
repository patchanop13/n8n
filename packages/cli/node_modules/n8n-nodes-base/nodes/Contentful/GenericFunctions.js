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
exports.contenfulApiRequestAllItems = exports.contentfulApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function contentfulApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('contentfulApi');
        const source = this.getNodeParameter('source', 0);
        const isPreview = source === 'previewApi';
        const options = {
            method,
            qs,
            body,
            uri: uri || `https://${isPreview ? 'preview' : 'cdn'}.contentful.com${resource}`,
            json: true,
        };
        if (isPreview) {
            qs.access_token = credentials.ContentPreviewaccessToken;
        }
        else {
            qs.access_token = credentials.ContentDeliveryaccessToken;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.contentfulApiRequest = contentfulApiRequest;
function contenfulApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        query.skip = 0;
        do {
            responseData = yield contentfulApiRequest.call(this, method, resource, body, query);
            query.skip = (query.skip + 1) * query.limit;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (returnData.length < responseData.total);
        return returnData;
    });
}
exports.contenfulApiRequestAllItems = contenfulApiRequestAllItems;
