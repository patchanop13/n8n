"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnfleetApi = void 0;
class OnfleetApi {
    constructor() {
        this.name = 'onfleetApi';
        this.displayName = 'Onfleet API';
        this.documentationUrl = 'onfleet';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.OnfleetApi = OnfleetApi;
