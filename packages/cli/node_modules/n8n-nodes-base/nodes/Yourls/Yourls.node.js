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
exports.Yourls = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const UrlDescription_1 = require("./UrlDescription");
class Yourls {
    constructor() {
        this.description = {
            displayName: 'Yourls',
            name: 'yourls',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:yourls.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Yourls API',
            defaults: {
                name: 'Yourls',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'yourlsApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'URL',
                            value: 'url',
                        },
                    ],
                    default: 'url',
                },
                ...UrlDescription_1.urlOperations,
                ...UrlDescription_1.urlFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'url') {
                        if (operation === 'shorten') {
                            const url = this.getNodeParameter('url', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.url = url;
                            qs.action = 'shorturl';
                            Object.assign(qs, additionalFields);
                            responseData = yield GenericFunctions_1.yourlsApiRequest.call(this, 'GET', {}, qs);
                        }
                        if (operation === 'expand') {
                            const shortUrl = this.getNodeParameter('shortUrl', i);
                            qs.shorturl = shortUrl;
                            qs.action = 'expand';
                            responseData = yield GenericFunctions_1.yourlsApiRequest.call(this, 'GET', {}, qs);
                        }
                        if (operation === 'stats') {
                            const shortUrl = this.getNodeParameter('shortUrl', i);
                            qs.shorturl = shortUrl;
                            qs.action = 'url-stats';
                            responseData = yield GenericFunctions_1.yourlsApiRequest.call(this, 'GET', {}, qs);
                            responseData = responseData.link;
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Yourls = Yourls;
