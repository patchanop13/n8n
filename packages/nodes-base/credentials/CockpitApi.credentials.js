"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CockpitApi = void 0;
class CockpitApi {
    constructor() {
        this.name = 'cockpitApi';
        this.displayName = 'Cockpit API';
        this.documentationUrl = 'cockpit';
        this.properties = [
            {
                displayName: 'Cockpit URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://example.com',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.CockpitApi = CockpitApi;
