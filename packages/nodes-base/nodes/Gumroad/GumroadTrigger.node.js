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
exports.GumroadTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class GumroadTrigger {
    constructor() {
        // eslint-disable-next-line n8n-nodes-base/node-class-description-missing-subtitle
        this.description = {
            displayName: 'Gumroad Trigger',
            name: 'gumroadTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:gumroad.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle Gumroad events via webhooks',
            defaults: {
                name: 'Gumroad Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'gumroadApi',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Cancellation',
                            value: 'cancellation',
                            description: 'When subscribed to this resource, you will be notified of cancellations of the user\'s subscribers',
                        },
                        {
                            name: 'Dispute',
                            value: 'dispute',
                            description: 'When subscribed to this resource, you will be notified of the disputes raised against user\'s sales',
                        },
                        {
                            name: 'Dispute Won',
                            value: 'dispute_won',
                            description: 'When subscribed to this resource, you will be notified of the sale disputes won',
                        },
                        {
                            name: 'Refund',
                            value: 'refund',
                            description: 'When subscribed to this resource, you will be notified of refunds to the user\'s sales',
                        },
                        {
                            name: 'Sale',
                            value: 'sale',
                            description: 'When subscribed to this resource, you will be notified of the user\'s sales',
                        },
                    ],
                    description: 'The resource is gonna fire the event',
                },
            ],
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
                        const endpoint = '/resource_subscriptions';
                        const { resource_subscriptions } = yield GenericFunctions_1.gumroadApiRequest.call(this, 'GET', endpoint);
                        if (Array.isArray(resource_subscriptions)) {
                            for (const resource of resource_subscriptions) {
                                if (resource.id === webhookData.webhookId) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const resource = this.getNodeParameter('resource');
                        const endpoint = '/resource_subscriptions';
                        const body = {
                            post_url: webhookUrl,
                            resource_name: resource,
                        };
                        const { resource_subscription } = yield GenericFunctions_1.gumroadApiRequest.call(this, 'PUT', endpoint, body);
                        webhookData.webhookId = resource_subscription.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let responseData;
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/resource_subscriptions/${webhookData.webhookId}`;
                        try {
                            responseData = yield GenericFunctions_1.gumroadApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        if (!responseData.success) {
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
exports.GumroadTrigger = GumroadTrigger;
