"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.simplify = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jwt = __importStar(require("jsonwebtoken"));
function googleApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'serviceAccount');
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://bigquery.googleapis.com/bigquery${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (authenticationMethod === 'serviceAccount') {
                const credentials = yield this.getCredentials('googleApi');
                if (credentials === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
                }
                const { access_token } = yield getAccessToken.call(this, credentials);
                options.headers.Authorization = `Bearer ${access_token}`;
                return yield this.helpers.request(options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'googleBigQueryOAuth2Api', options);
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
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.maxResults = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query);
            query.pageToken = responseData['pageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['pageToken'] !== undefined &&
            responseData['pageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
function getAccessToken(credentials) {
    //https://developers.google.com/identity/protocols/oauth2/service-account#httprest
    const privateKey = credentials.privateKey.replace(/\\n/g, '\n').trim();
    const scopes = [
        'https://www.googleapis.com/auth/bigquery',
    ];
    const now = (0, moment_timezone_1.default)().unix();
    const signature = jwt.sign({
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
function simplify(rows, fields) {
    const results = [];
    for (const row of rows) {
        const record = {};
        for (const [index, field] of fields.entries()) {
            record[field] = row.f[index].v;
        }
        results.push(record);
    }
    return results;
}
exports.simplify = simplify;
