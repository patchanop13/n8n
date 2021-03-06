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
exports.AwsLambda = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class AwsLambda {
    constructor() {
        this.description = {
            displayName: 'AWS Lambda',
            name: 'awsLambda',
            icon: 'file:lambda.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["function"]}}',
            description: 'Invoke functions on AWS Lambda',
            defaults: {
                name: 'AWS Lambda',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
                    required: true,
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
                            name: 'Invoke',
                            value: 'invoke',
                            description: 'Invoke a function',
                        },
                    ],
                    default: 'invoke',
                },
                {
                    displayName: 'Function Name or ID',
                    name: 'function',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getFunctions',
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'invoke',
                            ],
                        },
                    },
                    options: [],
                    default: '',
                    required: true,
                    description: 'The function you want to invoke. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Qualifier',
                    name: 'qualifier',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'invoke',
                            ],
                        },
                    },
                    required: true,
                    default: '$LATEST',
                    description: 'Specify a version or alias to invoke a published version of the function',
                },
                {
                    displayName: 'Invocation Type',
                    name: 'invocationType',
                    type: 'options',
                    options: [
                        {
                            name: 'Wait for Results',
                            value: 'RequestResponse',
                            description: 'Invoke the function synchronously and wait for the response',
                        },
                        {
                            name: 'Continue Workflow',
                            value: 'Event',
                            description: 'Invoke the function and immediately continue the workflow',
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: [
                                'invoke',
                            ],
                        },
                    },
                    default: 'RequestResponse',
                    description: 'Specify if the workflow should wait for the function to return the results',
                },
                {
                    displayName: 'JSON Input',
                    name: 'payload',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'invoke',
                            ],
                        },
                    },
                    default: '',
                    description: 'The JSON that you want to provide to your Lambda function as input',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getFunctions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const data = yield GenericFunctions_1.awsApiRequestREST.call(this, 'lambda', 'GET', '/2015-03-31/functions/');
                        for (const func of data.Functions) {
                            returnData.push({
                                name: func.FunctionName,
                                value: func.FunctionArn,
                            });
                        }
                        if (data.NextMarker) {
                            let marker = data.NextMarker;
                            while (true) {
                                const dataLoop = yield GenericFunctions_1.awsApiRequestREST.call(this, 'lambda', 'GET', `/2015-03-31/functions/?MaxItems=50&Marker=${encodeURIComponent(marker)}`);
                                for (const func of dataLoop.Functions) {
                                    returnData.push({
                                        name: func.FunctionName,
                                        value: func.FunctionArn,
                                    });
                                }
                                if (dataLoop.NextMarker) {
                                    marker = dataLoop.NextMarker;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    const params = {
                        FunctionName: this.getNodeParameter('function', i),
                        InvocationType: this.getNodeParameter('invocationType', i),
                        Payload: this.getNodeParameter('payload', i),
                        Qualifier: this.getNodeParameter('qualifier', i),
                    };
                    const responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'lambda', 'POST', `/2015-03-31/functions/${params.FunctionName}/invocations?Qualifier=${params.Qualifier}`, params.Payload, {
                        'X-Amz-Invocation-Type': params.InvocationType,
                        'Content-Type': 'application/x-amz-json-1.0',
                    });
                    if (responseData !== null && (responseData === null || responseData === void 0 ? void 0 : responseData.errorMessage) !== undefined) {
                        let errorMessage = responseData.errorMessage;
                        if (responseData.stackTrace) {
                            errorMessage += `\n\nStack trace:\n${responseData.stackTrace}`;
                        }
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
                    }
                    else {
                        returnData.push({
                            result: responseData,
                        });
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
exports.AwsLambda = AwsLambda;
