"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTemplateIoApi = void 0;
class ApiTemplateIoApi {
    constructor() {
        this.name = 'apiTemplateIoApi';
        this.displayName = 'APITemplate.io API';
        this.documentationUrl = 'apiTemplateIo';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ApiTemplateIoApi = ApiTemplateIoApi;
