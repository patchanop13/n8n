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
exports.ActiveCampaignTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class ActiveCampaignTrigger {
    constructor() {
        this.description = {
            displayName: 'ActiveCampaign Trigger',
            name: 'activeCampaignTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:activeCampaign.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle ActiveCampaign events via webhooks',
            defaults: {
                name: 'ActiveCampaign Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'activeCampaignApi',
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
                    displayName: 'Event Names or IDs',
                    name: 'events',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getEvents',
                    },
                    default: [],
                    options: [],
                },
                {
                    displayName: 'Source',
                    name: 'sources',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Public',
                            value: 'public',
                            description: 'Run the hooks when a contact triggers the action',
                        },
                        {
                            name: 'Admin',
                            value: 'admin',
                            description: 'Run the hooks when an admin user triggers the action',
                        },
                        {
                            name: 'Api',
                            value: 'api',
                            description: 'Run the hooks when an API call triggers the action',
                        },
                        {
                            name: 'System',
                            value: 'system',
                            description: 'Run the hooks when automated systems triggers the action',
                        },
                    ],
                    default: [],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the events to display them to user so that he can
                // select them easily
                getEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const events = yield GenericFunctions_1.activeCampaignApiRequestAllItems.call(this, 'GET', '/api/3/webhook/events', {}, {}, 'webhookEvents');
                        for (const event of events) {
                            const eventName = event;
                            const eventId = event;
                            returnData.push({
                                name: eventName,
                                value: eventId,
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
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const endpoint = `/api/3/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'GET', endpoint, {});
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
                        const events = this.getNodeParameter('events', []);
                        const sources = this.getNodeParameter('sources', '');
                        const body = {
                            webhook: {
                                name: `n8n-webhook:${webhookUrl}`,
                                url: webhookUrl,
                                events,
                                sources,
                            },
                        };
                        const { webhook } = yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'POST', '/api/3/webhooks', body);
                        webhookData.webhookId = webhook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'DELETE', `/api/3/webhooks/${webhookData.webhookId}`, {});
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
exports.ActiveCampaignTrigger = ActiveCampaignTrigger;
