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
exports.LingvaNex = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class LingvaNex {
    constructor() {
        this.description = {
            displayName: 'LingvaNex',
            name: 'lingvaNex',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:lingvanex.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume LingvaNex API',
            defaults: {
                name: 'LingvaNex',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'lingvaNexApi',
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
                {
                    displayName: 'Additional Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'translate',
                            ],
                        },
                    },
                    options: [
                        {
                            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                            displayName: 'From',
                            name: 'from',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getLanguages',
                            },
                            default: '',
                            description: 'The language code in the format “language code_code of the country”. If this parameter is not present, the auto-detect language mode is enabled. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Platform',
                            name: 'platform',
                            type: 'string',
                            default: 'api',
                        },
                        {
                            displayName: 'Translate Mode',
                            name: 'translateMode',
                            type: 'string',
                            default: '',
                            description: 'Describe the input text format. Possible value is "html" for translating and preserving html structure. If value is not specified or is other than "html" than plain text is translating.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const data = yield GenericFunctions_1.lingvaNexApiRequest.call(this, 'GET', '/getLanguages', {}, { 'platform': 'api' });
                        for (const language of data.result) {
                            returnData.push({
                                name: language.englishName,
                                value: language.full_code,
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
            const operation = this.getNodeParameter('operation', 0);
            const responseData = [];
            for (let i = 0; i < length; i++) {
                if (operation === 'translate') {
                    const text = this.getNodeParameter('text', i);
                    const translateTo = this.getNodeParameter('translateTo', i);
                    const options = this.getNodeParameter('options', i);
                    const body = {
                        data: text,
                        to: translateTo,
                        platform: 'api',
                    };
                    Object.assign(body, options);
                    const response = yield GenericFunctions_1.lingvaNexApiRequest.call(this, 'POST', `/translate`, body);
                    responseData.push(response);
                }
            }
            return [this.helpers.returnJsonArray(responseData)];
        });
    }
}
exports.LingvaNex = LingvaNex;
