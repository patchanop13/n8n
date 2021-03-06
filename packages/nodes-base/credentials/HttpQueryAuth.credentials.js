"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpQueryAuth = void 0;
class HttpQueryAuth {
    constructor() {
        this.name = 'httpQueryAuth';
        this.displayName = 'Query Auth';
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
    }
}
exports.HttpQueryAuth = HttpQueryAuth;
