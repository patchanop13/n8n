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
exports.PostmarkTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class PostmarkTrigger {
    constructor() {
        this.description = {
            displayName: 'Postmark Trigger',
            name: 'postmarkTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:postmark.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Postmark events occur',
            defaults: {
                name: 'Postmark Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'postmarkApi',
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
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Bounce',
                            value: 'bounce',
                            description: 'Trigger on bounce',
                        },
                        {
                            name: 'Click',
                            value: 'click',
                            description: 'Trigger on click',
                        },
                        {
                            name: 'Delivery',
                            value: 'delivery',
                            description: 'Trigger on delivery',
                        },
                        {
                            name: 'Open',
                            value: 'open',
                            description: 'Trigger webhook on open',
                        },
                        {
                            name: 'Spam Complaint',
                            value: 'spamComplaint',
                            description: 'Trigger on spam complaint',
                        },
                        {
                            name: 'Subscription Change',
                            value: 'subscriptionChange',
                            description: 'Trigger on subscription change',
                        },
                    ],
                    default: [],
                    required: true,
                    description: 'Webhook events that will be enabled for that endpoint',
                },
                {
                    displayName: 'First Open',
                    name: 'firstOpen',
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'Only fires on first open for event "Open"',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            events: [
                                'open',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Include Content',
                    name: 'includeContent',
                    description: 'Whether to include message content for events "Bounce" and "Spam Complaint"',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            events: [
                                'bounce',
                                'spamComplaint',
                            ],
                        },
                    },
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events');
                        if (events.includes('bounce') || events.includes('spamComplaint')) {
                            if (this.getNodeParameter('includeContent')) {
                                events.push('includeContent');
                            }
                        }
                        if (events.includes('open')) {
                            if (this.getNodeParameter('firstOpen')) {
                                events.push('firstOpen');
                            }
                        }
                        // Get all webhooks
                        const endpoint = `/webhooks`;
                        const responseData = yield GenericFunctions_1.postmarkApiRequest.call(this, 'GET', endpoint, {});
                        // No webhooks exist
                        if (responseData.Webhooks.length === 0) {
                            return false;
                        }
                        // If webhooks exist, check if any match current settings
                        for (const webhook of responseData.Webhooks) {
                            if (webhook.Url === webhookUrl && (0, GenericFunctions_1.eventExists)(events, (0, GenericFunctions_1.convertTriggerObjectToStringArray)(webhook))) {
                                webhookData.webhookId = webhook.ID;
                                // webhook identical to current settings. re-assign webhook id to found webhook.
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const endpoint = `/webhooks`;
                        // tslint:disable-next-line: no-any
                        const body = {
                            Url: webhookUrl,
                            Triggers: {
                                Open: {
                                    Enabled: false,
                                    PostFirstOpenOnly: false,
                                },
                                Click: {
                                    Enabled: false,
                                },
                                Delivery: {
                                    Enabled: false,
                                },
                                Bounce: {
                                    Enabled: false,
                                    IncludeContent: false,
                                },
                                SpamComplaint: {
                                    Enabled: false,
                                    IncludeContent: false,
                                },
                                SubscriptionChange: {
                                    Enabled: false,
                                },
                            },
                        };
                        const events = this.getNodeParameter('events');
                        if (events.includes('open')) {
                            body.Triggers.Open.Enabled = true;
                            body.Triggers.Open.PostFirstOpenOnly = this.getNodeParameter('firstOpen');
                        }
                        if (events.includes('click')) {
                            body.Triggers.Click.Enabled = true;
                        }
                        if (events.includes('delivery')) {
                            body.Triggers.Delivery.Enabled = true;
                        }
                        if (events.includes('bounce')) {
                            body.Triggers.Bounce.Enabled = true;
                            body.Triggers.Bounce.IncludeContent = this.getNodeParameter('includeContent');
                        }
                        if (events.includes('spamComplaint')) {
                            body.Triggers.SpamComplaint.Enabled = true;
                            body.Triggers.SpamComplaint.IncludeContent = this.getNodeParameter('includeContent');
                        }
                        if (events.includes('subscriptionChange')) {
                            body.Triggers.SubscriptionChange.Enabled = true;
                        }
                        const responseData = yield GenericFunctions_1.postmarkApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.ID === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = responseData.ID;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhooks/${webhookData.webhookId}`;
                            const body = {};
                            try {
                                yield GenericFunctions_1.postmarkApiRequest.call(this, 'DELETE', endpoint, body);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                            delete webhookData.webhookEvents;
                        }
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
exports.PostmarkTrigger = PostmarkTrigger;
