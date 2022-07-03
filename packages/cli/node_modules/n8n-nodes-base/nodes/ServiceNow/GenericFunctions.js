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
exports.sortData = exports.mapEndpoint = exports.serviceNowDownloadAttachment = exports.serviceNowRequestAllItems = exports.serviceNowApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function serviceNowApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'oAuth2');
        let credentials;
        if (authenticationMethod === 'basicAuth') {
            credentials = yield this.getCredentials('serviceNowBasicApi');
        }
        else {
            credentials = yield this.getCredentials('serviceNowOAuth2Api');
        }
        const options = {
            headers,
            method,
            qs,
            body,
            uri: uri || `https://${credentials.subdomain}.service-now.com/api${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        if (options.qs.limit) {
            delete options.qs.limit;
        }
        try {
            const credentialType = authenticationMethod === 'oAuth2' ? 'serviceNowOAuth2Api' : 'serviceNowBasicApi';
            return yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.serviceNowApiRequest = serviceNowApiRequest;
function serviceNowRequestAllItems(method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        const page = 100;
        query.sysparm_limit = page;
        responseData = yield serviceNowApiRequest.call(this, method, resource, body, query, undefined, { resolveWithFullResponse: true });
        returnData.push.apply(returnData, responseData.body.result);
        const quantity = responseData.headers['x-total-count'];
        const iterations = Math.round(quantity / page) + (quantity % page ? 1 : 0);
        for (let iteration = 1; iteration < iterations; iteration++) {
            query.sysparm_limit = page;
            query.sysparm_offset = iteration * page;
            responseData = yield serviceNowApiRequest.call(this, method, resource, body, query, undefined, { resolveWithFullResponse: true });
            returnData.push.apply(returnData, responseData.body.result);
        }
        return returnData;
    });
}
exports.serviceNowRequestAllItems = serviceNowRequestAllItems;
function serviceNowDownloadAttachment(endpoint, fileName, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileData = yield serviceNowApiRequest.call(this, 'GET', `${endpoint}/file`, {}, {}, '', { json: false, encoding: null, resolveWithFullResponse: true });
        const binaryData = yield this.helpers.prepareBinaryData(Buffer.from(fileData.body), fileName, contentType);
        return binaryData;
    });
}
exports.serviceNowDownloadAttachment = serviceNowDownloadAttachment;
const mapEndpoint = (resource, operation) => {
    const resourceEndpoint = new Map([
        ['attachment', 'sys_dictionary'],
        ['tableRecord', 'sys_dictionary'],
        ['businessService', 'cmdb_ci_service'],
        ['configurationItems', 'cmdb_ci'],
        ['department', 'cmn_department'],
        ['dictionary', 'sys_dictionary'],
        ['incident', 'incident'],
        ['user', 'sys_user'],
        ['userGroup', 'sys_user_group'],
        ['userRole', 'sys_user_role'],
    ]);
    return resourceEndpoint.get(resource);
};
exports.mapEndpoint = mapEndpoint;
const sortData = (returnData) => {
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
};
exports.sortData = sortData;
