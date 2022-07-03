"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropcontactApi = void 0;
class DropcontactApi {
    constructor() {
        this.name = 'dropcontactApi';
        this.displayName = 'Dropcontact API';
        this.documentationUrl = 'dropcontact';
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
exports.DropcontactApi = DropcontactApi;
