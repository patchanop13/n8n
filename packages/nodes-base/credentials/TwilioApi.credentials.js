"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioApi = void 0;
class TwilioApi {
    constructor() {
        this.name = 'twilioApi';
        this.displayName = 'Twilio API';
        this.documentationUrl = 'twilio';
        this.properties = [
            {
                displayName: 'Auth Type',
                name: 'authType',
                type: 'options',
                default: 'authToken',
                options: [
                    {
                        name: 'Auth Token',
                        value: 'authToken',
                    },
                    {
                        name: 'API Key',
                        value: 'apiKey',
                    },
                ],
            },
            {
                displayName: 'Account SID',
                name: 'accountSid',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Auth Token',
                name: 'authToken',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        authType: [
                            'authToken',
                        ],
                    },
                },
            },
            {
                displayName: 'API Key SID',
                name: 'apiKeySid',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        authType: [
                            'apiKey',
                        ],
                    },
                },
            },
            {
                displayName: 'API Key Secret',
                name: 'apiKeySecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                displayOptions: {
                    show: {
                        authType: [
                            'apiKey',
                        ],
                    },
                },
            },
        ];
    }
}
exports.TwilioApi = TwilioApi;
