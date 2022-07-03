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
exports.AutopilotTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class AutopilotTrigger {
    constructor() {
        this.description = {
            displayName: 'Autopilot Trigger',
            name: 'autopilotTrigger',
            icon: 'file:autopilot.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle Autopilot events via webhooks',
            defaults: {
                name: 'Autopilot Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'autopilotApi',
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
                        {
                            name: 'Contact Added',
                            value: 'contactAdded',
                        },
                        {
                            name: 'Contact Added To List',
                            value: 'contactAddedToList',
                        },
                        {
                            name: 'Contact Entered Segment',
                            value: 'contactEnteredSegment',
                        },
                        {
                            name: 'Contact Left Segment',
                            value: 'contactLeftSegment',
                        },
                        {
                            name: 'Contact Removed From List',
                            value: 'contactRemovedFromList',
                        },
                        {
                            name: 'Contact Unsubscribed',
                            value: 'contactUnsubscribed',
                        },
                        {
                            name: 'Contact Updated',
                            value: 'contactUpdated',
                        },
                    ],
                },
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const event = this.getNodeParameter('event');
                        const { hooks: webhooks } = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', '/hooks');
                        for (const webhook of webhooks) {
                            if (webhook.target_url === webhookUrl && webhook.event === (0, change_case_1.snakeCase)(event)) {
                                webhookData.webhookId = webhook.hook_id;
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
                        const body = {
                            event: (0, change_case_1.snakeCase)(event),
                            target_url: webhookUrl,
                        };
                        const webhook = yield GenericFunctions_1.autopilotApiRequest.call(this, 'POST', '/hook', body);
                        webhookData.webhookId = webhook.hook_id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.autopilotApiRequest.call(this, 'DELETE', `/hook/${webhookData.webhookId}`);
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
exports.AutopilotTrigger = AutopilotTrigger;
