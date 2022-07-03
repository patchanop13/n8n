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
exports.PayPalTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class PayPalTrigger {
    constructor() {
        this.description = {
            displayName: 'PayPal Trigger',
            name: 'payPalTrigger',
            icon: 'file:paypal.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle PayPal events via webhooks',
            defaults: {
                name: 'PayPal Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'payPalApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    reponseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Event Names or IDs',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: [],
                    description: 'The event to listen to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                    typeOptions: {
                        loadOptionsMethod: 'getEvents',
                    },
                    options: [],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the events types to display them to user so that he can
                // select them easily
                getEvents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [
                            {
                                name: '*',
                                value: '*',
                                description: 'Any time any event is triggered (Wildcard Event)',
                            },
                        ];
                        let events;
                        try {
                            const endpoint = '/notifications/webhooks-event-types';
                            events = yield GenericFunctions_1.payPalApiRequest.call(this, endpoint, 'GET');
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                        for (const event of events.event_types) {
                            const eventName = (0, GenericFunctions_1.upperFist)(event.name);
                            const eventId = event.name;
                            const eventDescription = event.description;
                            returnData.push({
                                name: eventName,
                                value: eventId,
                                description: eventDescription,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId === undefined) {
                            // No webhook id is set so no webhook can exist
                            return false;
                        }
                        const endpoint = `/notifications/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.payPalApiRequest.call(this, endpoint, 'GET');
                        }
                        catch (error) {
                            if (error.response && error.response.name === 'INVALID_RESOURCE_ID') {
                                // Webhook does not exist
                                delete webhookData.webhookId;
                                return false;
                            }
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let webhook;
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const events = this.getNodeParameter('events', []);
                        const body = {
                            url: webhookUrl,
                            event_types: events.map(event => {
                                return { name: event };
                            }),
                        };
                        const endpoint = '/notifications/webhooks';
                        try {
                            webhook = yield GenericFunctions_1.payPalApiRequest.call(this, endpoint, 'POST', body);
                        }
                        catch (error) {
                            throw error;
                        }
                        if (webhook.id === undefined) {
                            return false;
                        }
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = webhook.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/notifications/webhooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.payPalApiRequest.call(this, endpoint, 'DELETE', {});
                            }
                            catch (error) {
                                return false;
                            }
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
            let webhook;
            const webhookData = this.getWorkflowStaticData('node');
            const bodyData = this.getBodyData();
            const req = this.getRequestObject();
            const headerData = this.getHeaderData();
            const endpoint = '/notifications/verify-webhook-signature';
            if (headerData['PAYPAL-AUTH-ALGO'] !== undefined
                && headerData['PAYPAL-CERT-URL'] !== undefined
                && headerData['PAYPAL-TRANSMISSION-ID'] !== undefined
                && headerData['PAYPAL-TRANSMISSION-SIG'] !== undefined
                && headerData['PAYPAL-TRANSMISSION-TIME'] !== undefined) {
                const body = {
                    auth_algo: headerData['PAYPAL-AUTH-ALGO'],
                    cert_url: headerData['PAYPAL-CERT-URL'],
                    transmission_id: headerData['PAYPAL-TRANSMISSION-ID'],
                    transmission_sig: headerData['PAYPAL-TRANSMISSION-SIG'],
                    transmission_time: headerData['PAYPAL-TRANSMISSION-TIME'],
                    webhook_id: webhookData.webhookId,
                    webhook_event: bodyData,
                };
                try {
                    webhook = yield GenericFunctions_1.payPalApiRequest.call(this, endpoint, 'POST', body);
                }
                catch (error) {
                    throw error;
                }
                if (webhook.verification_status !== 'SUCCESS') {
                    return {};
                }
            }
            else {
                return {};
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.PayPalTrigger = PayPalTrigger;
