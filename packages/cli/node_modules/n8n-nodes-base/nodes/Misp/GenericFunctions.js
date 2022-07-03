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
exports.throwOnInvalidUrl = exports.throwOnMissingSharingGroup = exports.throwOnEmptyUpdate = exports.mispApiRequestAllItems = exports.mispApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const url_1 = require("url");
function mispApiRequest(method, endpoint, body = {}, qs = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { baseUrl, apiKey, allowUnauthorizedCerts, } = yield this.getCredentials('mispApi');
        const options = {
            headers: {
                Authorization: apiKey,
            },
            method,
            body,
            qs,
            uri: `${baseUrl}${endpoint}`,
            json: true,
            rejectUnauthorized: !allowUnauthorizedCerts,
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
            // MISP API wrongly returns 403 for malformed requests
            if (error.statusCode === 403) {
                error.statusCode = 400;
            }
            const errors = (_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.errors;
            if (errors) {
                const key = Object.keys(errors)[0];
                if (key !== undefined) {
                    let message = errors[key].join();
                    if (message.includes(' nter')) {
                        message = message.replace(' nter', ' enter');
                    }
                    error.error.message = `${error.error.message}: ${message}`;
                }
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mispApiRequest = mispApiRequest;
function mispApiRequestAllItems(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield mispApiRequest.call(this, 'GET', endpoint);
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (!returnAll) {
            const limit = this.getNodeParameter('limit', 0);
            return responseData.slice(0, limit);
        }
        return responseData;
    });
}
exports.mispApiRequestAllItems = mispApiRequestAllItems;
function throwOnEmptyUpdate(resource, updateFields) {
    if (!Object.keys(updateFields).length) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
    }
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
const SHARING_GROUP_OPTION_ID = 4;
function throwOnMissingSharingGroup(fields) {
    if (fields.distribution === SHARING_GROUP_OPTION_ID &&
        !fields.sharing_group_id) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please specify a sharing group');
    }
}
exports.throwOnMissingSharingGroup = throwOnMissingSharingGroup;
const isValidUrl = (str) => {
    try {
        new url_1.URL(str); // tslint:disable-line: no-unused-expression
        return true;
    }
    catch (error) {
        return false;
    }
};
function throwOnInvalidUrl(str) {
    if (!isValidUrl(str)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please specify a valid URL, protocol included. Example: https://site.com');
    }
}
exports.throwOnInvalidUrl = throwOnInvalidUrl;
