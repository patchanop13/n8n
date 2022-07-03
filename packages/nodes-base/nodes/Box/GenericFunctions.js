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
exports.boxApiRequestAllItems = exports.boxApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function boxApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.box.com/2.0${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            const oAuth2Options = {
                includeCredentialsOnRefreshOnBody: true,
            };
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'boxOAuth2Api', options, oAuth2Options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.boxApiRequest = boxApiRequest;
function boxApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        query.offset = 0;
        do {
            responseData = yield boxApiRequest.call(this, method, endpoint, body, query);
            query.offset = responseData['offset'] + query.limit;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.boxApiRequestAllItems = boxApiRequestAllItems;
