"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookGraphAppApi = void 0;
class FacebookGraphAppApi {
    constructor() {
        this.name = 'facebookGraphAppApi';
        this.displayName = 'Facebook Graph API (App)';
        this.documentationUrl = 'facebookGraphApp';
        this.extends = [
            'facebookGraphApi',
        ];
        this.properties = [
            {
                displayName: 'App Secret',
                name: 'appSecret',
                type: 'string',
                default: '',
                description: '(Optional) When the app secret is set the node will verify this signature to validate the integrity and origin of the payload',
            },
        ];
    }
}
exports.FacebookGraphAppApi = FacebookGraphAppApi;
