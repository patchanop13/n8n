"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookGraphApi = void 0;
class FacebookGraphApi {
    constructor() {
        this.name = 'facebookGraphApi';
        this.displayName = 'Facebook Graph API';
        this.documentationUrl = 'facebookGraph';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.FacebookGraphApi = FacebookGraphApi;
