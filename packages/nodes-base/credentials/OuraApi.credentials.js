"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OuraApi = void 0;
class OuraApi {
    constructor() {
        this.name = 'ouraApi';
        this.displayName = 'Oura API';
        this.documentationUrl = 'oura';
        this.properties = [
            {
                displayName: 'Personal Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.OuraApi = OuraApi;
