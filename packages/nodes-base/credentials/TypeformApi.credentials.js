"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeformApi = void 0;
class TypeformApi {
    constructor() {
        this.name = 'typeformApi';
        this.displayName = 'Typeform API';
        this.documentationUrl = 'typeform';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.TypeformApi = TypeformApi;
