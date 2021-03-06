"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UProcApi = void 0;
class UProcApi {
    constructor() {
        this.name = 'uprocApi';
        this.displayName = 'uProc API';
        this.documentationUrl = 'uProc';
        this.properties = [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.UProcApi = UProcApi;
