"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushcutApi = void 0;
class PushcutApi {
    constructor() {
        this.name = 'pushcutApi';
        this.displayName = 'Pushcut API';
        this.documentationUrl = 'pushcut';
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
exports.PushcutApi = PushcutApi;
