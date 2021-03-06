"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBaseApi = void 0;
class QuickBaseApi {
    constructor() {
        this.name = 'quickbaseApi';
        this.displayName = 'Quick Base API';
        this.documentationUrl = 'quickbase';
        this.properties = [
            {
                displayName: 'Hostname',
                name: 'hostname',
                type: 'string',
                default: '',
                required: true,
                placeholder: 'demo.quickbase.com',
            },
            {
                displayName: 'User Token',
                name: 'userToken',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.QuickBaseApi = QuickBaseApi;
