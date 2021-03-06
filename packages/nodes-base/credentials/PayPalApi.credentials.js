"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalApi = void 0;
class PayPalApi {
    constructor() {
        this.name = 'payPalApi';
        this.displayName = 'PayPal API';
        this.documentationUrl = 'payPal';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Secret',
                name: 'secret',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Environment',
                name: 'env',
                type: 'options',
                default: 'live',
                options: [
                    {
                        name: 'Sandbox',
                        value: 'sanbox',
                    },
                    {
                        name: 'Live',
                        value: 'live',
                    },
                ],
            },
        ];
    }
}
exports.PayPalApi = PayPalApi;
