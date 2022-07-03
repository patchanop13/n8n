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
exports.EmeliaTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class EmeliaTrigger {
    constructor() {
        this.description = {
            displayName: 'Emelia Trigger',
            name: 'emeliaTrigger',
            icon: 'file:emelia.svg',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            group: ['trigger'],
            version: 1,
            description: 'Handle Emelia campaign activity events via webhooks',
            defaults: {
                name: 'Emelia Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'emeliaApi',
                    required: true,
                    testedBy: 'emeliaApiTest',
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
                    displayName: 'Campaign Name or ID',
                    name: 'campaignId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getCampaigns',
                    },
                    required: true,
                    default: '',
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: [],
                    options: [
                        {
                            name: 'Email Bounced',
                            value: 'bounced',
                        },
                        {
                            name: 'Email Opened',
                            value: 'opened',
                        },
                        {
                            name: 'Email Replied',
                            value: 'replied',
                        },
                        {
                            name: 'Email Sent',
                            value: 'sent',
                        },
                        {
                            name: 'Link Clicked',
                            value: 'clicked',
                        },
                        {
                            name: 'Unsubscribed Contact',
                            value: 'unsubscribed',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            credentialTest: {
                emeliaApiTest: GenericFunctions_1.emeliaApiTest,
            },
            loadOptions: {
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                            query: `
					query GetCampaigns {
						campaigns {
							_id
							name
						}
					}`,
                            operationName: 'GetCampaigns',
                            variables: '{}',
                        });
                        return responseData.data.campaigns.map((campaign) => ({
                            name: campaign.name,
                            value: campaign._id,
                        }));
                    });
                },
            },
        };
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const campaignId = this.getNodeParameter('campaignId');
                        const { webhooks } = yield GenericFunctions_1.emeliaApiRequest.call(this, 'GET', '/webhook');
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl && webhook.campaignId === campaignId) {
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const events = this.getNodeParameter('events');
                        const campaignId = this.getNodeParameter('campaignId');
                        const body = {
                            hookUrl: webhookUrl,
                            events: events.map(e => e.toUpperCase()),
                            campaignId,
                        };
                        const { webhookId } = yield GenericFunctions_1.emeliaApiRequest.call(this, 'POST', '/webhook/webhook', body);
                        webhookData.webhookId = webhookId;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const campaignId = this.getNodeParameter('campaignId');
                        try {
                            const body = {
                                hookUrl: webhookUrl,
                                campaignId,
                            };
                            yield GenericFunctions_1.emeliaApiRequest.call(this, 'DELETE', '/webhook/webhook', body);
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
exports.EmeliaTrigger = EmeliaTrigger;
