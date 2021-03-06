"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertKitApi = void 0;
class ConvertKitApi {
    constructor() {
        this.name = 'convertKitApi';
        this.displayName = 'ConvertKit API';
        this.documentationUrl = 'convertKit';
        this.properties = [
            {
                displayName: 'API Secret',
                name: 'apiSecret',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
            },
        ];
    }
}
exports.ConvertKitApi = ConvertKitApi;
