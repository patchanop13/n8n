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
exports.s3ApiRequestSOAPAllItems = exports.s3ApiRequestSOAP = exports.s3ApiRequestREST = exports.s3ApiRequest = void 0;
const aws4_1 = require("aws4");
const lodash_1 = require("lodash");
const xml2js_1 = require("xml2js");
const n8n_workflow_1 = require("n8n-workflow");
const url_1 = require("url");
function s3ApiRequest(bucket, method, path, body, query = {}, headers, option = {}, region) {
    return __awaiter(this, void 0, void 0, function* () {
        let credentials;
        credentials = yield this.getCredentials('s3');
        if (!credentials.endpoint.startsWith('http')) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'HTTP(S) Scheme is required in endpoint definition');
        }
        const endpoint = new url_1.URL(credentials.endpoint);
        if (bucket) {
            if (credentials.forcePathStyle) {
                path = `/${bucket}${path}`;
            }
            else {
                endpoint.host = `${bucket}.${endpoint.host}`;
            }
        }
        endpoint.pathname = path;
        // Sign AWS API request with the user credentials
        const signOpts = {
            headers: headers || {},
            region: region || credentials.region,
            host: endpoint.host,
            method,
            path: `${path}?${queryToString(query).replace(/\+/g, '%2B')}`,
            service: 's3',
            body,
        };
        const securityHeaders = {
            accessKeyId: `${credentials.accessKeyId}`.trim(),
            secretAccessKey: `${credentials.secretAccessKey}`.trim(),
            sessionToken: credentials.temporaryCredentials ? `${credentials.sessionToken}`.trim() : undefined,
        };
        (0, aws4_1.sign)(signOpts, securityHeaders);
        const options = {
            headers: signOpts.headers,
            method,
            qs: query,
            uri: endpoint.toString(),
            body: signOpts.body,
        };
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.s3ApiRequest = s3ApiRequest;
function s3ApiRequestREST(bucket, method, path, body, query = {}, headers, options = {}, region) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield s3ApiRequest.call(this, bucket, method, path, body, query, headers, options, region);
        try {
            return JSON.parse(response);
        }
        catch (error) {
            return response;
        }
    });
}
exports.s3ApiRequestREST = s3ApiRequestREST;
function s3ApiRequestSOAP(bucket, method, path, body, query = {}, headers, option = {}, region) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield s3ApiRequest.call(this, bucket, method, path, body, query, headers, option, region);
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
            return error;
        }
    });
}
exports.s3ApiRequestSOAP = s3ApiRequestSOAP;
function s3ApiRequestSOAPAllItems(propertyName, service, method, path, body, query = {}, headers = {}, option = {}, region) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield s3ApiRequestSOAP.call(this, service, method, path, body, query, headers, option, region);
            //https://forums.aws.amazon.com/thread.jspa?threadID=55746
            if ((0, lodash_1.get)(responseData, `${propertyName.split('.')[0]}.NextContinuationToken`)) {
                query['continuation-token'] = (0, lodash_1.get)(responseData, `${propertyName.split('.')[0]}.NextContinuationToken`);
            }
            if ((0, lodash_1.get)(responseData, propertyName)) {
                if (Array.isArray((0, lodash_1.get)(responseData, propertyName))) {
                    returnData.push.apply(returnData, (0, lodash_1.get)(responseData, propertyName));
                }
                else {
                    returnData.push((0, lodash_1.get)(responseData, propertyName));
                }
            }
            if (query.limit && query.limit <= returnData.length) {
                return returnData;
            }
        } while ((0, lodash_1.get)(responseData, `${propertyName.split('.')[0]}.IsTruncated`) !== undefined &&
            (0, lodash_1.get)(responseData, `${propertyName.split('.')[0]}.IsTruncated`) !== 'false');
        return returnData;
    });
}
exports.s3ApiRequestSOAPAllItems = s3ApiRequestSOAPAllItems;
function queryToString(params) {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}
