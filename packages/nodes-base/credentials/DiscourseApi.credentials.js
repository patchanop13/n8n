"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscourseApi = void 0;
class DiscourseApi {
    constructor() {
        this.name = 'discourseApi';
        this.displayName = 'Discourse API';
        this.documentationUrl = 'discourse';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                required: true,
                type: 'string',
                default: '',
            },
            {
                displayName: 'Username',
                name: 'username',
                required: true,
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.url}}',
                url: '/admin/groups.json',
                method: 'GET',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            requestOptions.headers = {
                'Api-Key': credentials.apiKey,
                'Api-Username': credentials.username,
            };
            if (requestOptions.method === 'GET') {
                delete requestOptions.body;
            }
            return requestOptions;
        });
    }
}
exports.DiscourseApi = DiscourseApi;
