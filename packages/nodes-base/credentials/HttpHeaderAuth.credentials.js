"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeaderAuth = void 0;
class HttpHeaderAuth {
    constructor() {
        this.name = 'httpHeaderAuth';
        this.displayName = 'Header Auth';
        this.documentationUrl = 'httpRequest';
        this.genericAuth = true;
        this.icon = 'node:n8n-nodes-base.httpRequest';
        this.properties = [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    '={{$credentials.name}}': '={{$credentials.value}}',
                },
            },
        };
    }
}
exports.HttpHeaderAuth = HttpHeaderAuth;
