"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signl4Api = void 0;
class Signl4Api {
    constructor() {
        this.name = 'signl4Api';
        this.displayName = 'SIGNL4 Webhook';
        this.documentationUrl = 'signl4';
        this.properties = [
            {
                displayName: 'Team Secret',
                name: 'teamSecret',
                type: 'string',
                default: '',
                description: 'The team secret is the last part of your SIGNL4 webhook URL',
            },
        ];
    }
}
exports.Signl4Api = Signl4Api;
