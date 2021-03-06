"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryblokManagementApi = void 0;
class StoryblokManagementApi {
    constructor() {
        this.name = 'storyblokManagementApi';
        this.displayName = 'Storyblok Management API';
        this.documentationUrl = 'storyblok';
        this.properties = [
            {
                displayName: 'Personal Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.StoryblokManagementApi = StoryblokManagementApi;
