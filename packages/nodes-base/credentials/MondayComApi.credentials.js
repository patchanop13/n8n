"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MondayComApi = void 0;
class MondayComApi {
    constructor() {
        this.name = 'mondayComApi';
        this.displayName = 'Monday.com API';
        this.documentationUrl = 'mondayCom';
        this.properties = [
            {
                displayName: 'Token V2',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.MondayComApi = MondayComApi;
