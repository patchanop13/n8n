"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesforceJwtApi = void 0;
class SalesforceJwtApi {
    constructor() {
        this.name = 'salesforceJwtApi';
        this.displayName = 'Salesforce JWT API';
        this.documentationUrl = 'salesforce';
        this.properties = [
            {
                displayName: 'Environment Type',
                name: 'environment',
                type: 'options',
                options: [
                    {
                        name: 'Production',
                        value: 'production',
                    },
                    {
                        name: 'Sandbox',
                        value: 'sandbox',
                    },
                ],
                default: 'production',
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
                description: 'Consumer Key from Salesforce Connected App',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Private Key',
                name: 'privateKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Use the multiline editor. Make sure it is in standard PEM key format:<br />-----BEGIN PRIVATE KEY-----<br />KEY DATA GOES HERE<br />-----END PRIVATE KEY-----',
            },
        ];
    }
}
exports.SalesforceJwtApi = SalesforceJwtApi;
