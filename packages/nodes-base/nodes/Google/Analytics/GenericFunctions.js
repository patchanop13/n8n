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
exports.merge = exports.simplify = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function googleApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://analyticsreporting.googleapis.com${endpoint}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'googleAnalyticsOAuth2', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query, uri);
            if (body.reportRequests && Array.isArray(body.reportRequests)) {
                body.reportRequests[0]['pageToken'] = responseData[propertyName][0].nextPageToken;
            }
            else {
                body.pageToken = responseData['nextPageToken'];
            }
            returnData.push.apply(returnData, responseData[propertyName]);
        } while ((responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '') ||
            (responseData[propertyName] &&
                responseData[propertyName][0].nextPageToken &&
                responseData[propertyName][0].nextPageToken !== undefined));
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
function simplify(responseData) {
    const response = [];
    for (const { columnHeader: { dimensions }, data: { rows } } of responseData) {
        if (rows === undefined) {
            // Do not error if there is no data
            continue;
        }
        for (const row of rows) {
            const data = {};
            if (dimensions) {
                for (let i = 0; i < dimensions.length; i++) {
                    data[dimensions[i]] = row.dimensions[i];
                    data['total'] = row.metrics[0].values.join(',');
                }
            }
            else {
                data['total'] = row.metrics[0].values.join(',');
            }
            response.push(data);
        }
    }
    return response;
}
exports.simplify = simplify;
function merge(responseData) {
    const response = {
        columnHeader: responseData[0].columnHeader,
        data: responseData[0].data,
    };
    const allRows = [];
    for (const { data: { rows } } of responseData) {
        allRows.push(...rows);
    }
    response.data.rows = allRows;
    return [response];
}
exports.merge = merge;
