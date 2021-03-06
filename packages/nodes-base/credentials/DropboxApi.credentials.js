"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxApi = void 0;
class DropboxApi {
    constructor() {
        this.name = 'dropboxApi';
        this.displayName = 'Dropbox API';
        this.documentationUrl = 'dropbox';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
            {
                displayName: 'APP Access Type',
                name: 'accessType',
                type: 'options',
                options: [
                    {
                        name: 'App Folder',
                        value: 'folder',
                    },
                    {
                        name: 'Full Dropbox',
                        value: 'full',
                    },
                ],
                default: 'full',
            },
        ];
    }
}
exports.DropboxApi = DropboxApi;
