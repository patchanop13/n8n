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
exports.DeepL = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const TextDescription_1 = require("./TextDescription");
class DeepL {
    constructor() {
        this.description = {
            displayName: 'DeepL',
            name: 'deepL',
            icon: 'file:deepl.svg',
            group: ['input', 'output'],
            version: 1,
            description: 'Translate data using DeepL',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'DeepL',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'deepLApi',
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
                ...TextDescription_1.textOperations,
            ],
        };
        this.methods = {
            loadOptions: {
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const languages = yield GenericFunctions_1.deepLApiRequest.call(this, 'GET', '/languages', {}, { type: 'target' });
                        for (const language of languages) {
                            returnData.push({
                                name: language.name,
                                value: language.language,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
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
            const responseData = [];
            for (let i = 0; i < length; i++) {
                try {
                    const resource = this.getNodeParameter('resource', i);
                    const operation = this.getNodeParameter('operation', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    if (resource === 'language') {
                        if (operation === 'translate') {
                            const text = this.getNodeParameter('text', i);
                            const translateTo = this.getNodeParameter('translateTo', i);
                            const qs = { target_lang: translateTo, text };
                            if (additionalFields.sourceLang !== undefined) {
                                qs.source_lang = ['EN-GB', 'EN-US'].includes(additionalFields.sourceLang)
                                    ? 'EN'
                                    : additionalFields.sourceLang;
                            }
                            const response = yield GenericFunctions_1.deepLApiRequest.call(this, 'GET', '/translate', {}, qs);
                            responseData.push(response.translations[0]);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ $error: error, $json: this.getInputData(i) });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(responseData)];
        });
    }
}
exports.DeepL = DeepL;
