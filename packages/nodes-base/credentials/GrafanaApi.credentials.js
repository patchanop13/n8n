"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrafanaApi = void 0;
class GrafanaApi {
    constructor() {
        this.name = 'grafanaApi';
        this.displayName = 'Grafana API';
        this.documentationUrl = 'grafana';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                description: 'Base URL of your Grafana instance',
                placeholder: 'e.g. https://n8n.grafana.net/',
                required: true,
            },
        ];
    }
}
exports.GrafanaApi = GrafanaApi;
