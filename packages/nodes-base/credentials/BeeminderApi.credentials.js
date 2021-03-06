"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeeminderApi = void 0;
class BeeminderApi {
    constructor() {
        this.name = 'beeminderApi';
        this.displayName = 'Beeminder API';
        this.documentationUrl = 'beeminder';
        this.properties = [
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Auth Token',
                name: 'authToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.BeeminderApi = BeeminderApi;
