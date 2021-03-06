"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWeatherMapApi = void 0;
class OpenWeatherMapApi {
    constructor() {
        this.name = 'openWeatherMapApi';
        this.displayName = 'OpenWeatherMap API';
        this.documentationUrl = 'openWeatherMap';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.OpenWeatherMapApi = OpenWeatherMapApi;
