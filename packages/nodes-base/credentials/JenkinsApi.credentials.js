"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JenkinsApi = void 0;
class JenkinsApi {
    constructor() {
        this.name = 'jenkinsApi';
        this.displayName = 'Jenkins API';
        this.documentationUrl = 'jenkins';
        this.properties = [
            {
                displayName: 'Jenking Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Personal API Token',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Jenkins Instance URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.JenkinsApi = JenkinsApi;
