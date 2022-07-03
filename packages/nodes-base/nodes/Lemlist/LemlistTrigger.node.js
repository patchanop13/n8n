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
exports.LemlistTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class LemlistTrigger {
    constructor() {
        this.description = {
            displayName: 'Lemlist Trigger',
            name: 'lemlistTrigger',
            icon: 'file:lemlist.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle Lemlist events via webhooks',
            defaults: {
                name: 'Lemlist Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'lemlistApi',
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
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        ...(0, GenericFunctions_1.getEvents)(),
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Campaing Name or ID',
                            name: 'campaignId',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getCampaigns',
                            },
                            default: '',
                            description: 'We\'ll call this hook only for this campaignId. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Is First',
                            name: 'isFirst',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to call this hook only the first time this activity happened',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const campaigns = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns');
                        return campaigns.map(({ _id, name }) => ({
                            name,
                            value: _id,
                        }));
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
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhooks = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/hooks');
                        for (const webhook of webhooks) {
                            if (webhook.targetUrl === webhookUrl) {
                                yield GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', `/hooks/${webhookData.webhookId}`);
                                return false;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const options = this.getNodeParameter('options');
                        const event = this.getNodeParameter('event');
                        const body = {
                            targetUrl: webhookUrl,
                            type: event,
                        };
                        if (event.includes('*')) {
                            delete body.type;
                        }
                        Object.assign(body, options);
                        const webhook = yield GenericFunctions_1.lemlistApiRequest.call(this, 'POST', '/hooks', body);
                        webhookData.webhookId = webhook._id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', `/hooks/${webhookData.webhookId}`);
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
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.LemlistTrigger = LemlistTrigger;
