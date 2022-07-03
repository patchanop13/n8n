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
exports.CalTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class CalTrigger {
    constructor() {
        this.description = {
            displayName: 'Cal Trigger',
            name: 'calTrigger',
            icon: 'file:cal.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '=Events: {{$parameter["events"].join(", ")}}',
            description: 'Handle Cal events via webhooks',
            defaults: {
                name: 'Cal Trigger',
                color: '#888',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'calApi',
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
                            name: 'Booking Cancelled',
                            value: 'BOOKING_CANCELLED',
                            description: 'Receive notifications when a Cal event is canceled',
                        },
                        {
                            name: 'Booking Created',
                            value: 'BOOKING_CREATED',
                            description: 'Receive notifications when a new Cal event is created',
                        },
                        {
                            name: 'Booking Rescheduled',
                            value: 'BOOKING_RESCHEDULED',
                            description: 'Receive notifications when a Cal event is rescheduled',
                        },
                    ],
                    default: [],
                    required: true,
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'App ID',
                            name: 'appId',
                            type: 'string',
                            description: 'The ID of the App to monitor',
                            default: '',
                        },
                        {
                            displayName: 'EventType Name or ID',
                            name: 'eventTypeId',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getEventTypes',
                            },
                            description: 'The EventType to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                            default: '',
                        },
                        {
                            displayName: 'Payload Template',
                            name: 'payloadTemplate',
                            type: 'string',
                            description: 'Template to customize the webhook payload',
                            default: '',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                                rows: 4,
                            },
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getEventTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const data = yield GenericFunctions_1.calApiRequest.call(this, 'GET', '/event-types', {});
                        for (const item of data.event_types) {
                            returnData.push({
                                name: item.title,
                                value: item.id,
                            });
                        }
                        return (0, GenericFunctions_1.sortOptionParameters)(returnData);
                    });
                },
            },
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
                        const data = yield GenericFunctions_1.calApiRequest.call(this, 'GET', '/hooks', {});
                        for (const webhook of data.webhooks) {
                            if (webhook.subscriberUrl === webhookUrl) {
                                for (const event of events) {
                                    if (!webhook.eventTriggers.includes(event)) {
                                        return false;
                                    }
                                }
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
                        const subscriberUrl = this.getNodeWebhookUrl('default');
                        const eventTriggers = this.getNodeParameter('events');
                        const options = this.getNodeParameter('options');
                        const active = true;
                        const body = Object.assign({ subscriberUrl,
                            eventTriggers,
                            active }, options);
                        const responseData = yield GenericFunctions_1.calApiRequest.call(this, 'POST', '/hooks', body);
                        if (responseData.webhook.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.webhook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/hooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.calApiRequest.call(this, 'DELETE', endpoint);
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
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(Object.assign({ triggerEvent: req.body.triggerEvent, createdAt: req.body.createdAt }, req.body.payload)),
                ],
            };
        });
    }
}
exports.CalTrigger = CalTrigger;
