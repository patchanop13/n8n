"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantombusterApi = void 0;
class PhantombusterApi {
    constructor() {
        this.name = 'phantombusterApi';
        this.displayName = 'Phantombuster API';
        this.documentationUrl = 'phantombuster';
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
exports.PhantombusterApi = PhantombusterApi;
