"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketchatApi = void 0;
class RocketchatApi {
    constructor() {
        this.name = 'rocketchatApi';
        this.displayName = 'Rocket API';
        this.documentationUrl = 'rocketchat';
        this.properties = [
            {
                displayName: 'User ID',
                name: 'userId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Auth Key',
                name: 'authKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://n8n.rocket.chat',
            },
        ];
    }
}
exports.RocketchatApi = RocketchatApi;
