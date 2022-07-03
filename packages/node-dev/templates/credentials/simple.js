"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassNameReplace = void 0;
class ClassNameReplace {
    constructor() {
        this.name = 'N8nNameReplace';
        this.displayName = 'DisplayNameReplace';
        this.properties = [
            // The credentials to get from user and save encrypted.
            // Properties can be defined exactly in the same way
            // as node properties.
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ClassNameReplace = ClassNameReplace;
