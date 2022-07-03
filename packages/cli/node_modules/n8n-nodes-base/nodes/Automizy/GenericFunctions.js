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
exports.automizyApiRequestAllItems = exports.automizyApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function automizyApiRequest(method, path, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('automizyApi');
        const options = {
            headers: {
                'Authorization': `Bearer ${credentials.apiToken}`,
            },
            method,
            body,
            qs,
            uri: `https://gateway.automizy.com/v2${path}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            if (Object.keys(option).length !== 0) {
                Object.assign(options, option);
            }
            //@ts-ignore
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.automizyApiRequest = automizyApiRequest;
function automizyApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.limit = 100;
        query.page = 1;
        do {
            responseData = yield automizyApiRequest.call(this, method, endpoint, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.pageCount !== responseData.page);
        return returnData;
    });
}
exports.automizyApiRequestAllItems = automizyApiRequestAllItems;
