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
exports.MailjetTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class MailjetTrigger {
    constructor() {
        this.description = {
            displayName: 'Mailjet Trigger',
            name: 'mailjetTrigger',
            icon: 'file:mailjet.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Mailjet events via webhooks',
            defaults: {
                name: 'Mailjet Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailjetEmailApi',
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
                    default: 'open',
                    options: [
                        {
                            name: 'email.blocked',
                            value: 'blocked',
                        },
                        {
                            name: 'email.bounce',
                            value: 'bounce',
                        },
                        {
                            name: 'email.open',
                            value: 'open',
                        },
                        {
                            name: 'email.sent',
                            value: 'sent',
                        },
                        {
                            name: 'email.spam',
                            value: 'spam',
                        },
                        {
                            name: 'email.unsub',
                            value: 'unsub',
                        },
                    ],
                    description: 'Determines which resource events the webhook is triggered for',
                },
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const endpoint = `/v3/rest/eventcallbackurl`;
                        const responseData = yield GenericFunctions_1.mailjetApiRequest.call(this, 'GET', endpoint);
                        const event = this.getNodeParameter('event');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        for (const webhook of responseData.Data) {
                            if (webhook.EventType === event && webhook.Url === webhookUrl) {
                                // Set webhook-id to be sure that it can be deleted
                                const webhookData = this.getWorkflowStaticData('node');
                                webhookData.webhookId = webhook.ID;
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
                        const event = this.getNodeParameter('event');
                        const endpoint = '/v3/rest/eventcallbackurl';
                        const body = {
                            Url: webhookUrl,
                            EventType: event,
                            Status: 'alive',
                            isBackup: 'false',
                        };
                        const { Data } = yield GenericFunctions_1.mailjetApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = Data[0].ID;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/v3/rest/eventcallbackurl/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.mailjetApiRequest.call(this, 'DELETE', endpoint);
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
    //@ts-ignore
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
exports.MailjetTrigger = MailjetTrigger;
