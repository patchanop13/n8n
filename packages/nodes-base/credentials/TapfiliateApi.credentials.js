"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapfiliateApi = void 0;
class TapfiliateApi {
    constructor() {
        this.name = 'tapfiliateApi';
        this.displayName = 'Tapfiliate API';
        this.documentationUrl = 'tapfiliate';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                required: true,
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.TapfiliateApi = TapfiliateApi;
