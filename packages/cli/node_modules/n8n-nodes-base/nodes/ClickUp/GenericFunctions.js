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
exports.validateJSON = exports.clickupApiRequestAllItems = exports.clickupApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function clickupApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.clickup.com/api/v2${resource}`,
            json: true,
        };
        try {
            const authenticationMethod = this.getNodeParameter('authentication', 0);
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('clickUpApi');
                options.headers['Authorization'] = credentials.accessToken;
                return yield this.helpers.request(options);
            }
            else {
                const oAuth2Options = {
                    keepBearer: false,
                    tokenType: 'Bearer',
                };
                // @ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'clickUpOAuth2Api', options, oAuth2Options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.clickupApiRequest = clickupApiRequest;
function clickupApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 0;
        do {
            responseData = yield clickupApiRequest.call(this, method, resource, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            query.page++;
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while (responseData[propertyName] &&
            responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.clickupApiRequestAllItems = clickupApiRequestAllItems;
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
