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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJSON = exports.getTags = exports.getGoogleAnalyticsDomainsArray = exports.getToEmailArray = exports.mandrillApiRequest = void 0;
const lodash_1 = __importDefault(require("lodash"));
const n8n_workflow_1 = require("n8n-workflow");
function mandrillApiRequest(resource, method, action, body = {}, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('mandrillApi');
        const data = Object.assign({}, body, { key: credentials.apiKey });
        const endpoint = 'mandrillapp.com/api/1.0';
        const options = {
            headers,
            method,
            uri: `https://${endpoint}${resource}${action}.json`,
            body: data,
            json: true,
        };
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mandrillApiRequest = mandrillApiRequest;
function getToEmailArray(toEmail) {
    let toEmailArray;
    if (toEmail.split(',').length > 0) {
        const array = toEmail.split(',');
        toEmailArray = lodash_1.default.map(array, (email) => {
            return {
                email,
                type: 'to',
            };
        });
    }
    else {
        toEmailArray = [{
                email: toEmail,
                type: 'to',
            }];
    }
    return toEmailArray;
}
exports.getToEmailArray = getToEmailArray;
function getGoogleAnalyticsDomainsArray(s) {
    let array = [];
    if (s.split(',').length > 0) {
        array = s.split(',');
    }
    else {
        array = [s];
    }
    return array;
}
exports.getGoogleAnalyticsDomainsArray = getGoogleAnalyticsDomainsArray;
function getTags(s) {
    let array = [];
    if (s.split(',').length > 0) {
        array = s.split(',');
    }
    else {
        array = [s];
    }
    return array;
}
exports.getTags = getTags;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = [];
    }
    return result;
}
exports.validateJSON = validateJSON;
