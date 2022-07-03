"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NocoDb = void 0;
class NocoDb {
    constructor() {
        this.name = 'nocoDb';
        this.displayName = 'NocoDB';
        this.documentationUrl = 'nocoDb';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
                placeholder: 'http(s)://localhost:8080',
            },
        ];
    }
}
exports.NocoDb = NocoDb;
