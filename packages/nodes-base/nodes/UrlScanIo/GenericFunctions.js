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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeId = exports.handleListing = exports.urlScanIoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function urlScanIoApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield this.getCredentials('urlScanIoApi');
        const options = {
            headers: {
                'API-KEY': apiKey,
            },
            method,
            body,
            qs,
            uri: `https://urlscan.io/api/v1${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.urlScanIoApiRequest = urlScanIoApiRequest;
function handleListing(endpoint, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.size = 100;
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        do {
            responseData = yield urlScanIoApiRequest.call(this, 'GET', endpoint, {}, qs);
            returnData.push(...responseData.results);
            if (!returnAll && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
            if (responseData.results.length) {
                const lastResult = responseData.results[responseData.results.length - 1];
                qs.search_after = lastResult.sort;
            }
        } while (responseData.total > returnData.length);
        return returnData;
    });
}
exports.handleListing = handleListing;
const normalizeId = (_a) => {
    var { _id, uuid } = _a, rest = __rest(_a, ["_id", "uuid"]);
    if (_id)
        return (Object.assign({ scanId: _id }, rest));
    if (uuid)
        return (Object.assign({ scanId: uuid }, rest));
    return rest;
};
exports.normalizeId = normalizeId;
