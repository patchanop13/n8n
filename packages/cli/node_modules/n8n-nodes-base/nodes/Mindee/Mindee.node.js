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
exports.Mindee = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Mindee {
    constructor() {
        this.description = {
            displayName: 'Mindee',
            name: 'mindee',
            icon: 'file:mindee.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Mindee API',
            defaults: {
                name: 'Mindee',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mindeeReceiptApi',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'receipt',
                            ],
                        },
                    },
                },
                {
                    name: 'mindeeInvoiceApi',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'invoice',
                            ],
                        },
                    },
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
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Receipt',
                            value: 'receipt',
                        },
                    ],
                    default: 'receipt',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Predict',
                            value: 'predict',
                        },
                    ],
                    default: 'predict',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    required: true,
                    default: 'data',
                    displayOptions: {
                        show: {
                            operation: [
                                'predict',
                            ],
                            resource: [
                                'receipt',
                                'invoice',
                            ],
                        },
                    },
                    description: 'Name of the binary property which containsthe data for the file to be uploaded',
                },
                {
                    displayName: 'RAW Data',
                    name: 'rawData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to return the data exactly in the way it got received from the API',
                },
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
                    if (resource === 'receipt') {
                        if (operation === 'predict') {
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            const rawData = this.getNodeParameter('rawData', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            const item = items[i].binary;
                            const binaryData = item[binaryPropertyName];
                            const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (binaryData === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            responseData = yield GenericFunctions_1.mindeeApiRequest.call(this, 'POST', `/expense_receipts/v2/predict`, {}, {}, {
                                formData: {
                                    file: {
                                        value: dataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                        },
                                    },
                                },
                            });
                            if (rawData === false) {
                                responseData = (0, GenericFunctions_1.cleanData)(responseData.predictions);
                            }
                        }
                    }
                    if (resource === 'invoice') {
                        if (operation === 'predict') {
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            const rawData = this.getNodeParameter('rawData', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            const item = items[i].binary;
                            const binaryData = item[binaryPropertyName];
                            const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                            if (binaryData === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            responseData = yield GenericFunctions_1.mindeeApiRequest.call(this, 'POST', `/invoices/v1/predict`, {}, {}, {
                                formData: {
                                    file: {
                                        value: dataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                        },
                                    },
                                },
                            });
                            if (rawData === false) {
                                responseData = (0, GenericFunctions_1.cleanData)(responseData.predictions);
                            }
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
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
exports.Mindee = Mindee;
