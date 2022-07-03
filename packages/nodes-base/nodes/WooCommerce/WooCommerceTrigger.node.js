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
exports.WooCommerceTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class WooCommerceTrigger {
    constructor() {
        this.description = {
            displayName: 'WooCommerce Trigger',
            name: 'wooCommerceTrigger',
            icon: 'file:wooCommerce.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle WooCommerce events via webhooks',
            defaults: {
                name: 'WooCommerce Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wooCommerceApi',
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
                            name: 'coupon.created',
                            value: 'coupon.created',
                        },
                        {
                            name: 'coupon.deleted',
                            value: 'coupon.deleted',
                        },
                        {
                            name: 'coupon.updated',
                            value: 'coupon.updated',
                        },
                        {
                            name: 'customer.created',
                            value: 'customer.created',
                        },
                        {
                            name: 'customer.deleted',
                            value: 'customer.deleted',
                        },
                        {
                            name: 'customer.updated',
                            value: 'customer.updated',
                        },
                        {
                            name: 'order.created',
                            value: 'order.created',
                        },
                        {
                            name: 'order.deleted',
                            value: 'order.deleted',
                        },
                        {
                            name: 'order.updated',
                            value: 'order.updated',
                        },
                        {
                            name: 'product.created',
                            value: 'product.created',
                        },
                        {
                            name: 'product.deleted',
                            value: 'product.deleted',
                        },
                        {
                            name: 'product.updated',
                            value: 'product.updated',
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
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const currentEvent = this.getNodeParameter('event');
                        const endpoint = `/webhooks`;
                        const webhooks = yield GenericFunctions_1.woocommerceApiRequest.call(this, 'GET', endpoint, {}, { status: 'active', per_page: 100 });
                        for (const webhook of webhooks) {
                            if (webhook.status === 'active'
                                && webhook.delivery_url === webhookUrl
                                && webhook.topic === currentEvent) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('wooCommerceApi');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const event = this.getNodeParameter('event');
                        const secret = (0, GenericFunctions_1.getAutomaticSecret)(credentials);
                        const endpoint = '/webhooks';
                        const body = {
                            delivery_url: webhookUrl,
                            topic: event,
                            secret,
                        };
                        const { id } = yield GenericFunctions_1.woocommerceApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = id;
                        webhookData.secret = secret;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.woocommerceApiRequest.call(this, 'DELETE', endpoint, {}, { force: true });
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        delete webhookData.secret;
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
            const headerData = this.getHeaderData();
            const webhookData = this.getWorkflowStaticData('node');
            //@ts-ignore
            if (headerData['x-wc-webhook-id'] === undefined) {
                return {};
            }
            //@ts-ignore
            const computedSignature = (0, crypto_1.createHmac)('sha256', webhookData.secret).update(req.rawBody).digest('base64');
            //@ts-ignore
            if (headerData['x-wc-webhook-signature'] !== computedSignature) {
                // Signature is not valid so ignore call
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
exports.WooCommerceTrigger = WooCommerceTrigger;
