"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg91Api = void 0;
class Msg91Api {
    constructor() {
        this.name = 'msg91Api';
        this.displayName = 'Msg91 Api';
        this.documentationUrl = 'msg91';
        this.properties = [
            // User authentication key
            {
                displayName: 'Authentication Key',
                name: 'authkey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.Msg91Api = Msg91Api;
