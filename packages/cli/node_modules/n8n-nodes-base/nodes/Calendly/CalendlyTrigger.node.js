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
exports.CalendlyTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class CalendlyTrigger {
    constructor() {
        this.description = {
            displayName: 'Calendly Trigger',
            name: 'calendlyTrigger',
            icon: 'file:calendly.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Calendly events occur',
            defaults: {
                name: 'Calendly Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'calendlyApi',
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
                            name: 'invitee.created',
                            value: 'invitee.created',
                            description: 'Receive notifications when a new Calendly event is created',
                        },
                        {
                            name: 'invitee.canceled',
                            value: 'invitee.canceled',
                            description: 'Receive notifications when a Calendly event is canceled',
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
                        const endpoint = '/hooks';
                        const { data } = yield GenericFunctions_1.calendlyApiRequest.call(this, 'GET', endpoint, {});
                        for (const webhook of data) {
                            if (webhook.attributes.url === webhookUrl) {
                                for (const event of events) {
                                    if (!webhook.attributes.events.includes(event)) {
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
                        const endpoint = '/hooks';
                        const body = {
                            url: webhookUrl,
                            events,
                        };
                        const responseData = yield GenericFunctions_1.calendlyApiRequest.call(this, 'POST', endpoint, body);
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
                            const endpoint = `/hooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.calendlyApiRequest.call(this, 'DELETE', endpoint);
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
            const bodyData = this.getBodyData();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.CalendlyTrigger = CalendlyTrigger;
