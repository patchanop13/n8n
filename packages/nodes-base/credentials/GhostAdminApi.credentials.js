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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhostAdminApi = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class GhostAdminApi {
    constructor() {
        this.name = 'ghostAdminApi';
        this.displayName = 'Ghost Admin API';
        this.documentationUrl = 'ghost';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'http://localhost:3001',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.url}}',
                url: '/ghost/api/v2/admin/pages/',
            },
        };
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id, secret] = credentials.apiKey.split(':');
            const token = jsonwebtoken_1.default.sign({}, Buffer.from(secret, 'hex'), {
                keyid: id,
                algorithm: 'HS256',
                expiresIn: '5m',
                audience: `/v2/admin/`,
            });
            requestOptions.headers = Object.assign(Object.assign({}, requestOptions.headers), { Authorization: `Ghost ${token}` });
            return requestOptions;
        });
    }
}
exports.GhostAdminApi = GhostAdminApi;
