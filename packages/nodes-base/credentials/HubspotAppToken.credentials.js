"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotAppToken = void 0;
class HubspotAppToken {
    constructor() {
        this.name = 'hubspotAppToken';
        this.displayName = 'HubSpot App Token';
        this.documentationUrl = 'hubspot';
        this.properties = [
            {
                displayName: 'APP Token',
                name: 'appToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.HubspotAppToken = HubspotAppToken;
