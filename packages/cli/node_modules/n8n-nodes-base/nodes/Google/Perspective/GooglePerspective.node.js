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
exports.GooglePerspective = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ISO6391 = require('iso-639-1');
class GooglePerspective {
    constructor() {
        this.description = {
            displayName: 'Google Perspective',
            name: 'googlePerspective',
            icon: 'file:perspective.svg',
            group: [
                'transform',
            ],
            version: 1,
            description: 'Consume Google Perspective API',
            subtitle: '={{$parameter["operation"]}}',
            defaults: {
                name: 'Google Perspective',
            },
            inputs: [
                'main',
            ],
            outputs: [
                'main',
            ],
            credentials: [
                {
                    name: 'googlePerspectiveOAuth2Api',
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
                            name: 'Analyze Comment',
                            value: 'analyzeComment',
                        },
                    ],
                    default: 'analyzeComment',
                },
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'analyzeComment',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Attributes to Analyze',
                    name: 'requestedAttributesUi',
                    type: 'fixedCollection',
                    default: {},
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Atrribute',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'analyzeComment',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Properties',
                            name: 'requestedAttributesValues',
                            values: [
                                {
                                    displayName: 'Attribute Name',
                                    name: 'attributeName',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Flirtation',
                                            value: 'flirtation',
                                        },
                                        {
                                            name: 'Identity Attack',
                                            value: 'identity_attack',
                                        },
                                        {
                                            name: 'Insult',
                                            value: 'insult',
                                        },
                                        {
                                            name: 'Profanity',
                                            value: 'profanity',
                                        },
                                        {
                                            name: 'Severe Toxicity',
                                            value: 'severe_toxicity',
                                        },
                                        {
                                            name: 'Sexually Explicit',
                                            value: 'sexually_explicit',
                                        },
                                        {
                                            name: 'Threat',
                                            value: 'threat',
                                        },
                                        {
                                            name: 'Toxicity',
                                            value: 'toxicity',
                                        },
                                    ],
                                    description: 'Attribute to analyze in the text. Details <a href="https://developers.perspectiveapi.com/s/about-the-api-attributes-and-languages">here</a>.',
                                    default: 'flirtation',
                                },
                                {
                                    displayName: 'Score Threshold',
                                    name: 'scoreThreshold',
                                    type: 'number',
                                    typeOptions: {
                                        numberPrecision: 2,
                                        minValue: 0,
                                        maxValue: 1,
                                    },
                                    description: 'Score above which to return results. At zero, all scores are returned.',
                                    default: 0,
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'analyzeComment',
                            ],
                        },
                    },
                    default: {},
                    placeholder: 'Add Option',
                    options: [
                        {
                            displayName: 'Language Name or ID',
                            name: 'languages',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getLanguages',
                            },
                            default: '',
                            description: 'Languages of the text input. If unspecified, the API will auto-detect the comment language. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available languages to display them to user so that he can
                // select them easily
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const supportedLanguages = [
                            'English',
                            'Spanish',
                            'French',
                            'German',
                            'Portuguese',
                            'Italian',
                            'Russian',
                        ];
                        const languages = ISO6391.getAllNames().filter((language) => supportedLanguages.includes(language));
                        for (const language of languages) {
                            const languageName = language;
                            const languageId = ISO6391.getCode(language);
                            returnData.push({
                                name: languageName,
                                value: languageId,
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
            const operation = this.getNodeParameter('operation', 0);
            const returnData = [];
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (operation === 'analyzeComment') {
                        // https://developers.perspectiveapi.com/s/about-the-api-methods
                        const attributes = this.getNodeParameter('requestedAttributesUi.requestedAttributesValues', i, []);
                        if (!attributes.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one attribute to analyze.');
                        }
                        const requestedAttributes = attributes.reduce((acc, cur) => {
                            return Object.assign(acc, {
                                [cur.attributeName.toUpperCase()]: {
                                    scoreType: 'probability',
                                    scoreThreshold: cur.scoreThreshold,
                                },
                            });
                        }, {});
                        const body = {
                            comment: {
                                type: 'PLAIN_TEXT',
                                text: this.getNodeParameter('text', i),
                            },
                            requestedAttributes,
                        };
                        const { languages } = this.getNodeParameter('options', i);
                        if (languages === null || languages === void 0 ? void 0 : languages.length) {
                            body.languages = languages;
                        }
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/v1alpha1/comments:analyze', body);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(responseData)];
        });
    }
}
exports.GooglePerspective = GooglePerspective;
