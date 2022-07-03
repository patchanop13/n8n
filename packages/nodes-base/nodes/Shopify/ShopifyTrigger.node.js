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
exports.ShopifyTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class ShopifyTrigger {
    constructor() {
        this.description = {
            displayName: 'Shopify Trigger',
            name: 'shopifyTrigger',
            icon: 'file:shopify.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Handle Shopify events via webhooks',
            defaults: {
                name: 'Shopify Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'shopifyApi',
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
                    displayName: 'Topic',
                    name: 'topic',
                    type: 'options',
                    default: '',
                    options: [
                        {
                            name: 'App Uninstalled',
                            value: 'app/uninstalled',
                        },
                        {
                            name: 'Cart Created',
                            value: 'carts/create',
                        },
                        {
                            name: 'Cart Updated',
                            value: 'carts/update',
                        },
                        {
                            name: 'Checkout Created',
                            value: 'checkouts/create',
                        },
                        {
                            name: 'Checkout Delete',
                            value: 'checkouts/delete',
                        },
                        {
                            name: 'Checkout Update',
                            value: 'checkouts/update',
                        },
                        {
                            name: 'Collection Created',
                            value: 'collections/create',
                        },
                        {
                            name: 'Collection Deleted',
                            value: 'collections/delete',
                        },
                        {
                            name: 'Collection Listings Added',
                            value: 'collection_listings/add',
                        },
                        {
                            name: 'Collection Listings Removed',
                            value: 'collection_listings/remove',
                        },
                        {
                            name: 'Collection Listings Updated',
                            value: 'collection_listings/update',
                        },
                        {
                            name: 'Collection Updated',
                            value: 'collections/update',
                        },
                        {
                            name: 'Customer Created',
                            value: 'customers/create',
                        },
                        {
                            name: 'Customer Deleted',
                            value: 'customers/delete',
                        },
                        {
                            name: 'Customer Disabled',
                            value: 'customers/disable',
                        },
                        {
                            name: 'Customer Enabled',
                            value: 'customers/enable',
                        },
                        {
                            name: 'Customer Groups Created',
                            value: 'customer_groups/create',
                        },
                        {
                            name: 'Customer Groups Deleted',
                            value: 'customer_groups/delete',
                        },
                        {
                            name: 'Customer Groups Updated',
                            value: 'customer_groups/update',
                        },
                        {
                            name: 'Customer Updated',
                            value: 'customers/update',
                        },
                        {
                            name: 'Draft Orders Created',
                            value: 'draft_orders/create',
                        },
                        {
                            name: 'Draft Orders Deleted',
                            value: 'draft_orders/delete',
                        },
                        {
                            name: 'Draft Orders Updated',
                            value: 'draft_orders/update',
                        },
                        {
                            name: 'Fulfillment Created',
                            value: 'fulfillments/create',
                        },
                        {
                            name: 'Fulfillment Events Created',
                            value: 'fulfillment_events/create',
                        },
                        {
                            name: 'Fulfillment Events Deleted',
                            value: 'fulfillment_events/delete',
                        },
                        {
                            name: 'Fulfillment Updated',
                            value: 'fulfillments/update',
                        },
                        {
                            name: 'Inventory Items Created',
                            value: 'inventory_items/create',
                        },
                        {
                            name: 'Inventory Items Deleted',
                            value: 'inventory_items/delete',
                        },
                        {
                            name: 'Inventory Items Updated',
                            value: 'inventory_items/update',
                        },
                        {
                            name: 'Inventory Levels Connected',
                            value: 'inventory_levels/connect',
                        },
                        {
                            name: 'Inventory Levels Disconnected',
                            value: 'inventory_levels/disconnect',
                        },
                        {
                            name: 'Inventory Levels Updated',
                            value: 'inventory_levels/update',
                        },
                        {
                            name: 'Locale Created',
                            value: 'locales/create',
                        },
                        {
                            name: 'Locale Updated',
                            value: 'locales/update',
                        },
                        {
                            name: 'Location Created',
                            value: 'locations/create',
                        },
                        {
                            name: 'Location Deleted',
                            value: 'locations/delete',
                        },
                        {
                            name: 'Location Updated',
                            value: 'locations/update',
                        },
                        {
                            name: 'Order Cancelled',
                            value: 'orders/cancelled',
                        },
                        {
                            name: 'Order Created',
                            value: 'orders/create',
                        },
                        {
                            name: 'Order Fulfilled',
                            value: 'orders/fulfilled',
                        },
                        {
                            name: 'Order Paid',
                            value: 'orders/paid',
                        },
                        {
                            name: 'Order Partially Fulfilled',
                            value: 'orders/partially_fulfilled',
                        },
                        {
                            name: 'Order Transactions Created',
                            value: 'order_transactions/create',
                        },
                        {
                            name: 'Order Updated',
                            value: 'orders/updated',
                        },
                        {
                            name: 'Orders Deleted',
                            value: 'orders/delete',
                        },
                        {
                            name: 'Product Created',
                            value: 'products/create',
                        },
                        {
                            name: 'Product Deleted',
                            value: 'products/delete',
                        },
                        {
                            name: 'Product Listings Added',
                            value: 'product_listings/add',
                        },
                        {
                            name: 'Product Listings Removed',
                            value: 'product_listings/remove',
                        },
                        {
                            name: 'Product Listings Updated',
                            value: 'product_listings/update',
                        },
                        {
                            name: 'Product Updated',
                            value: 'products/update',
                        },
                        {
                            name: 'Refund Created',
                            value: 'refunds/create',
                        },
                        {
                            name: 'Shop Updated',
                            value: 'shop/update',
                        },
                        {
                            name: 'Tender Transactions Created',
                            value: 'tender_transactions/create',
                        },
                        {
                            name: 'Theme Created',
                            value: 'themes/create',
                        },
                        {
                            name: 'Theme Deleted',
                            value: 'themes/delete',
                        },
                        {
                            name: 'Theme Published',
                            value: 'themes/publish',
                        },
                        {
                            name: 'Theme Updated',
                            value: 'themes/update',
                        },
                    ],
                    description: 'Event that triggers the webhook',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const topic = this.getNodeParameter('topic');
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const endpoint = `/webhooks`;
                        const { webhooks } = yield GenericFunctions_1.shopifyApiRequest.call(this, 'GET', endpoint, {}, { topic });
                        for (const webhook of webhooks) {
                            if (webhook.address === webhookUrl) {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const topic = this.getNodeParameter('topic');
                        const webhookData = this.getWorkflowStaticData('node');
                        const endpoint = `/webhooks.json`;
                        const body = {
                            webhook: {
                                topic,
                                address: webhookUrl,
                                format: 'json',
                            },
                        };
                        let responseData;
                        responseData = yield GenericFunctions_1.shopifyApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.webhook === undefined || responseData.webhook.id === undefined) {
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
                            const endpoint = `/webhooks/${webhookData.webhookId}.json`;
                            try {
                                yield GenericFunctions_1.shopifyApiRequest.call(this, 'DELETE', endpoint, {});
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
            const headerData = this.getHeaderData();
            const req = this.getRequestObject();
            const credentials = yield this.getCredentials('shopifyApi');
            const topic = this.getNodeParameter('topic');
            if (headerData['x-shopify-topic'] !== undefined
                && headerData['x-shopify-hmac-sha256'] !== undefined
                && headerData['x-shopify-shop-domain'] !== undefined
                && headerData['x-shopify-api-version'] !== undefined) {
                // @ts-ignore
                const computedSignature = (0, crypto_1.createHmac)('sha256', credentials.sharedSecret).update(req.rawBody).digest('base64');
                if (headerData['x-shopify-hmac-sha256'] !== computedSignature) {
                    return {};
                }
                if (topic !== headerData['x-shopify-topic']) {
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
exports.ShopifyTrigger = ShopifyTrigger;
