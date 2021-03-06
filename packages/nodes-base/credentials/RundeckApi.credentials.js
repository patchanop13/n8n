"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RundeckApi = void 0;
class RundeckApi {
    constructor() {
        this.name = 'rundeckApi';
        this.displayName = 'Rundeck API';
        this.documentationUrl = 'rundeck';
        this.properties = [
            {
                displayName: 'Url',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'http://127.0.0.1:4440',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.RundeckApi = RundeckApi;
