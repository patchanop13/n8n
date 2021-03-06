"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryblokContentApi = void 0;
class StoryblokContentApi {
    constructor() {
        this.name = 'storyblokContentApi';
        this.displayName = 'Storyblok Content API';
        this.documentationUrl = 'storyblok';
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
exports.StoryblokContentApi = StoryblokContentApi;
