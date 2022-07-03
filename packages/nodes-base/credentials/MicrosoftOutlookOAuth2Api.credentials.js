"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOutlookOAuth2Api = void 0;
class MicrosoftOutlookOAuth2Api {
    constructor() {
        this.name = 'microsoftOutlookOAuth2Api';
        this.extends = [
            'microsoftOAuth2Api',
        ];
        this.displayName = 'Microsoft Outlook OAuth2 API';
        this.documentationUrl = 'microsoft';
        this.properties = [
            //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'openid offline_access Mail.ReadWrite Mail.ReadWrite.Shared Mail.Send Mail.Send.Shared MailboxSettings.Read',
            },
            {
                displayName: 'Use Shared Mailbox',
                name: 'useShared',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'User Principal Name',
                name: 'userPrincipalName',
                description: 'Target user\'s UPN or ID',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        useShared: [
                            true,
                        ],
                    },
                },
            },
        ];
    }
}
exports.MicrosoftOutlookOAuth2Api = MicrosoftOutlookOAuth2Api;
