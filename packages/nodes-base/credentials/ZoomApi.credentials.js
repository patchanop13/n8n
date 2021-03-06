"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomApi = void 0;
class ZoomApi {
    constructor() {
        this.name = 'zoomApi';
        this.displayName = 'Zoom API';
        this.documentationUrl = 'zoom';
        this.properties = [
            {
                displayName: 'JWT Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ZoomApi = ZoomApi;
