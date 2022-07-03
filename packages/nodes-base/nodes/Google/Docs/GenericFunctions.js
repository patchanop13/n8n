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
exports.upperFirst = exports.extractID = exports.hasKeys = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function googleApiRequest(method, endpoint, body = {}, qs, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'serviceAccount');
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://docs.googleapis.com/v1${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        try {
            if (authenticationMethod === 'serviceAccount') {
                const credentials = yield this.getCredentials('googleApi');
                const { access_token } = yield getAccessToken.call(this, credentials);
                options.headers.Authorization = `Bearer ${access_token}`;
                return yield this.helpers.request(options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'googleDocsOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, qs, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        const query = Object.assign({}, qs);
        query.maxResults = 100;
        query.pageSize = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query, uri);
            query.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
function getAccessToken(credentials) {
    //https://developers.google.com/identity/protocols/oauth2/service-account#httprest
    const scopes = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
    ];
    const now = (0, moment_timezone_1.default)().unix();
    credentials.email = credentials.email.trim();
    const privateKey = credentials.privateKey.replace(/\\n/g, '\n').trim();
    const signature = jsonwebtoken_1.default.sign({
        'iss': credentials.email,
        'sub': credentials.delegatedEmail || credentials.email,
        'scope': scopes.join(' '),
        'aud': `https://oauth2.googleapis.com/token`,
        'iat': now,
        'exp': now + 3600,
    }, privateKey, {
        algorithm: 'RS256',
        header: {
            'kid': privateKey,
            'typ': 'JWT',
            'alg': 'RS256',
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
const hasKeys = (obj = {}) => Object.keys(obj).length > 0;
exports.hasKeys = hasKeys;
const extractID = (url) => {
    const regex = new RegExp('https://docs.google.com/document/d/([a-zA-Z0-9-_]+)/');
    const results = regex.exec(url);
    return results ? results[1] : undefined;
};
exports.extractID = extractID;
const upperFirst = (str) => {
    return str[0].toUpperCase() + str.substr(1);
};
exports.upperFirst = upperFirst;
