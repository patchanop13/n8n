"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyApi = void 0;
class ShopifyApi {
    constructor() {
        this.name = 'shopifyApi';
        this.displayName = 'Shopify API';
        this.documentationUrl = 'shopify';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'Shop Subdomain',
                name: 'shopSubdomain',
                required: true,
                type: 'string',
                default: '',
                description: 'Only the subdomain without .myshopify.com',
            },
            {
                displayName: 'Shared Secret',
                name: 'sharedSecret',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ShopifyApi = ShopifyApi;
