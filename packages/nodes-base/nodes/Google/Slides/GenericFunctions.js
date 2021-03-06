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
exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function googleApiRequest(method, resource, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'serviceAccount');
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: `https://slides.googleapis.com/v1${resource}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            if (authenticationMethod === 'serviceAccount') {
                const credentials = yield this.getCredentials('googleApi');
                const { access_token } = yield getAccessToken.call(this, credentials);
                options.headers.Authorization = `Bearer ${access_token}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'googleSlidesOAuth2Api', options);
            }
        }
        catch (error) {
            if (error.code === 'ERR_OSSL_PEM_NO_START_LINE') {
                error.statusCode = '401';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function getAccessToken(credentials) {
    // https://developers.google.com/identity/protocols/oauth2/service-account#httprest
    const scopes = [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations',
    ];
    const now = (0, moment_timezone_1.default)().unix();
    credentials.email = credentials.email.trim();
    const privateKey = credentials.privateKey.replace(/\\n/g, '\n').trim();
    const signature = jsonwebtoken_1.default.sign({
        iss: credentials.email,
        sub: credentials.email,
        scope: scopes.join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    }, privateKey, {
        algorithm: 'RS256',
        header: {
            kid: privateKey,
            typ: 'JWT',
            alg: 'RS256',
        },
    });
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: signature,
        },
        uri: 'https://oauth2.googleapis.com/token',
        json: true,
    };
    return this.helpers.request(options);
}
