"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WiseApi = void 0;
class WiseApi {
    constructor() {
        this.name = 'wiseApi';
        this.displayName = 'Wise API';
        this.documentationUrl = 'wise';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'live',
                options: [
                    {
                        name: 'Live',
                        value: 'live',
                    },
                    {
                        name: 'Test',
                        value: 'test',
                    },
                ],
            },
            {
                displayName: 'Private Key (Optional)',
                name: 'privateKey',
                type: 'string',
                default: '',
                description: 'Optional private key used for Strong Customer Authentication (SCA). Only needed to retrieve statements, and execute transfers.',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
        ];
    }
}
exports.WiseApi = WiseApi;
