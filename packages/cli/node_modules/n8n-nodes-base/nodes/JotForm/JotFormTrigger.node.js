"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.JotFormTrigger = void 0;
const formidable = __importStar(require("formidable"));
const GenericFunctions_1 = require("./GenericFunctions");
class JotFormTrigger {
    constructor() {
        this.description = {
            displayName: 'JotForm Trigger',
            name: 'jotFormTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:jotform.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle JotForm events via webhooks',
            defaults: {
                name: 'JotForm Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'jotFormApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Form Name or ID',
                    name: 'form',
                    type: 'options',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getForms',
                    },
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                },
                {
                    displayName: 'Resolve Data',
                    name: 'resolveData',
                    type: 'boolean',
                    default: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'By default does the webhook-data use internal keys instead of the names. If this option gets activated, it will resolve the keys automatically to the actual names.',
                },
                {
                    displayName: 'Only Answers',
                    name: 'onlyAnswers',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return only the answers of the form and not any of the other data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available forms to display them to user so that he can
                // select them easily
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {
                            limit: 1000,
                        };
                        const forms = yield GenericFunctions_1.jotformApiRequest.call(this, 'GET', '/user/forms', {}, qs);
                        for (const form of forms.content) {
                            const formName = form.title;
                            const formId = form.id;
                            returnData.push({
                                name: formName,
                                value: formId,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('form');
                        const endpoint = `/form/${formId}/webhooks`;
                        try {
                            const responseData = yield GenericFunctions_1.jotformApiRequest.call(this, 'GET', endpoint);
                            const webhookUrls = Object.values(responseData.content);
                            const webhookUrl = this.getNodeWebhookUrl('default');
                            if (!webhookUrls.includes(webhookUrl)) {
                                return false;
                            }
                            const webhookIds = Object.keys(responseData.content);
                            webhookData.webhookId = webhookIds[webhookUrls.indexOf(webhookUrl)];
                        }
                        catch (error) {
                            return false;
                        }
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('form');
                        const endpoint = `/form/${formId}/webhooks`;
                        const body = {
                            webhookURL: webhookUrl,
                            //webhookURL: 'https://en0xsizp3qyt7f.x.pipedream.net/',
                        };
                        const { content } = yield GenericFunctions_1.jotformApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = Object.keys(content)[0];
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let responseData;
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('form');
                        const endpoint = `/form/${formId}/webhooks/${webhookData.webhookId}`;
                        try {
                            responseData = yield GenericFunctions_1.jotformApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        if (responseData.message !== 'success') {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    //@ts-ignore
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const formId = this.getNodeParameter('form');
            const resolveData = this.getNodeParameter('resolveData', false);
            const onlyAnswers = this.getNodeParameter('onlyAnswers', false);
            const form = new formidable.IncomingForm({});
            return new Promise((resolve, reject) => {
                form.parse(req, (err, data, files) => __awaiter(this, void 0, void 0, function* () {
                    const rawRequest = JSON.parse(data.rawRequest);
                    data.rawRequest = rawRequest;
                    let returnData;
                    if (resolveData === false) {
                        if (onlyAnswers === true) {
                            returnData = data.rawRequest;
                        }
                        else {
                            returnData = data;
                        }
                        resolve({
                            workflowData: [
                                this.helpers.returnJsonArray(returnData),
                            ],
                        });
                    }
                    // Resolve the data by requesting the information via API
                    const endpoint = `/form/${formId}/questions`;
                    const responseData = yield GenericFunctions_1.jotformApiRequest.call(this, 'GET', endpoint, {});
                    // Create a dictionary to resolve the keys
                    const questionNames = {};
                    for (const question of Object.values(responseData.content)) {
                        questionNames[question.name] = question.text;
                    }
                    // Resolve the keys
                    let questionKey;
                    const questionsData = {};
                    for (const key of Object.keys(rawRequest)) {
                        if (!key.includes('_')) {
                            continue;
                        }
                        questionKey = key.split('_').slice(1).join('_');
                        if (questionNames[questionKey] === undefined) {
                            continue;
                        }
                        questionsData[questionNames[questionKey]] = rawRequest[key];
                    }
                    if (onlyAnswers === true) {
                        returnData = questionsData;
                    }
                    else {
                        // @ts-ignore
                        data.rawRequest = questionsData;
                        returnData = data;
                    }
                    resolve({
                        workflowData: [
                            this.helpers.returnJsonArray(returnData),
                        ],
                    });
                }));
            });
        });
    }
}
exports.JotFormTrigger = JotFormTrigger;
