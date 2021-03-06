"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerbearApi = void 0;
class BannerbearApi {
    constructor() {
        this.name = 'bannerbearApi';
        this.displayName = 'Bannerbear API';
        this.documentationUrl = 'bannerbear';
        this.properties = [
            {
                displayName: 'Project API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.BannerbearApi = BannerbearApi;
