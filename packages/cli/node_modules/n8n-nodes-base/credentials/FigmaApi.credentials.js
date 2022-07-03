"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigmaApi = void 0;
class FigmaApi {
    constructor() {
        this.name = 'figmaApi';
        this.displayName = 'Figma API';
        this.documentationUrl = 'figma';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.FigmaApi = FigmaApi;
