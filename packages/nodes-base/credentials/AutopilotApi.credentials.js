"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutopilotApi = void 0;
class AutopilotApi {
    constructor() {
        this.name = 'autopilotApi';
        this.displayName = 'Autopilot API';
        this.documentationUrl = 'autopilot';
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
exports.AutopilotApi = AutopilotApi;
