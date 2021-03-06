"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffinityApi = void 0;
class AffinityApi {
    constructor() {
        this.name = 'affinityApi';
        this.displayName = 'Affinity API';
        this.documentationUrl = 'affinity';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.AffinityApi = AffinityApi;
