"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketApi = void 0;
class BitbucketApi {
    constructor() {
        this.name = 'bitbucketApi';
        this.displayName = 'Bitbucket API';
        this.documentationUrl = 'bitbucket';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'App Password',
                name: 'appPassword',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.BitbucketApi = BitbucketApi;
