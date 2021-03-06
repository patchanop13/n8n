"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisqusApi = void 0;
class DisqusApi {
    constructor() {
        this.name = 'disqusApi';
        this.displayName = 'Disqus API';
        this.documentationUrl = 'disqus';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Visit your account details page, and grab the Access Token. See <a href="https://disqus.com/api/docs/auth/">Disqus auth</a>.',
            },
        ];
    }
}
exports.DisqusApi = DisqusApi;
