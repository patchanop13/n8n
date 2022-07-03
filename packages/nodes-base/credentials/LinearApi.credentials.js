"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearApi = void 0;
class LinearApi {
    constructor() {
        this.name = 'linearApi';
        this.displayName = 'Linear API';
        this.documentationUrl = 'linear';
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
exports.LinearApi = LinearApi;
