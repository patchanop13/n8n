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
exports.validateTimeOptions = exports.format = exports.marketstackApiRequestAllItems = exports.marketstackApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function marketstackApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('marketstackApi');
        const protocol = credentials.useHttps ? 'https' : 'http'; // Free API does not support HTTPS
        const options = {
            method,
            uri: `${protocol}://api.marketstack.com/v1${endpoint}`,
            qs: Object.assign({ access_key: credentials.apiKey }, qs),
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
exports.marketstackApiRequest = marketstackApiRequest;
function marketstackApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        let responseData;
        const returnData = [];
        qs.offset = 0;
        do {
            responseData = yield marketstackApiRequest.call(this, method, endpoint, body, qs);
            returnData.push(...responseData.data);
            if (!returnAll && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
            qs.offset += responseData.count;
        } while (responseData.total > returnData.length);
        return returnData;
    });
}
exports.marketstackApiRequestAllItems = marketstackApiRequestAllItems;
const format = (datetime) => datetime === null || datetime === void 0 ? void 0 : datetime.split('T')[0];
exports.format = format;
function validateTimeOptions(timeOptions) {
    if (timeOptions.every(o => !o)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please filter by latest, specific date or timeframe (start and end dates).');
    }
    if (timeOptions.filter(Boolean).length > 1) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please filter by one of latest, specific date, or timeframe (start and end dates).');
    }
}
exports.validateTimeOptions = validateTimeOptions;
