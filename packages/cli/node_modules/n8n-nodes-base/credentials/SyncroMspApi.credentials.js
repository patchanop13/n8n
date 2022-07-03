"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncroMspApi = void 0;
class SyncroMspApi {
    constructor() {
        this.name = 'syncroMspApi';
        this.displayName = 'SyncroMSP API';
        this.documentationUrl = 'syncromsp';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SyncroMspApi = SyncroMspApi;
