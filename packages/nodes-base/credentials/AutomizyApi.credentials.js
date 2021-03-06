"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomizyApi = void 0;
class AutomizyApi {
    constructor() {
        this.name = 'automizyApi';
        this.displayName = 'Automizy API';
        this.documentationUrl = 'automizy';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.AutomizyApi = AutomizyApi;
