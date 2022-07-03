"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkableApi = void 0;
class WorkableApi {
    constructor() {
        this.name = 'workableApi';
        this.displayName = 'Workable API';
        this.documentationUrl = 'workable';
        this.properties = [
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                default: '',
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
exports.WorkableApi = WorkableApi;
