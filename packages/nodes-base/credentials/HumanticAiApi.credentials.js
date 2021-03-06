"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanticAiApi = void 0;
class HumanticAiApi {
    constructor() {
        this.name = 'humanticAiApi';
        this.displayName = 'Humantic AI API';
        this.documentationUrl = 'humanticAi';
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
exports.HumanticAiApi = HumanticAiApi;
