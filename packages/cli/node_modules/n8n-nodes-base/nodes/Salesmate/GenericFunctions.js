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
exports.simplifySalesmateData = exports.validateJSON = exports.salesmateApiRequestAllItems = exports.salesmateApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function salesmateApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('salesmateApi');
        const options = {
            headers: {
                'sessionToken': credentials.sessionToken,
                'x-linkname': credentials.url,
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: uri || `https://apis.salesmate.io${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.salesmateApiRequest = salesmateApiRequest;
function salesmateApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.pageNo = 1;
        query.rows = 25;
        do {
            responseData = yield salesmateApiRequest.call(this, method, resource, body, query);
            returnData.push.apply(returnData, responseData[propertyName].data);
            query.pageNo++;
        } while (responseData[propertyName].totalPages !== undefined &&
            query.pageNo <= responseData[propertyName].totalPages);
        return returnData;
    });
}
exports.salesmateApiRequestAllItems = salesmateApiRequestAllItems;
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
/**
 * Converts data from the Salesmate format into a simple object
 *
 * @export
 * @param {IDataObject[]} data
 * @returns {IDataObject}
 */
function simplifySalesmateData(data) {
    const returnData = {};
    for (const item of data) {
        returnData[item.fieldName] = item.value;
    }
    return returnData;
}
exports.simplifySalesmateData = simplifySalesmateData;
