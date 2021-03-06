"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBirdApi = void 0;
class MessageBirdApi {
    constructor() {
        this.name = 'messageBirdApi';
        this.displayName = 'MessageBird API';
        this.documentationUrl = 'messageBird';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'accessKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MessageBirdApi = MessageBirdApi;
