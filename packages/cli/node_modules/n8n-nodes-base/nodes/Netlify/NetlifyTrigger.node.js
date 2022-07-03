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
exports.NetlifyTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class NetlifyTrigger {
    constructor() {
        this.description = {
            displayName: 'Netlify Trigger',
            name: 'netlifyTrigger',
            icon: 'file:netlify.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle netlify events via webhooks',
            defaults: {
                name: 'Netlify Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'netlifyApi',
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
                    displayName: 'Site Name or ID',
                    name: 'siteId',
                    required: true,
                    type: 'options',
                    default: '',
                    typeOptions: {
                        loadOptionsMethod: 'getSites',
                    },
                    description: 'Select the Site ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Deploy Building',
                            value: 'deployBuilding',
                        },
                        {
                            name: 'Deploy Failed',
                            value: 'deployFailed',
                        },
                        {
                            name: 'Deploy Created',
                            value: 'deployCreated',
                        },
                        {
                            name: 'Form Submitted',
                            value: 'submissionCreated',
                        },
                    ],
                },
                {
                    displayName: 'Form Name or ID',
                    name: 'formId',
                    type: 'options',
                    required: true,
                    displayOptions: {
                        show: {
                            event: [
                                'submissionCreated',
                            ],
                        },
                    },
                    default: '',
                    typeOptions: {
                        loadOptionsMethod: 'getForms',
                    },
                    description: 'Select a form. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            event: [
                                'submissionCreated',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const qs = {};
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const event = this.getNodeParameter('event');
                        qs.site_id = this.getNodeParameter('siteId');
                        const webhooks = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', '/hooks', {}, qs);
                        for (const webhook of webhooks) {
                            if (webhook.type === 'url') {
                                if (webhook.data.url === webhookUrl && webhook.event === (0, change_case_1.snakeCase)(event)) {
                                    webhookData.webhookId = webhook.id;
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //TODO - implement missing events
                        // alL posible events can be found doing a GET /hooks/types
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const event = this.getNodeParameter('event');
                        const body = {
                            event: (0, change_case_1.snakeCase)(event),
                            data: {
                                url: webhookUrl,
                            },
                            site_id: this.getNodeParameter('siteId'),
                        };
                        const formId = this.getNodeParameter('formId', '*');
                        if (event === 'submissionCreated' && formId !== '*') {
                            body.form_id = this.getNodeParameter('formId');
                        }
                        const webhook = yield GenericFunctions_1.netlifyApiRequest.call(this, 'POST', '/hooks', body);
                        webhookData.webhookId = webhook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.netlifyApiRequest.call(this, 'DELETE', `/hooks/${webhookData.webhookId}`);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
        this.methods = {
            loadOptions: {
                getSites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const sites = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', '/sites');
                        for (const site of sites) {
                            returnData.push({
                                name: site.name,
                                value: site.site_id,
                            });
                        }
                        return returnData;
                    });
                },
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const siteId = this.getNodeParameter('siteId');
                        const forms = yield GenericFunctions_1.netlifyApiRequest.call(this, 'GET', `/sites/${siteId}/forms`);
                        for (const form of forms) {
                            returnData.push({
                                name: form.name,
                                value: form.id,
                            });
                        }
                        returnData.unshift({ name: '[All Forms]', value: '*' });
                        return returnData;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const simple = this.getNodeParameter('simple', false);
            const event = this.getNodeParameter('event');
            let response = req.body;
            if (simple === true && event === 'submissionCreated') {
                response = response.data;
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(response),
                ],
            };
        });
    }
}
exports.NetlifyTrigger = NetlifyTrigger;
