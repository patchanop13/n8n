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
exports.getPagingParameters = exports.validateJSON = exports.getAccessToken = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function googleApiRequest(method, resource, body = {}, qs = {}, uri, noCredentials = false, encoding) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://chat.googleapis.com${resource}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (encoding === null) {
            options.encoding = null;
        }
        let responseData;
        try {
            if (noCredentials) {
                //@ts-ignore
                responseData = yield this.helpers.request(options);
            }
            else {
                const credentials = yield this.getCredentials('googleApi');
                const { access_token } = yield getAccessToken.call(this, credentials);
                options.headers.Authorization = `Bearer ${access_token}`;
                //@ts-ignore
                responseData = yield this.helpers.request(options);
            }
        }
        catch (error) {
            if (error.code === 'ERR_OSSL_PEM_NO_START_LINE') {
                error.statusCode = '401';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
        if (Object.keys(responseData).length !== 0) {
            return responseData;
        }
        else {
            return { 'success': true };
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.pageSize = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query);
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
        'https://www.googleapis.com/auth/chat.bot',
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
    //@ts-ignore
    return this.helpers.request(options);
}
exports.getAccessToken = getAccessToken;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;
function getPagingParameters(resource, operation = 'getAll') {
    const pagingParameters = [
        {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            displayOptions: {
                show: {
                    resource: [
                        resource,
                    ],
                    operation: [
                        operation,
                    ],
                },
            },
            default: false,
            description: 'Whether to return all results or only up to a given limit',
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
                maxValue: 1000,
            },
            displayOptions: {
                show: {
                    resource: [
                        resource,
                    ],
                    operation: [
                        operation,
                    ],
                    returnAll: [
                        false,
                    ],
                },
            },
            default: 100,
            description: 'Max number of results to return',
        },
    ];
    return pagingParameters;
}
exports.getPagingParameters = getPagingParameters;
