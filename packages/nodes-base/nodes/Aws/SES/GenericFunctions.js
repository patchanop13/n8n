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
exports.awsApiRequestSOAPAllItems = exports.awsApiRequestSOAP = exports.awsApiRequestREST = exports.awsApiRequest = void 0;
const url_1 = require("url");
const aws4_1 = require("aws4");
const xml2js_1 = require("xml2js");
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function awsApiRequest(service, method, path, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('aws');
        const endpoint = new url_1.URL(((credentials.sesEndpoint || '').replace('{region}', credentials.region) || `https://${service}.${credentials.region}.amazonaws.com`) + path);
        // Sign AWS API request with the user credentials
        const signOpts = { headers: headers || {}, host: endpoint.host, method, path, body };
        const securityHeaders = {
            accessKeyId: `${credentials.accessKeyId}`.trim(),
            secretAccessKey: `${credentials.secretAccessKey}`.trim(),
            sessionToken: credentials.temporaryCredentials ? `${credentials.sessionToken}`.trim() : undefined,
        };
        (0, aws4_1.sign)(signOpts, securityHeaders);
        const options = {
            headers: signOpts.headers,
            method,
            uri: endpoint.href,
            body: signOpts.body,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { parseXml: true });
        }
    });
}
exports.awsApiRequest = awsApiRequest;
function awsApiRequestREST(service, method, path, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield awsApiRequest.call(this, service, method, path, body, headers);
        try {
            return JSON.parse(response);
        }
        catch (error) {
            return response;
        }
    });
}
exports.awsApiRequestREST = awsApiRequestREST;
function awsApiRequestSOAP(service, method, path, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield awsApiRequest.call(this, service, method, path, body, headers);
        try {
            return yield new Promise((resolve, reject) => {
                (0, xml2js_1.parseString)(response, { explicitArray: false }, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        }
        catch (error) {
            return response;
        }
    });
}
exports.awsApiRequestSOAP = awsApiRequestSOAP;
function awsApiRequestSOAPAllItems(propertyName, service, method, path, body, query = {}, headers = {}, option = {}, region) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        const propertyNameArray = propertyName.split('.');
        do {
            responseData = yield awsApiRequestSOAP.call(this, service, method, path, body, query);
            if ((0, lodash_1.get)(responseData, `${propertyNameArray[0]}.${propertyNameArray[1]}.NextToken`)) {
                query['NextToken'] = (0, lodash_1.get)(responseData, `${propertyNameArray[0]}.${propertyNameArray[1]}.NextToken`);
            }
            if ((0, lodash_1.get)(responseData, propertyName)) {
                if (Array.isArray((0, lodash_1.get)(responseData, propertyName))) {
                    returnData.push.apply(returnData, (0, lodash_1.get)(responseData, propertyName));
                }
                else {
                    returnData.push((0, lodash_1.get)(responseData, propertyName));
                }
            }
        } while ((0, lodash_1.get)(responseData, `${propertyNameArray[0]}.${propertyNameArray[1]}.NextToken`) !== undefined);
        return returnData;
    });
}
exports.awsApiRequestSOAPAllItems = awsApiRequestSOAPAllItems;
