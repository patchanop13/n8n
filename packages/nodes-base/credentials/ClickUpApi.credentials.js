"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickUpApi = void 0;
class ClickUpApi {
    constructor() {
        this.name = 'clickUpApi';
        this.displayName = 'ClickUp API';
        this.documentationUrl = 'clickUp';
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
exports.ClickUpApi = ClickUpApi;
