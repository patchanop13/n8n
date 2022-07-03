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
exports.ZendeskApi = void 0;
class ZendeskApi {
    constructor() {
        this.name = 'zendeskApi';
        this.displayName = 'Zendesk API';
        this.documentationUrl = 'zendesk';
        this.properties = [
            {
                displayName: 'Subdomain',
                name: 'subdomain',
                type: 'string',
                description: 'The subdomain of your Zendesk work environment',
                placeholder: 'company',
                default: '',
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: '=https://{{$credentials.subdomain}}.zendesk.com/api/v2',
                url: '/ticket_fields.json',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            requestOptions.auth = {
                username: `${credentials.email}/token`,
                password: credentials.apiToken,
            };
            return requestOptions;
        });
    }
}
exports.ZendeskApi = ZendeskApi;
