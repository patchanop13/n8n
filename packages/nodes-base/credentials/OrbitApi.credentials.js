"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitApi = void 0;
class OrbitApi {
    constructor() {
        this.name = 'orbitApi';
        this.displayName = 'Orbit API';
        this.documentationUrl = 'orbit';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.OrbitApi = OrbitApi;
