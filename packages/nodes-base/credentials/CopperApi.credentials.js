"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopperApi = void 0;
class CopperApi {
    constructor() {
        this.name = 'copperApi';
        this.displayName = 'Copper API';
        this.documentationUrl = 'copper';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'Email',
                name: 'email',
                required: true,
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
        ];
    }
}
exports.CopperApi = CopperApi;
