"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormstackApi = void 0;
class FormstackApi {
    constructor() {
        this.name = 'formstackApi';
        this.displayName = 'Formstack API';
        this.documentationUrl = 'formstackTrigger';
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
exports.FormstackApi = FormstackApi;
