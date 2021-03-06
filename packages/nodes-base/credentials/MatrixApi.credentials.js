"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixApi = void 0;
class MatrixApi {
    constructor() {
        this.name = 'matrixApi';
        this.displayName = 'Matrix API';
        this.documentationUrl = 'matrix';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Homeserver URL',
                name: 'homeserverUrl',
                type: 'string',
                default: 'https://matrix-client.matrix.org',
            },
        ];
    }
}
exports.MatrixApi = MatrixApi;
