"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnleashedSoftwareApi = void 0;
class UnleashedSoftwareApi {
    constructor() {
        this.name = 'unleashedSoftwareApi';
        this.displayName = 'Unleashed API';
        this.documentationUrl = 'unleashedSoftware';
        this.properties = [
            {
                displayName: 'API ID',
                name: 'apiId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
            },
        ];
    }
}
exports.UnleashedSoftwareApi = UnleashedSoftwareApi;
