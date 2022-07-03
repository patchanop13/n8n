"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftToDoOAuth2Api = void 0;
class MicrosoftToDoOAuth2Api {
    constructor() {
        this.name = 'microsoftToDoOAuth2Api';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.displayName = 'Microsoft To Do OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'openid offline_access Tasks.ReadWrite',
            },
        ];
    }
}
exports.MicrosoftToDoOAuth2Api = MicrosoftToDoOAuth2Api;
