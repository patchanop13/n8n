"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityScorecardApi = void 0;
class SecurityScorecardApi {
    constructor() {
        this.name = 'securityScorecardApi';
        this.displayName = 'SecurityScorecard API';
        this.documentationUrl = 'securityScorecard';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.SecurityScorecardApi = SecurityScorecardApi;
