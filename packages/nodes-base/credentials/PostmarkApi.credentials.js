"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostmarkApi = void 0;
class PostmarkApi {
    constructor() {
        this.name = 'postmarkApi';
        this.displayName = 'Postmark API';
        this.documentationUrl = 'postmark';
        this.properties = [
            {
                displayName: 'Server API Token',
                name: 'serverToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.PostmarkApi = PostmarkApi;
