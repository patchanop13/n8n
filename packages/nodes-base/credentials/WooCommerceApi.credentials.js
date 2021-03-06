"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WooCommerceApi = void 0;
class WooCommerceApi {
    constructor() {
        this.name = 'wooCommerceApi';
        this.displayName = 'WooCommerce API';
        this.documentationUrl = 'wooCommerce';
        this.properties = [
            {
                displayName: 'Consumer Key',
                name: 'consumerKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Consumer Secret',
                name: 'consumerSecret',
                type: 'string',
                default: '',
            },
            {
                displayName: 'WooCommerce URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://example.com',
            },
            {
                displayName: 'Include Credentials in Query',
                name: 'includeCredentialsInQuery',
                type: 'boolean',
                default: false,
                description: 'Whether credentials should be included in the query. Occasionally, some servers may not parse the Authorization header correctly (if you see a “Consumer key is missing” error when authenticating over SSL, you have a server issue). In this case, you may provide the consumer key/secret as query string parameters instead.',
            },
        ];
    }
}
exports.WooCommerceApi = WooCommerceApi;
