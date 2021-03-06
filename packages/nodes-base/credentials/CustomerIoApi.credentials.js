"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerIoApi = void 0;
class CustomerIoApi {
    constructor() {
        this.name = 'customerIoApi';
        this.displayName = 'Customer.io API';
        this.documentationUrl = 'customerIo';
        this.properties = [
            {
                displayName: 'Tracking API Key',
                name: 'trackingApiKey',
                type: 'string',
                default: '',
                description: 'Required for tracking API',
                required: true,
            },
            {
                displayName: 'Tracking Site ID',
                name: 'trackingSiteId',
                type: 'string',
                default: '',
                description: 'Required for tracking API',
            },
            {
                displayName: 'App API Key',
                name: 'appApiKey',
                type: 'string',
                default: '',
                description: 'Required for App API',
            },
        ];
    }
}
exports.CustomerIoApi = CustomerIoApi;
