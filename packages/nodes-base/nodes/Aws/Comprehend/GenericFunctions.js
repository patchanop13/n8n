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
exports.awsApiRequestSOAP = exports.awsApiRequestREST = exports.awsApiRequest = void 0;
const url_1 = require("url");
const aws4_1 = require("aws4");
const xml2js_1 = require("xml2js");
const n8n_workflow_1 = require("n8n-workflow");
function getEndpointForService(service, credentials) {
    let endpoint;
    if (service === 'lambda' && credentials.lambdaEndpoint) {
        endpoint = credentials.lambdaEndpoint;
    }
    else if (service === 'sns' && credentials.snsEndpoint) {
        endpoint = credentials.snsEndpoint;
    }
    else {
        endpoint = `https://${service}.${credentials.region}.amazonaws.com`;
    }
    return endpoint.replace('{region}', credentials.region);
}
function awsApiRequest(service, method, path, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('aws');
        // Concatenate path and instantiate URL object so it parses correctly query strings
        const endpoint = new url_1.URL(getEndpointForService(service, credentials) + path);
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
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error); // no XML parsing needed
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
