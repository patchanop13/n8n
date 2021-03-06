"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcuitySchedulingApi = void 0;
class AcuitySchedulingApi {
    constructor() {
        this.name = 'acuitySchedulingApi';
        this.displayName = 'Acuity Scheduling API';
        this.documentationUrl = 'acuityScheduling';
        this.properties = [
            {
                displayName: 'User ID',
                name: 'userId',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.AcuitySchedulingApi = AcuitySchedulingApi;
