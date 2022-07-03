"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoistApi = void 0;
class TodoistApi {
    constructor() {
        this.name = 'todoistApi';
        this.displayName = 'Todoist API';
        this.documentationUrl = 'todoist';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.todoist.com/rest/v1',
                url: '/labels',
            },
        };
    }
}
exports.TodoistApi = TodoistApi;
