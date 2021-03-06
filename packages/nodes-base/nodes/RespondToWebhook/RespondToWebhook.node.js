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
exports.RespondToWebhook = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class RespondToWebhook {
    constructor() {
        this.description = {
            displayName: 'Respond to Webhook',
            icon: 'file:webhook.svg',
            name: 'respondToWebhook',
            group: ['transform'],
            version: 1,
            description: 'Returns data for Webhook',
            defaults: {
                name: 'Respond to Webhook',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Respond With',
                    name: 'respondWith',
                    type: 'options',
                    options: [
                        {
                            name: 'Binary',
                            value: 'binary',
                        },
                        {
                            name: 'First Incoming Item',
                            value: 'firstIncomingItem',
                        },
                        {
                            name: 'JSON',
                            value: 'json',
                        },
                        {
                            name: 'No Data',
                            value: 'noData',
                        },
                        {
                            name: 'Text',
                            value: 'text',
                        },
                    ],
                    default: 'firstIncomingItem',
                    description: 'The data that should be returned',
                },
                {
                    displayName: 'When using expressions, note that this node will only run for the first item in the input data.',
                    name: 'webhookNotice',
                    type: 'notice',
                    displayOptions: {
                        show: {
                            respondWith: [
                                'json',
                                'text',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Response Body',
                    name: 'responseBody',
                    type: 'json',
                    displayOptions: {
                        show: {
                            respondWith: [
                                'json',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '{ "key": "value" }',
                    description: 'The HTTP Response JSON data',
                },
                {
                    displayName: 'Response Body',
                    name: 'responseBody',
                    type: 'string',
                    displayOptions: {
                        show: {
                            respondWith: [
                                'text',
                            ],
                        },
                    },
                    default: '',
                    placeholder: 'e.g. Workflow started',
                    description: 'The HTTP Response text data',
                },
                {
                    displayName: 'Response Data Source',
                    name: 'responseDataSource',
                    type: 'options',
                    displayOptions: {
                        show: {
                            respondWith: [
                                'binary',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Choose Automatically From Input',
                            value: 'automatically',
                            description: 'Use if input data will contain a single piece of binary data',
                        },
                        {
                            name: 'Specify Myself',
                            value: 'set',
                            description: 'Enter the name of the input field the binary data will be in',
                        },
                    ],
                    default: 'automatically',
                },
                {
                    displayName: 'Input Field Name',
                    name: 'inputFieldName',
                    type: 'string',
                    required: true,
                    default: 'data',
                    displayOptions: {
                        show: {
                            respondWith: [
                                'binary',
                            ],
                            responseDataSource: [
                                'set',
                            ],
                        },
                    },
                    description: 'The name of the node input field with the binary data',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Response Code',
                            name: 'responseCode',
                            type: 'number',
                            typeOptions: {
                                minValue: 100,
                                maxValue: 599,
                            },
                            default: 200,
                            description: 'The HTTP Response code to return. Defaults to 200.',
                        },
                        {
                            displayName: 'Response Headers',
                            name: 'responseHeaders',
                            placeholder: 'Add Response Header',
                            description: 'Add headers to the webhook response',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                            },
                            default: {},
                            options: [
                                {
                                    name: 'entries',
                                    displayName: 'Entries',
                                    values: [
                                        {
                                            displayName: 'Name',
                                            name: 'name',
                                            type: 'string',
                                            default: '',
                                            description: 'Name of the header',
                                        },
                                        {
                                            displayName: 'Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                            description: 'Value of the header',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const respondWith = this.getNodeParameter('respondWith', 0);
            const options = this.getNodeParameter('options', 0, {});
            const headers = {};
            if (options.responseHeaders) {
                for (const header of options.responseHeaders.entries) {
                    if (typeof header.name !== 'string') {
                        header.name = (_a = header.name) === null || _a === void 0 ? void 0 : _a.toString();
                    }
                    headers[(_b = header.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()] = (_c = header.value) === null || _c === void 0 ? void 0 : _c.toString();
                }
            }
            let responseBody;
            if (respondWith === 'json') {
                const responseBodyParameter = this.getNodeParameter('responseBody', 0);
                if (responseBodyParameter) {
                    responseBody = JSON.parse(responseBodyParameter);
                }
            }
            else if (respondWith === 'firstIncomingItem') {
                responseBody = items[0].json;
            }
            else if (respondWith === 'text') {
                responseBody = this.getNodeParameter('responseBody', 0);
            }
            else if (respondWith === 'binary') {
                const item = this.getInputData()[0];
                if (item.binary === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on the first item!');
                }
                let responseBinaryPropertyName;
                const responseDataSource = this.getNodeParameter('responseDataSource', 0);
                if (responseDataSource === 'set') {
                    responseBinaryPropertyName = this.getNodeParameter('inputFieldName', 0);
                }
                else {
                    const binaryKeys = Object.keys(item.binary);
                    if (binaryKeys.length === 0) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on the first item!');
                    }
                    responseBinaryPropertyName = binaryKeys[0];
                }
                const binaryData = item.binary[responseBinaryPropertyName];
                const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(0, responseBinaryPropertyName);
                if (binaryData === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${responseBinaryPropertyName}" does not exists on item!`);
                }
                if (headers['content-type']) {
                    headers['content-type'] = binaryData.mimeType;
                }
                responseBody = binaryDataBuffer;
            }
            else if (respondWith !== 'noData') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The Response Data option "${respondWith}" is not supported!`);
            }
            const response = {
                body: responseBody,
                headers,
                statusCode: options.responseCode || 200,
            };
            this.sendResponse(response);
            return this.prepareOutputData(items);
        });
    }
}
exports.RespondToWebhook = RespondToWebhook;
