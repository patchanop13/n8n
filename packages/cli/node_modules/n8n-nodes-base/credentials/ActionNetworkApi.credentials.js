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
exports.ActionNetworkApi = void 0;
class ActionNetworkApi {
    constructor() {
        this.name = 'actionNetworkApi';
        this.displayName = 'Action Network API';
        this.documentationUrl = 'actionNetwork';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: 'https://actionnetwork.org/api/v2',
                url: '/events?per_page=1',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            requestOptions.headers = { 'OSDI-API-Token': credentials.apiKey };
            return requestOptions;
        });
    }
}
exports.ActionNetworkApi = ActionNetworkApi;
