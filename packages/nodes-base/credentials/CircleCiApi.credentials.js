"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleCiApi = void 0;
class CircleCiApi {
    constructor() {
        this.name = 'circleCiApi';
        this.displayName = 'CircleCI API';
        this.documentationUrl = 'circleCi';
        this.properties = [
            {
                displayName: 'Personal API Token',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.CircleCiApi = CircleCiApi;
