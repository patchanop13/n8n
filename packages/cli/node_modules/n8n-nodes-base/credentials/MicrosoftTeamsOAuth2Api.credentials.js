"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftTeamsOAuth2Api = void 0;
class MicrosoftTeamsOAuth2Api {
    constructor() {
        this.name = 'microsoftTeamsOAuth2Api';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.displayName = 'Microsoft Teams OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'openid offline_access User.ReadWrite.All Group.ReadWrite.All Chat.ReadWrite',
            },
        ];
    }
}
exports.MicrosoftTeamsOAuth2Api = MicrosoftTeamsOAuth2Api;
