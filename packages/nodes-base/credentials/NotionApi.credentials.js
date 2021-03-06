"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionApi = void 0;
class NotionApi {
    constructor() {
        this.name = 'notionApi';
        this.displayName = 'Notion API';
        this.documentationUrl = 'notion';
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
exports.NotionApi = NotionApi;
