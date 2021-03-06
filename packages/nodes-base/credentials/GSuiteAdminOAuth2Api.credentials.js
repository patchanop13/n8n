"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSuiteAdminOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.directory.domain.readonly',
    'https://www.googleapis.com/auth/admin.directory.userschema.readonly',
];
class GSuiteAdminOAuth2Api {
    constructor() {
        this.name = 'gSuiteAdminOAuth2Api';
        this.extends = [
            'googleOAuth2Api',
        ];
        this.displayName = 'G Suite Admin OAuth2 API';
        this.documentationUrl = 'google';
        this.properties = [
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: scopes.join(' '),
            },
        ];
    }
}
exports.GSuiteAdminOAuth2Api = GSuiteAdminOAuth2Api;
