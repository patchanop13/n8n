"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaApi = void 0;
class AsanaApi {
    constructor() {
        this.name = 'asanaApi';
        this.displayName = 'Asana API';
        this.documentationUrl = 'asana';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
    }
}
exports.AsanaApi = AsanaApi;
