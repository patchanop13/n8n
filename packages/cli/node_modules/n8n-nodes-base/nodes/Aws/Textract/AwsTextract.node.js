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
exports.AwsTextract = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class AwsTextract {
    constructor() {
        this.description = {
            displayName: 'AWS Textract',
            name: 'awsTextract',
            icon: 'file:textract.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Sends data to Amazon Textract',
            defaults: {
                name: 'AWS Textract',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
                    required: true,
                    testedBy: 'awsTextractApiCredentialTest',
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Analyze Receipt or Invoice',
                            value: 'analyzeExpense',
                        },
                    ],
                    default: 'analyzeExpense',
                },
                {
                    displayName: 'Input Data Field Name',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    displayOptions: {
                        show: {
                            operation: [
                                'analyzeExpense',
                            ],
                        },
                    },
                    required: true,
                    description: 'The name of the input field containing the binary file data to be uploaded. Supported file types: PNG, JPEG.',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'analyzeExpense',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        this.methods = {
            credentialTest: {
                awsTextractApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data, 'sts');
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: 'The security token included in the request is invalid',
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    //https://docs.aws.amazon.com/textract/latest/dg/API_AnalyzeExpense.html
                    if (operation === 'analyzeExpense') {
                        const binaryProperty = this.getNodeParameter('binaryPropertyName', i);
                        const simple = this.getNodeParameter('simple', i);
                        if (items[i].binary === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                        }
                        if (items[i].binary[binaryProperty] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryProperty}" does not exists on item!`);
                        }
                        const binaryPropertyData = items[i].binary[binaryProperty];
                        const body = {
                            Document: {
                                Bytes: binaryPropertyData.data,
                            },
                        };
                        const action = 'Textract.AnalyzeExpense';
                        responseData = (yield GenericFunctions_1.awsApiRequestREST.call(this, 'textract', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' }));
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplify)(responseData);
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
exports.AwsTextract = AwsTextract;
