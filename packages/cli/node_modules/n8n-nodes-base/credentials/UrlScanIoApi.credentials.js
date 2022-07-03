"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlScanIoApi = void 0;
class UrlScanIoApi {
    constructor() {
        this.name = 'urlScanIoApi';
        this.displayName = 'urlscan.io API';
        this.documentationUrl = 'urlScanIo';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.UrlScanIoApi = UrlScanIoApi;
