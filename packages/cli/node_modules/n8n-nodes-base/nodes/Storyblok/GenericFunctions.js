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
exports.validateJSON = exports.storyblokApiRequestAllItems = exports.storyblokApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function storyblokApiRequest(method, resource, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('source', 0);
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: '',
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        if (authenticationMethod === 'contentApi') {
            const credentials = yield this.getCredentials('storyblokContentApi');
            options.uri = `https://api.storyblok.com${resource}`;
            Object.assign(options.qs, { token: credentials.apiKey });
        }
        else {
            const credentials = yield this.getCredentials('storyblokManagementApi');
            options.uri = `https://mapi.storyblok.com${resource}`;
            Object.assign(options.headers, { 'Authorization': credentials.accessToken });
        }
        try {
            return this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.storyblokApiRequest = storyblokApiRequest;
function storyblokApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.per_page = 100;
        query.page = 1;
        do {
            responseData = yield storyblokApiRequest.call(this, method, resource, body, query);
            query.page++;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.storyblokApiRequestAllItems = storyblokApiRequestAllItems;
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
