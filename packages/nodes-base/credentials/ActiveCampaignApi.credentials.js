"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveCampaignApi = void 0;
class ActiveCampaignApi {
    constructor() {
        this.name = 'activeCampaignApi';
        this.displayName = 'ActiveCampaign API';
        this.documentationUrl = 'activeCampaign';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ActiveCampaignApi = ActiveCampaignApi;
