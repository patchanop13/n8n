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
exports.validateJSON = exports.eventExists = exports.customerIoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function customerIoApiRequest(method, endpoint, body, baseApi, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('customerIoApi');
        query = query || {};
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            uri: '',
            json: true,
        };
        if (baseApi === 'tracking') {
            options.uri = `https://track.customer.io/api/v1${endpoint}`;
            const basicAuthKey = Buffer.from(`${credentials.trackingSiteId}:${credentials.trackingApiKey}`).toString('base64');
            Object.assign(options.headers, { 'Authorization': `Basic ${basicAuthKey}` });
        }
        else if (baseApi === 'api') {
            options.uri = `https://api.customer.io/v1/api${endpoint}`;
            const basicAuthKey = Buffer.from(`${credentials.trackingSiteId}:${credentials.trackingApiKey}`).toString('base64');
            Object.assign(options.headers, { 'Authorization': `Basic ${basicAuthKey}` });
        }
        else if (baseApi === 'beta') {
            options.uri = `https://beta-api.customer.io/v1/api${endpoint}`;
            Object.assign(options.headers, { 'Authorization': `Bearer ${credentials.appApiKey}` });
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.customerIoApiRequest = customerIoApiRequest;
function eventExists(currentEvents, webhookEvents) {
    for (const currentEvent of currentEvents) {
        if ((0, lodash_1.get)(webhookEvents, `${currentEvent.split('.')[0]}.${currentEvent.split('.')[1]}`) !== true) {
            return false;
        }
    }
    return true;
}
exports.eventExists = eventExists;
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
