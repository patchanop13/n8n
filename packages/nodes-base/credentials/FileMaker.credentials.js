"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMaker = void 0;
class FileMaker {
    constructor() {
        this.name = 'fileMaker';
        this.displayName = 'FileMaker API';
        this.documentationUrl = 'fileMaker';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Database',
                name: 'db',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Login',
                name: 'login',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
        ];
    }
}
exports.FileMaker = FileMaker;
