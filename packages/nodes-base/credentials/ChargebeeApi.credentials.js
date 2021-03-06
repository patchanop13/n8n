"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargebeeApi = void 0;
class ChargebeeApi {
    constructor() {
        this.name = 'chargebeeApi';
        this.displayName = 'Chargebee API';
        this.documentationUrl = 'chargebee';
        this.properties = [
            {
                displayName: 'Account Name',
                name: 'accountName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Api Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ChargebeeApi = ChargebeeApi;
