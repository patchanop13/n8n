"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagerDutyApi = void 0;
class PagerDutyApi {
    constructor() {
        this.name = 'pagerDutyApi';
        this.displayName = 'PagerDuty API';
        this.documentationUrl = 'pagerDuty';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.PagerDutyApi = PagerDutyApi;
