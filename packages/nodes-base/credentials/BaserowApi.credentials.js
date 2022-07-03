"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaserowApi = void 0;
// https://api.baserow.io/api/redoc/#section/Authentication
class BaserowApi {
    constructor() {
        this.name = 'baserowApi';
        this.displayName = 'Baserow API';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'https://api.baserow.io',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
            },
        ];
    }
}
exports.BaserowApi = BaserowApi;
