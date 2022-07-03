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
exports.FormstackTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class FormstackTrigger {
    constructor() {
        this.description = {
            displayName: 'Formstack Trigger',
            name: 'formstackTrigger',
            icon: 'file:formstack.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '=Form ID: {{$parameter["formId"]}}',
            description: 'Starts the workflow on a Formstack form submission.',
            defaults: {
                name: 'Formstack Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'formstackApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'formstackOAuth2Api',
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Form Name or ID',
                    name: 'formId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getForms',
                    },
                    default: '',
                    required: true,
                    description: 'The Formstack form to monitor for new submissions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getForms: GenericFunctions_1.getForms,
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('formId');
                        const endpoint = `form/${formId}/webhook.json`;
                        const { webhooks } = yield GenericFunctions_1.apiRequest.call(this, 'GET', endpoint);
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const formId = this.getNodeParameter('formId');
                        const endpoint = `form/${formId}/webhook.json`;
                        // TODO: Add handshake key support
                        const body = {
                            url: webhookUrl,
                            standardize_field_values: true,
                            include_field_type: true,
                            content_type: 'json',
                        };
                        const response = yield GenericFunctions_1.apiRequest.call(this, 'POST', endpoint, body);
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = response.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `webhook/${webhookData.webhookId}.json`;
                            try {
                                const body = {};
                                yield GenericFunctions_1.apiRequest.call(this, 'DELETE', endpoint, body);
                            }
                            catch (e) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                        }
                        return true;
                    });
                },
            },
        };
    }
    // @ts-ignore
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            const simple = this.getNodeParameter('simple');
            const response = bodyData;
            if (simple) {
                for (const key of Object.keys(response)) {
                    if (response[key].hasOwnProperty('value')) {
                        response[key] = response[key].value;
                    }
                }
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray([response]),
                ],
            };
        });
    }
}
exports.FormstackTrigger = FormstackTrigger;
