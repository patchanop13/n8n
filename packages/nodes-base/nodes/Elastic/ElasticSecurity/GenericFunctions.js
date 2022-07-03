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
exports.tolerateTrailingSlash = exports.getVersion = exports.throwOnEmptyUpdate = exports.getConnector = exports.handleListing = exports.elasticSecurityApiRequestAllItems = exports.elasticSecurityApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function elasticSecurityApiRequest(method, endpoint, body = {}, qs = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, baseUrl: rawBaseUrl, } = yield this.getCredentials('elasticSecurityApi');
        const baseUrl = tolerateTrailingSlash(rawBaseUrl);
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        const options = {
            headers: {
                Authorization: `Basic ${token}`,
                'kbn-xsrf': true,
            },
            method,
            body,
            qs,
            uri: `${baseUrl}/api${endpoint}`,
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
            if (((_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.error) === 'Not Acceptable' && ((_b = error === null || error === void 0 ? void 0 : error.error) === null || _b === void 0 ? void 0 : _b.message)) {
                error.error.error = `${error.error.error}: ${error.error.message}`;
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.elasticSecurityApiRequest = elasticSecurityApiRequest;
function elasticSecurityApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = 1;
        const returnData = [];
        let responseData; // tslint:disable-line
        const resource = this.getNodeParameter('resource', 0);
        do {
            responseData = yield elasticSecurityApiRequest.call(this, method, endpoint, body, qs);
            page++;
            const items = resource === 'case'
                ? responseData.cases
                : responseData;
            returnData.push(...items);
        } while (returnData.length < responseData.total);
        return returnData;
    });
}
exports.elasticSecurityApiRequestAllItems = elasticSecurityApiRequestAllItems;
function handleListing(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (returnAll) {
            return yield elasticSecurityApiRequestAllItems.call(this, method, endpoint, body, qs);
        }
        const responseData = yield elasticSecurityApiRequestAllItems.call(this, method, endpoint, body, qs);
        const limit = this.getNodeParameter('limit', 0);
        return responseData.slice(0, limit);
    });
}
exports.handleListing = handleListing;
/**
 * Retrieve a connector name and type from a connector ID.
 *
 * https://www.elastic.co/guide/en/kibana/master/get-connector-api.html
 */
function getConnector(connectorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/actions/connector/${connectorId}`;
        const { id, name, connector_type_id: type, } = yield elasticSecurityApiRequest.call(this, 'GET', endpoint);
        return { id, name, type };
    });
}
exports.getConnector = getConnector;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}`);
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
function getVersion(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const { version } = yield elasticSecurityApiRequest.call(this, 'GET', endpoint);
        if (!version) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Cannot retrieve version for resource');
        }
        return version;
    });
}
exports.getVersion = getVersion;
function tolerateTrailingSlash(baseUrl) {
    return baseUrl.endsWith('/')
        ? baseUrl.substr(0, baseUrl.length - 1)
        : baseUrl;
}
exports.tolerateTrailingSlash = tolerateTrailingSlash;
