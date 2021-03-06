"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumApi = void 0;
class MediumApi {
    constructor() {
        this.name = 'mediumApi';
        this.displayName = 'Medium API';
        this.documentationUrl = 'medium';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MediumApi = MediumApi;
