"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepLApi = void 0;
class DeepLApi {
    constructor() {
        this.name = 'deepLApi';
        this.displayName = 'DeepL API';
        this.documentationUrl = 'deepL';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Plan',
                name: 'apiPlan',
                type: 'options',
                options: [
                    {
                        name: 'Pro Plan',
                        value: 'pro',
                    },
                    {
                        name: 'Free Plan',
                        value: 'free',
                    },
                ],
                default: 'pro',
            },
        ];
    }
}
exports.DeepLApi = DeepLApi;
