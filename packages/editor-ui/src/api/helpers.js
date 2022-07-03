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
exports.post = exports.get = exports.makeRestApiRequest = void 0;
const axios_1 = __importDefault(require("axios"));
class ResponseError extends Error {
    /**
     * Creates an instance of ResponseError.
     * @param {string} message The error message
     * @param {number} [errorCode] The error code which can be used by frontend to identify the actual error
     * @param {number} [httpStatusCode] The HTTP status code the response should have
     * @param {string} [stack] The stack trace
     * @memberof ResponseError
     */
    constructor(message, options = {}) {
        super(message);
        this.name = 'ResponseError';
        const { errorCode, httpStatusCode, stack } = options;
        if (errorCode) {
            this.errorCode = errorCode;
        }
        if (httpStatusCode) {
            this.httpStatusCode = httpStatusCode;
        }
        if (stack) {
            this.serverStackTrace = stack;
        }
    }
}
function request(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { method, baseURL, endpoint, headers, data } = config;
        const options = {
            method,
            url: endpoint,
            baseURL,
            headers,
        };
        if (process.env.NODE_ENV !== 'production' && !baseURL.includes('api.n8n.io')) {
            options.withCredentials = true;
        }
        if (['PATCH', 'POST', 'PUT'].includes(method)) {
            options.data = data;
        }
        else {
            options.params = data;
        }
        try {
            const response = yield axios_1.default.request(options);
            return response.data;
        }
        catch (error) {
            if (error.message === 'Network Error') {
                throw new ResponseError('API-Server can not be reached. It is probably down.');
            }
            const errorResponseData = error.response.data;
            if (errorResponseData !== undefined && errorResponseData.message !== undefined) {
                if (errorResponseData.name === 'NodeApiError') {
                    errorResponseData.httpStatusCode = error.response.status;
                    throw errorResponseData;
                }
                throw new ResponseError(errorResponseData.message, { errorCode: errorResponseData.code, httpStatusCode: error.response.status, stack: errorResponseData.stack });
            }
            throw error;
        }
    });
}
function makeRestApiRequest(context, method, endpoint, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield request({
            method,
            baseURL: context.baseUrl,
            endpoint,
            headers: { sessionid: context.sessionId },
            data,
        });
        // @ts-ignore all cli rest api endpoints return data wrapped in `data` key
        return response.data;
    });
}
exports.makeRestApiRequest = makeRestApiRequest;
function get(baseURL, endpoint, params, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request({ method: 'GET', baseURL, endpoint, headers, data: params });
    });
}
exports.get = get;
function post(baseURL, endpoint, params, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request({ method: 'POST', baseURL, endpoint, headers, data: params });
    });
}
exports.post = post;
