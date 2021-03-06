"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeroApi = void 0;
class VeroApi {
    constructor() {
        this.name = 'veroApi';
        this.displayName = 'Vero API';
        this.documentationUrl = 'vero';
        this.properties = [
            {
                displayName: 'Auth Token',
                name: 'authToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.VeroApi = VeroApi;
