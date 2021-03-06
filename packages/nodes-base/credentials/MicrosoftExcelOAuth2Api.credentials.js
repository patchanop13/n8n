"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftExcelOAuth2Api = void 0;
class MicrosoftExcelOAuth2Api {
    constructor() {
        this.name = 'microsoftExcelOAuth2Api';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.displayName = 'Microsoft Excel OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'openid offline_access Files.ReadWrite',
            },
        ];
    }
}
exports.MicrosoftExcelOAuth2Api = MicrosoftExcelOAuth2Api;
