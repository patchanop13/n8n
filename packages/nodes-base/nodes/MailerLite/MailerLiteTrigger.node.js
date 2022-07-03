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
exports.MailerLiteTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class MailerLiteTrigger {
    constructor() {
        this.description = {
            displayName: 'MailerLite Trigger',
            name: 'mailerLiteTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:mailerLite.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when MailerLite events occur',
            defaults: {
                name: 'MailerLite Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailerLiteApi',
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
                    options: [
                        {
                            name: 'Campaign Sent',
                            value: 'campaign.sent',
                            description: 'Fired when campaign is sent',
                        },
                        {
                            name: 'Subscriber Added Throught Webform',
                            value: 'subscriber.added_through_webform',
                            description: 'Fired when a subscriber is added though a form',
                        },
                        {
                            name: 'Subscriber Added to Group',
                            value: 'subscriber.add_to_group',
                            description: 'Fired when a subscriber is added to a group',
                        },
                        {
                            name: 'Subscriber Autonomation Completed',
                            value: 'subscriber.automation_complete',
                            description: 'Fired when subscriber finishes automation',
                        },
                        {
                            name: 'Subscriber Autonomation Triggered',
                            value: 'subscriber.automation_triggered',
                            description: 'Fired when subscriber starts automation',
                        },
                        {
                            name: 'Subscriber Bounced',
                            value: 'subscriber.bounced',
                            description: 'Fired when an email address bounces',
                        },
                        {
                            name: 'Subscriber Complained',
                            value: 'subscriber.complaint',
                            description: 'Fired when subscriber marks a campaign as a spam',
                        },
                        {
                            name: 'Subscriber Created',
                            value: 'subscriber.create',
                            description: 'Fired when a new subscriber is added to an account',
                        },
                        {
                            name: 'Subscriber Removed From Group',
                            value: 'subscriber.remove_from_group',
                            description: 'Fired when a subscriber is removed from a group',
                        },
                        {
                            name: 'Subscriber Unsubscribe',
                            value: 'subscriber.unsubscribe',
                            description: 'Fired when a subscriber becomes unsubscribed',
                        },
                        {
                            name: 'Subscriber Updated',
                            value: 'subscriber.update',
                            description: 'Fired when any of the subscriber\'s custom fields are updated',
                        },
                    ],
                    required: true,
                    default: [],
                    description: 'The events to listen to',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const event = this.getNodeParameter('event');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/webhooks';
                        const { webhooks } = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'GET', endpoint, {});
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl &&
                                webhook.event === event) {
                                // Set webhook-id to be sure that it can be deleted
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const event = this.getNodeParameter('event');
                        const endpoint = '/webhooks';
                        const body = {
                            url: webhookUrl,
                            event,
                        };
                        const responseData = yield GenericFunctions_1.mailerliteApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.mailerliteApiRequest.call(this, 'DELETE', endpoint);
                            }
                            catch (error) {
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
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.getBodyData();
            const events = body.events;
            return {
                workflowData: [
                    this.helpers.returnJsonArray(events),
                ],
            };
        });
    }
}
exports.MailerLiteTrigger = MailerLiteTrigger;
