"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftGraphSecurityOAuth2Api = void 0;
class MicrosoftGraphSecurityOAuth2Api {
    constructor() {
        this.name = 'microsoftGraphSecurityOAuth2Api';
        this.displayName = 'Microsoft Graph Security OAuth2 API';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.documentationUrl = 'microsoft';
        this.properties = [
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'SecurityEvents.ReadWrite.All',
            },
        ];
    }
}
exports.MicrosoftGraphSecurityOAuth2Api = MicrosoftGraphSecurityOAuth2Api;
