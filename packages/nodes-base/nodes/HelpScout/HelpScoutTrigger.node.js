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
exports.HelpScoutTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class HelpScoutTrigger {
    constructor() {
        this.description = {
            displayName: 'HelpScout Trigger',
            name: 'helpScoutTrigger',
            icon: 'file:helpScout.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when HelpScout events occur',
            defaults: {
                name: 'HelpScout Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'helpScoutOAuth2Api',
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
                            name: 'Conversation - Assigned',
                            value: 'convo.assigned',
                        },
                        {
                            name: 'Conversation - Created',
                            value: 'convo.created',
                        },
                        {
                            name: 'Conversation - Deleted',
                            value: 'convo.deleted',
                        },
                        {
                            name: 'Conversation - Merged',
                            value: 'convo.merged',
                        },
                        {
                            name: 'Conversation - Moved',
                            value: 'convo.moved',
                        },
                        {
                            name: 'Conversation - Status',
                            value: 'convo.status',
                        },
                        {
                            name: 'Conversation - Tags',
                            value: 'convo.tags',
                        },
                        {
                            name: 'Conversation Agent Reply - Created',
                            value: 'convo.agent.reply.created',
                        },
                        {
                            name: 'Conversation Customer Reply - Created',
                            value: 'convo.customer.reply.created',
                        },
                        {
                            name: 'Conversation Note - Created',
                            value: 'convo.note.created',
                        },
                        {
                            name: 'Customer - Created',
                            value: 'customer.created',
                        },
                        {
                            name: 'Rating - Received',
                            value: 'satisfaction.ratings',
                        },
                    ],
                    default: [],
                    required: true,
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
                        const events = this.getNodeParameter('events');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const endpoint = '/v2/webhooks';
                        const data = yield GenericFunctions_1.helpscoutApiRequestAllItems.call(this, '_embedded.webhooks', 'GET', endpoint, {});
                        for (const webhook of data) {
                            if (webhook.url === webhookUrl) {
                                for (const event of events) {
                                    if (!webhook.events.includes(event)
                                        && webhook.state === 'enabled') {
                                        return false;
                                    }
                                }
                            }
                            // Set webhook-id to be sure that it can be deleted
                            webhookData.webhookId = webhook.id;
                            return true;
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events');
                        const endpoint = '/v2/webhooks';
                        const body = {
                            url: webhookUrl,
                            events,
                            secret: Math.random().toString(36).substring(2, 15),
                        };
                        const responseData = yield GenericFunctions_1.helpscoutApiRequest.call(this, 'POST', endpoint, body, {}, undefined, { resolveWithFullResponse: true });
                        if (responseData.headers['resource-id'] === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.headers['resource-id'];
                        webhookData.secret = body.secret;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/v2/webhooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.helpscoutApiRequest.call(this, 'DELETE', endpoint);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                            delete webhookData.secret;
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
            const bodyData = this.getBodyData();
            const headerData = this.getHeaderData();
            const webhookData = this.getWorkflowStaticData('node');
            if (headerData['x-helpscout-signature'] === undefined) {
                return {};
            }
            //@ts-ignore
            const computedSignature = (0, crypto_1.createHmac)('sha1', webhookData.secret).update(req.rawBody).digest('base64');
            if (headerData['x-helpscout-signature'] !== computedSignature) {
                return {};
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.HelpScoutTrigger = HelpScoutTrigger;
