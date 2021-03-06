"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneSimpleApi = void 0;
class OneSimpleApi {
    constructor() {
        this.name = 'oneSimpleApi';
        this.displayName = 'One Simple API';
        this.documentationUrl = 'oneSimpleApi';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.OneSimpleApi = OneSimpleApi;
