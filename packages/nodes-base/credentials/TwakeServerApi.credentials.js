"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwakeServerApi = void 0;
class TwakeServerApi {
    constructor() {
        this.name = 'twakeServerApi';
        this.displayName = 'Twake Server API';
        this.documentationUrl = 'twake';
        this.properties = [
            {
                displayName: 'Host URL',
                name: 'hostUrl',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Public ID',
                name: 'publicId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Private API Key',
                name: 'privateApiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.TwakeServerApi = TwakeServerApi;
