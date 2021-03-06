"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeAssistantApi = void 0;
class HomeAssistantApi {
    constructor() {
        this.name = 'homeAssistantApi';
        this.displayName = 'Home Assistant API';
        this.documentationUrl = 'homeAssistant';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 8123,
            },
            {
                displayName: 'SSL',
                name: 'ssl',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.HomeAssistantApi = HomeAssistantApi;
