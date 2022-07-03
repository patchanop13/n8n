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
exports.TrelloApi = void 0;
class TrelloApi {
    constructor() {
        this.name = 'trelloApi';
        this.displayName = 'Trello API';
        this.documentationUrl = 'trello';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                required: true,
                default: '',
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                required: true,
                default: '',
            },
            {
                displayName: 'OAuth Secret',
                name: 'oauthSecret',
                type: 'hidden',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: 'https://api.trello.com',
                url: '=/1/tokens/{{$credentials.apiToken}}/member',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            requestOptions.qs = Object.assign(Object.assign({}, requestOptions.qs), { 'key': credentials.apiKey, 'token': credentials.apiToken });
            return requestOptions;
        });
    }
}
exports.TrelloApi = TrelloApi;
