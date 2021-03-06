"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowApi = void 0;
class WebflowApi {
    constructor() {
        this.name = 'webflowApi';
        this.displayName = 'Webflow API';
        this.documentationUrl = 'webflow';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.WebflowApi = WebflowApi;
