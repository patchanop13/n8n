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
exports.helpscoutApiRequestAllItems = exports.helpscoutApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function helpscoutApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.helpscout.net${resource}`,
            json: true,
        };
        try {
            if (Object.keys(option).length !== 0) {
                options = Object.assign({}, options, option);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'helpScoutOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.helpscoutApiRequest = helpscoutApiRequest;
function helpscoutApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield helpscoutApiRequest.call(this, method, endpoint, body, query, uri);
            uri = (0, lodash_1.get)(responseData, '_links.next.href');
            returnData.push.apply(returnData, (0, lodash_1.get)(responseData, propertyName));
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while (responseData['_links'] !== undefined &&
            responseData['_links'].next !== undefined &&
            responseData['_links'].next.href !== undefined);
        return returnData;
    });
}
exports.helpscoutApiRequestAllItems = helpscoutApiRequestAllItems;
