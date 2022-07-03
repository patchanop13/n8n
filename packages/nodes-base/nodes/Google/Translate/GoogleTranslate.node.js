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
exports.GoogleTranslate = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class GoogleTranslate {
    constructor() {
        this.description = {
            displayName: 'Google Translate',
            name: 'googleTranslate',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:googletranslate.png',
            group: ['input', 'output'],
            version: 1,
            description: 'Translate data using Google Translate',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'Google Translate',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                },
                {
                    name: 'googleTranslateOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'serviceAccount',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Language',
                            value: 'language',
                        },
                    ],
                    default: 'language',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'language',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Translate',
                            value: 'translate',
                            description: 'Translate data',
                        },
                    ],
                    default: 'translate',
                },
                // ----------------------------------
                //         All
                // ----------------------------------
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    default: '',
                    description: 'The input text to translate',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'translate',
                            ],
                        },
                    },
                },
                {
                    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                    displayName: 'Translate To',
                    name: 'translateTo',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getLanguages',
                    },
                    default: '',
                    description: 'The language to use for translation of the input text, set to one of the language codes listed in <a href="https://cloud.google.com/translate/docs/languages">Language Support</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'translate',
                            ],
                        },
                    },
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { data: { languages } } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', '/language/translate/v2/languages');
                        for (const language of languages) {
                            returnData.push({
                                name: language.language.toUpperCase(),
                                value: language.language,
                            });
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
            const length = items.length;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const responseData = [];
            for (let i = 0; i < length; i++) {
                if (resource === 'language') {
                    if (operation === 'translate') {
                        const text = this.getNodeParameter('text', i);
                        const translateTo = this.getNodeParameter('translateTo', i);
                        const response = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/language/translate/v2`, { q: text, target: translateTo });
                        responseData.push(response.data.translations[0]);
                    }
                }
            }
            return [this.helpers.returnJsonArray(responseData)];
        });
    }
}
exports.GoogleTranslate = GoogleTranslate;
