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
exports.coinGeckoRequestAllItems = exports.coinGeckoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function coinGeckoApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://api.coingecko.com/api/v3${endpoint}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.coinGeckoApiRequest = coinGeckoApiRequest;
function coinGeckoRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let respData;
        query.per_page = 250;
        query.page = 1;
        do {
            responseData = yield coinGeckoApiRequest.call(this, method, endpoint, body, query);
            query.page++;
            respData = responseData;
            if (propertyName !== '') {
                respData = responseData[propertyName];
            }
            returnData.push.apply(returnData, respData);
        } while (respData.length !== 0);
        return returnData;
    });
}
exports.coinGeckoRequestAllItems = coinGeckoRequestAllItems;
