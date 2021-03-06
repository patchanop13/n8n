"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UptimeRobotApi = void 0;
class UptimeRobotApi {
    constructor() {
        this.name = 'uptimeRobotApi';
        this.displayName = 'Uptime Robot API';
        this.documentationUrl = 'uptimeRobot';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.UptimeRobotApi = UptimeRobotApi;
