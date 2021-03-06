"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sms77Api = void 0;
class Sms77Api {
    constructor() {
        this.name = 'sms77Api';
        this.displayName = 'Sms77 API';
        this.documentationUrl = 'sms77';
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
exports.Sms77Api = Sms77Api;
