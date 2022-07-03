"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeApi = void 0;
class StripeApi {
    constructor() {
        this.name = 'stripeApi';
        this.displayName = 'Stripe API';
        this.documentationUrl = 'stripe';
        this.properties = [
            // The credentials to get from user and save encrypted.
            // Properties can be defined exactly in the same way
            // as node properties.
            {
                displayName: 'Secret Key',
                name: 'secretKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.StripeApi = StripeApi;
