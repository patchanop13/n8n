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
exports.copyInputItem = exports.awsApiRequestAllItems = exports.awsApiRequest = void 0;
const url_1 = require("url");
const aws4_1 = require("aws4");
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
        const securityHeaders = {
            accessKeyId: `${credentials.accessKeyId}`.trim(),
            secretAccessKey: `${credentials.secretAccessKey}`.trim(),
            sessionToken: credentials.temporaryCredentials ? `${credentials.sessionToken}`.trim() : undefined,
        };
        const options = (0, aws4_1.sign)({
            // @ts-ignore
            uri: endpoint,
            service,
            region: credentials.region,
            method,
            path: '/',
            headers: Object.assign({}, headers),
            body: JSON.stringify(body),
        }, securityHeaders);
        try {
            return JSON.parse(yield this.helpers.request(options));
        }
        catch (error) {
            const errorMessage = (error.response && error.response.body.message) || (error.response && error.response.body.Message) || error.message;
            if (error.statusCode === 403) {
                if (errorMessage === 'The security token included in the request is invalid.') {
                    throw new Error('The AWS credentials are not valid!');
                }
                else if (errorMessage.startsWith('The request signature we calculated does not match the signature you provided')) {
                    throw new Error('The AWS credentials are not valid!');
                }
            }
            throw new Error(`AWS error response [${error.statusCode}]: ${errorMessage}`);
        }
    });
}
exports.awsApiRequest = awsApiRequest;
function awsApiRequestAllItems(service, method, path, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield awsApiRequest.call(this, service, method, path, body, headers);
            if (responseData.LastEvaluatedKey) {
                body.ExclusiveStartKey = responseData.LastEvaluatedKey;
            }
            returnData.push(...responseData.Items);
        } while (responseData.LastEvaluatedKey !== undefined);
        return returnData;
    });
}
exports.awsApiRequestAllItems = awsApiRequestAllItems;
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    let newItem;
    newItem = {};
    for (const property of properties) {
        if (item.json[property] === undefined) {
            newItem[property] = null;
        }
        else {
            newItem[property] = JSON.parse(JSON.stringify(item.json[property]));
        }
    }
    return newItem;
}
exports.copyInputItem = copyInputItem;
