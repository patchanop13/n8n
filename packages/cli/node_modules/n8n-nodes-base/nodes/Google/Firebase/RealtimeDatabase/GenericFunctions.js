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
exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function googleApiRequest(projectId, method, resource, body = {}, qs = {}, headers = {}, uri = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const { region } = yield this.getCredentials('googleFirebaseRealtimeDatabaseOAuth2Api');
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            url: uri || `https://${projectId}.${region}/${resource}.json`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            return yield this.helpers.requestOAuth2.call(this, 'googleFirebaseRealtimeDatabaseOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(projectId, method, resource, body = {}, qs = {}, headers = {}, uri = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.pageSize = 100;
        do {
            responseData = yield googleApiRequest.call(this, projectId, method, resource, body, qs, {}, uri);
            qs.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[resource]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
