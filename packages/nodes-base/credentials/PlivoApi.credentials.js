"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlivoApi = void 0;
class PlivoApi {
    constructor() {
        this.name = 'plivoApi';
        this.displayName = 'Plivo API';
        this.documentationUrl = 'plivo';
        this.properties = [
            {
                displayName: 'Auth ID',
                name: 'authId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Auth Token',
                name: 'authToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.PlivoApi = PlivoApi;
