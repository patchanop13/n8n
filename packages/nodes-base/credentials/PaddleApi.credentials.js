"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaddleApi = void 0;
class PaddleApi {
    constructor() {
        this.name = 'paddleApi';
        this.displayName = 'Paddle API';
        this.documentationUrl = 'paddle';
        this.properties = [
            {
                displayName: 'Vendor Auth Code',
                name: 'vendorAuthCode',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Vendor ID',
                name: 'vendorId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Use Sandbox Environment API',
                name: 'sandbox',
                type: 'boolean',
                default: false,
            },
        ];
    }
}
exports.PaddleApi = PaddleApi;
