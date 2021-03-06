"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyMonkeyApi = void 0;
class SurveyMonkeyApi {
    constructor() {
        this.name = 'surveyMonkeyApi';
        this.displayName = 'SurveyMonkey API';
        this.documentationUrl = 'surveyMonkey';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: `The access token must have the following scopes:
			<ul>
				<li>Create/modify webhooks</li>
				<li>View webhooks</li>
				<li>View surveys</li>
				<li>View collectors</li>
				<li>View responses</li>
				<li>View response details</li>
			</ul>`,
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SurveyMonkeyApi = SurveyMonkeyApi;
