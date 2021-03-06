"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowApi = void 0;
class FlowApi {
    constructor() {
        this.name = 'flowApi';
        this.displayName = 'Flow API';
        this.documentationUrl = 'flow';
        this.properties = [
            {
                displayName: 'Organization ID',
                name: 'organizationId',
                type: 'number',
                default: 0,
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
exports.FlowApi = FlowApi;
