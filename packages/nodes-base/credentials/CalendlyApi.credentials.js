"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendlyApi = void 0;
class CalendlyApi {
    constructor() {
        this.name = 'calendlyApi';
        this.displayName = 'Calendly API';
        this.documentationUrl = 'calendly';
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
exports.CalendlyApi = CalendlyApi;
