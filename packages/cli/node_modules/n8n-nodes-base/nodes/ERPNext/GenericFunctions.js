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
exports.erpNextApiRequestAllItems = exports.erpNextApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function erpNextApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('erpNextApi');
        const baseUrl = getBaseUrl(credentials);
        let options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `token ${credentials.apiKey}:${credentials.apiSecret}`,
            },
            method,
            body,
            qs: query,
            uri: uri || `${baseUrl}${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (!Object.keys(options.body).length) {
            delete options.body;
        }
        if (!Object.keys(options.qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            if (error.statusCode === 403) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'DocType unavailable.' });
            }
            if (error.statusCode === 307) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Please ensure the subdomain is correct.' });
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.erpNextApiRequest = erpNextApiRequest;
function erpNextApiRequestAllItems(propertyName, method, resource, body, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line: no-any
        const returnData = [];
        let responseData;
        query.limit_start = 0;
        query.limit_page_length = 1000;
        do {
            responseData = yield erpNextApiRequest.call(this, method, resource, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            query.limit_start += query.limit_page_length - 1;
        } while (responseData.data && responseData.data.length > 0);
        return returnData;
    });
}
exports.erpNextApiRequestAllItems = erpNextApiRequestAllItems;
/**
 * Return the base API URL based on the user's environment.
 */
const getBaseUrl = ({ environment, domain, subdomain }) => environment === 'cloudHosted'
    ? `https://${subdomain}.erpnext.com`
    : domain;
