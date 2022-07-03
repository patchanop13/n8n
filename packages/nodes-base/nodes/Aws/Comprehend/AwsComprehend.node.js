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
exports.AwsComprehend = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AwsComprehend {
    constructor() {
        this.description = {
            displayName: 'AWS Comprehend',
            name: 'awsComprehend',
            icon: 'file:comprehend.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Sends data to Amazon Comprehend',
            defaults: {
                name: 'AWS Comprehend',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Text',
                            value: 'text',
                        },
                    ],
                    default: 'text',
                    description: 'The resource to perform',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Detect Dominant Language',
                            value: 'detectDominantLanguage',
                            description: 'Identify the dominant language',
                        },
                        {
                            name: 'Detect Entities',
                            value: 'detectEntities',
                            description: 'Inspects text for named entities, and returns information about them',
                        },
                        {
                            name: 'Detect Sentiment',
                            value: 'detectSentiment',
                            description: 'Analyse the sentiment of the text',
                        },
                    ],
                    default: 'detectDominantLanguage',
                },
                {
                    displayName: 'Language Code',
                    name: 'languageCode',
                    type: 'options',
                    options: [
                        {
                            name: 'Arabic',
                            value: 'ar',
                        },
                        {
                            name: 'Chinese',
                            value: 'zh',
                        },
                        {
                            name: 'Chinese (T)',
                            value: 'zh-TW',
                        },
                        {
                            name: 'English',
                            value: 'en',
                        },
                        {
                            name: 'French',
                            value: 'fr',
                        },
                        {
                            name: 'German',
                            value: 'de',
                        },
                        {
                            name: 'Hindi',
                            value: 'hi',
                        },
                        {
                            name: 'Italian',
                            value: 'it',
                        },
                        {
                            name: 'Japanese',
                            value: 'ja',
                        },
                        {
                            name: 'Korean',
                            value: 'ko',
                        },
                        {
                            name: 'Portuguese',
                            value: 'pt',
                        },
                        {
                            name: 'Spanish',
                            value: 'es',
                        },
                    ],
                    default: 'en',
                    displayOptions: {
                        show: {
                            resource: [
                                'text',
                            ],
                            operation: [
                                'detectSentiment',
                                'detectEntities',
                            ],
                        },
                    },
                    description: 'The language code for text',
                },
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'text',
                            ],
                        },
                    },
                    description: 'The text to send',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'text',
                            ],
                            operation: [
                                'detectDominantLanguage',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            resource: [
                                'text',
                            ],
                            operation: [
                                'detectEntities',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Endpoint Arn',
                            name: 'endpointArn',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                            default: '',
                            description: 'The Amazon Resource Name of an endpoint that is associated with a custom entity recognition model',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'text') {
                        //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectDominantLanguage.html
                        if (operation === 'detectDominantLanguage') {
                            const text = this.getNodeParameter('text', i);
                            const simple = this.getNodeParameter('simple', i);
                            const body = {
                                Text: text,
                            };
                            const action = 'Comprehend_20171127.DetectDominantLanguage';
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            if (simple === true) {
                                responseData = responseData.Languages.reduce((accumulator, currentValue) => {
                                    accumulator[currentValue.LanguageCode] = currentValue.Score;
                                    return accumulator;
                                }, {});
                            }
                        }
                        //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html
                        if (operation === 'detectSentiment') {
                            const action = 'Comprehend_20171127.DetectSentiment';
                            const text = this.getNodeParameter('text', i);
                            const languageCode = this.getNodeParameter('languageCode', i);
                            const body = {
                                Text: text,
                                LanguageCode: languageCode,
                            };
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                        }
                        //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectEntities.html
                        if (operation === 'detectEntities') {
                            const action = 'Comprehend_20171127.DetectEntities';
                            const text = this.getNodeParameter('text', i);
                            const languageCode = this.getNodeParameter('languageCode', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                Text: text,
                                LanguageCode: languageCode,
                            };
                            if (additionalFields.endpointArn) {
                                body.EndpointArn = additionalFields.endpointArn;
                            }
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            responseData = responseData.Entities;
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
exports.AwsComprehend = AwsComprehend;
