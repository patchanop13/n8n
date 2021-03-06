"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TogglApi = void 0;
class TogglApi {
    constructor() {
        this.name = 'togglApi';
        this.displayName = 'Toggl API';
        this.documentationUrl = 'toggl';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.TogglApi = TogglApi;
