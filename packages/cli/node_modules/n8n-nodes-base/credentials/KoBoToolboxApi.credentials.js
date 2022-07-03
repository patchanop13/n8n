"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoBoToolboxApi = void 0;
class KoBoToolboxApi {
    constructor() {
        this.name = 'koBoToolboxApi';
        this.displayName = 'KoBoToolbox API Token';
        // See https://support.kobotoolbox.org/api.html
        this.documentationUrl = 'koBoToolbox';
        this.properties = [
            {
                displayName: 'API Root URL',
                name: 'URL',
                type: 'string',
                default: 'https://kf.kobotoolbox.org/',
            },
            {
                displayName: 'API Token',
                name: 'token',
                type: 'string',
                default: '',
                hint: 'You can get your API token at https://[api-root]/token/?format=json (for a logged in user)',
            },
        ];
    }
}
exports.KoBoToolboxApi = KoBoToolboxApi;
