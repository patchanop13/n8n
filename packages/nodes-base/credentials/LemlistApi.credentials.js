"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemlistApi = void 0;
class LemlistApi {
    constructor() {
        this.name = 'lemlistApi';
        this.displayName = 'Lemlist API';
        this.documentationUrl = 'lemlist';
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
exports.LemlistApi = LemlistApi;
