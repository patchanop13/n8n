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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlScanIo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class UrlScanIo {
    constructor() {
        this.description = {
            displayName: 'urlscan.io',
            name: 'urlScanIo',
            icon: 'file:urlScanIo.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Provides various utilities for monitoring websites like health checks or screenshots',
            defaults: {
                name: 'urlscan.io',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'urlScanIoApi',
                    required: true,
                    testedBy: 'urlScanIoApiTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    noDataExpression: true,
                    type: 'options',
                    options: [
                        {
                            name: 'Scan',
                            value: 'scan',
                        },
                    ],
                    default: 'scan',
                },
                ...descriptions_1.scanOperations,
                ...descriptions_1.scanFields,
            ],
        };
        this.methods = {
            credentialTest: {
                urlScanIoApiTest(credentials) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { apiKey } = credentials.data;
                        const options = {
                            headers: {
                                'API-KEY': apiKey,
                            },
                            method: 'GET',
                            uri: 'https://urlscan.io/user/quotas',
                            json: true,
                        };
                        try {
                            yield this.helpers.request(options);
                            return {
                                status: 'OK',
                                message: 'Authentication successful',
                            };
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: error.message,
                            };
                        }
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'scan') {
                        // **********************************************************************
                        //                               scan
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //               scan: get
                            // ----------------------------------------
                            const scanId = this.getNodeParameter('scanId', i);
                            responseData = yield GenericFunctions_1.urlScanIoApiRequest.call(this, 'GET', `/result/${scanId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             scan: getAll
                            // ----------------------------------------
                            // https://urlscan.io/docs/search
                            const filters = this.getNodeParameter('filters', i);
                            const qs = {};
                            if (filters === null || filters === void 0 ? void 0 : filters.query) {
                                qs.q = filters.query;
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, '/search', qs);
                            responseData = responseData.map(GenericFunctions_1.normalizeId);
                        }
                        else if (operation === 'perform') {
                            // ----------------------------------------
                            //             scan: perform
                            // ----------------------------------------
                            // https://urlscan.io/docs/search
                            const _a = this.getNodeParameter('additionalFields', i), { tags: rawTags } = _a, rest = __rest(_a, ["tags"]);
                            const body = Object.assign({ url: this.getNodeParameter('url', i) }, rest);
                            if (rawTags) {
                                const tags = rawTags.split(',').map(tag => tag.trim());
                                if (tags.length > 10) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at most 10 tags');
                                }
                                body.tags = tags;
                            }
                            responseData = yield GenericFunctions_1.urlScanIoApiRequest.call(this, 'POST', '/scan', body);
                            responseData = (0, GenericFunctions_1.normalizeId)(responseData);
                        }
                    }
                    Array.isArray(responseData)
                        ? returnData.push(...responseData)
                        : returnData.push(responseData);
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
exports.UrlScanIo = UrlScanIo;
