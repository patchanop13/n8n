"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitWellApi = void 0;
class ProfitWellApi {
    constructor() {
        this.name = 'profitWellApi';
        this.displayName = 'ProfitWell API';
        this.documentationUrl = 'profitWell';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Your Private Token',
            },
        ];
    }
}
exports.ProfitWellApi = ProfitWellApi;
