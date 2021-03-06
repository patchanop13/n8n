"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriftApi = void 0;
class DriftApi {
    constructor() {
        this.name = 'driftApi';
        this.displayName = 'Drift API';
        this.documentationUrl = 'drift';
        this.properties = [
            {
                displayName: 'Personal Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Visit your account details page, and grab the Access Token. See <a href="https://devdocs.drift.com/docs/quick-start">Drift auth</a>.',
            },
        ];
    }
}
exports.DriftApi = DriftApi;
