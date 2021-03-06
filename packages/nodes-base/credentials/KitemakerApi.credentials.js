"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitemakerApi = void 0;
class KitemakerApi {
    constructor() {
        this.name = 'kitemakerApi';
        this.displayName = 'Kitemaker API';
        this.documentationUrl = 'kitemaker';
        this.properties = [
            {
                displayName: 'Personal Access Token',
                name: 'personalAccessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.KitemakerApi = KitemakerApi;
