"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOneDriveOAuth2Api = void 0;
class MicrosoftOneDriveOAuth2Api {
    constructor() {
        this.name = 'microsoftOneDriveOAuth2Api';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.displayName = 'Microsoft Drive OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'openid offline_access Files.ReadWrite.All',
            },
        ];
    }
}
exports.MicrosoftOneDriveOAuth2Api = MicrosoftOneDriveOAuth2Api;
