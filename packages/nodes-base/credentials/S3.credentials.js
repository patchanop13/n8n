"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
class S3 {
    constructor() {
        this.name = 's3';
        this.displayName = 'S3';
        this.documentationUrl = 's3';
        this.properties = [
            {
                displayName: 'S3 Endpoint',
                name: 'endpoint',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Region',
                name: 'region',
                type: 'string',
                default: 'us-east-1',
            },
            {
                displayName: 'Access Key ID',
                name: 'accessKeyId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Secret Access Key',
                name: 'secretAccessKey',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
            },
            {
                displayName: 'Force Path Style',
                name: 'forcePathStyle',
                type: 'boolean',
                default: false,
            },
        ];
    }
}
exports.S3 = S3;
