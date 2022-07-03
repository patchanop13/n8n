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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecuteWebhookFunctions = exports.getExecuteHookFunctions = exports.getLoadOptionsFunctions = exports.getCredentialTestFunctions = exports.getExecuteSingleFunctions = exports.getExecuteFunctions = exports.getExecuteTriggerFunctions = exports.getExecutePollFunctions = exports.getWorkflowMetadata = exports.getWebhookDescription = exports.getTimezone = exports.getNodeWebhookUrl = exports.continueOnFail = exports.getNodeParameter = exports.getNode = exports.getCredentials = exports.getAdditionalKeys = exports.requestWithAuthentication = exports.normalizeItems = exports.returnJsonArray = exports.httpRequestWithAuthentication = exports.requestOAuth1 = exports.requestOAuth2 = exports.prepareBinaryData = exports.getBinaryDataBuffer = void 0;
/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
const n8n_workflow_1 = require("n8n-workflow");
const https_1 = require("https");
const qs_1 = require("qs");
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const crypto_1 = __importStar(require("crypto"));
// eslint-disable-next-line import/no-extraneous-dependencies
const lodash_1 = require("lodash");
const form_data_1 = __importDefault(require("form-data"));
const path_1 = __importDefault(require("path"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const file_type_1 = require("file-type");
const mime_types_1 = require("mime-types");
const axios_1 = __importDefault(require("axios"));
const url_1 = __importStar(require("url"));
const BinaryDataManager_1 = require("./BinaryDataManager");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
axios_1.default.defaults.timeout = 300000;
// Prevent axios from adding x-form-www-urlencoded headers by default
axios_1.default.defaults.headers.post = {};
axios_1.default.defaults.headers.put = {};
axios_1.default.defaults.headers.patch = {};
axios_1.default.defaults.paramsSerializer = (params) => {
    if (params instanceof url_1.URLSearchParams) {
        return params.toString();
    }
    return (0, qs_1.stringify)(params, { arrayFormat: 'indices' });
};
const requestPromiseWithDefaults = request_promise_native_1.default.defaults({
    timeout: 300000, // 5 minutes
});
const pushFormDataValue = (form, key, value) => {
    if ((value === null || value === void 0 ? void 0 : value.hasOwnProperty('value')) && value.hasOwnProperty('options')) {
        // @ts-ignore
        form.append(key, value.value, value.options);
    }
    else {
        form.append(key, value);
    }
};
const createFormDataObject = (data) => {
    const formData = new form_data_1.default();
    const keys = Object.keys(data);
    keys.forEach((key) => {
        // @ts-ignore
        const formField = data[key];
        if (formField instanceof Array) {
            formField.forEach((item) => {
                pushFormDataValue(formData, key, item);
            });
        }
        else {
            pushFormDataValue(formData, key, formField);
        }
    });
    return formData;
};
function searchForHeader(headers, headerName) {
    if (headers === undefined) {
        return undefined;
    }
    const headerNames = Object.keys(headers);
    headerName = headerName.toLowerCase();
    return headerNames.find((thisHeader) => thisHeader.toLowerCase() === headerName);
}
function generateContentLengthHeader(formData, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!formData || !formData.getLength) {
            return;
        }
        try {
            const length = yield new Promise((res, rej) => {
                formData.getLength((error, length) => {
                    if (error) {
                        rej(error);
                        return;
                    }
                    res(length);
                });
            });
            headers = Object.assign(headers, {
                'content-length': length,
            });
        }
        catch (error) {
            n8n_workflow_1.LoggerProxy.error('Unable to calculate form data length', { error });
        }
    });
}
function parseRequestObject(requestObject) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        // This function is a temporary implementation
        // That translates all http requests done via
        // the request library to axios directly
        // We are not using n8n's interface as it would
        // an unnecessary step, considering the `request`
        // helper can be deprecated and removed.
        const axiosConfig = {};
        if (requestObject.headers !== undefined) {
            axiosConfig.headers = requestObject.headers;
        }
        // Let's start parsing the hardest part, which is the request body.
        // The process here is as following?
        // - Check if we have a `content-type` header. If this was set,
        //   we will follow
        // - Check if the `form` property was set. If yes, then it's x-www-form-urlencoded
        // - Check if the `formData` property exists. If yes, then it's multipart/form-data
        // - Lastly, we should have a regular `body` that is probably a JSON.
        const contentTypeHeaderKeyName = axiosConfig.headers &&
            Object.keys(axiosConfig.headers).find((headerName) => headerName.toLowerCase() === 'content-type');
        const contentType = contentTypeHeaderKeyName &&
            axiosConfig.headers[contentTypeHeaderKeyName];
        if (contentType === 'application/x-www-form-urlencoded' && requestObject.formData === undefined) {
            // there are nodes incorrectly created, informing the content type header
            // and also using formData. Request lib takes precedence for the formData.
            // We will do the same.
            // Merge body and form properties.
            if (typeof requestObject.body === 'string') {
                axiosConfig.data = requestObject.body;
            }
            else {
                const allData = Object.assign(requestObject.body || {}, requestObject.form || {});
                if (requestObject.useQuerystring === true) {
                    axiosConfig.data = (0, qs_1.stringify)(allData, { arrayFormat: 'repeat' });
                }
                else {
                    axiosConfig.data = (0, qs_1.stringify)(allData);
                }
            }
        }
        else if (contentType && contentType.includes('multipart/form-data') !== false) {
            if (requestObject.formData !== undefined && requestObject.formData instanceof form_data_1.default) {
                axiosConfig.data = requestObject.formData;
            }
            else {
                const allData = Object.assign(Object.assign({}, requestObject.body), requestObject.formData);
                axiosConfig.data = createFormDataObject(allData);
            }
            // replace the existing header with a new one that
            // contains the boundary property.
            // @ts-ignore
            delete axiosConfig.headers[contentTypeHeaderKeyName];
            const headers = axiosConfig.data.getHeaders();
            axiosConfig.headers = Object.assign(axiosConfig.headers || {}, headers);
            yield generateContentLengthHeader(axiosConfig.data, axiosConfig.headers);
        }
        else {
            // When using the `form` property it means the content should be x-www-form-urlencoded.
            if (requestObject.form !== undefined && requestObject.body === undefined) {
                // If we have only form
                axiosConfig.data =
                    typeof requestObject.form === 'string'
                        ? (0, qs_1.stringify)(requestObject.form, { format: 'RFC3986' })
                        : (0, qs_1.stringify)(requestObject.form).toString();
                if (axiosConfig.headers !== undefined) {
                    const headerName = searchForHeader(axiosConfig.headers, 'content-type');
                    if (headerName) {
                        delete axiosConfig.headers[headerName];
                    }
                    axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
                else {
                    axiosConfig.headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };
                }
            }
            else if (requestObject.formData !== undefined) {
                // remove any "content-type" that might exist.
                if (axiosConfig.headers !== undefined) {
                    const headers = Object.keys(axiosConfig.headers);
                    headers.forEach((header) => header.toLowerCase() === 'content-type' ? delete axiosConfig.headers[header] : null);
                }
                if (requestObject.formData instanceof form_data_1.default) {
                    axiosConfig.data = requestObject.formData;
                }
                else {
                    axiosConfig.data = createFormDataObject(requestObject.formData);
                }
                // Mix in headers as FormData creates the boundary.
                const headers = axiosConfig.data.getHeaders();
                axiosConfig.headers = Object.assign(axiosConfig.headers || {}, headers);
                yield generateContentLengthHeader(axiosConfig.data, axiosConfig.headers);
            }
            else if (requestObject.body !== undefined) {
                // If we have body and possibly form
                if (requestObject.form !== undefined) {
                    // merge both objects when exist.
                    requestObject.body = Object.assign(requestObject.body, requestObject.form);
                }
                axiosConfig.data = requestObject.body;
            }
        }
        if (requestObject.uri !== undefined) {
            axiosConfig.url = (_a = requestObject.uri) === null || _a === void 0 ? void 0 : _a.toString();
        }
        if (requestObject.url !== undefined) {
            axiosConfig.url = (_b = requestObject.url) === null || _b === void 0 ? void 0 : _b.toString();
        }
        if (requestObject.baseURL !== undefined) {
            axiosConfig.baseURL = (_c = requestObject.baseURL) === null || _c === void 0 ? void 0 : _c.toString();
        }
        if (requestObject.method !== undefined) {
            axiosConfig.method = requestObject.method;
        }
        if (requestObject.qs !== undefined && Object.keys(requestObject.qs).length > 0) {
            axiosConfig.params = requestObject.qs;
        }
        if (requestObject.useQuerystring === true ||
            // @ts-ignore
            ((_d = requestObject.qsStringifyOptions) === null || _d === void 0 ? void 0 : _d.arrayFormat) === 'repeat') {
            axiosConfig.paramsSerializer = (params) => {
                return (0, qs_1.stringify)(params, { arrayFormat: 'repeat' });
            };
        }
        else if (requestObject.useQuerystring === false) {
            axiosConfig.paramsSerializer = (params) => {
                return (0, qs_1.stringify)(params, { arrayFormat: 'indices' });
            };
        }
        // @ts-ignore
        if (((_e = requestObject.qsStringifyOptions) === null || _e === void 0 ? void 0 : _e.arrayFormat) === 'brackets') {
            axiosConfig.paramsSerializer = (params) => {
                return (0, qs_1.stringify)(params, { arrayFormat: 'brackets' });
            };
        }
        if (requestObject.auth !== undefined) {
            // Check support for sendImmediately
            if (requestObject.auth.bearer !== undefined) {
                axiosConfig.headers = Object.assign(axiosConfig.headers || {}, {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Authorization: `Bearer ${requestObject.auth.bearer}`,
                });
            }
            else {
                const authObj = requestObject.auth;
                // Request accepts both user/username and pass/password
                axiosConfig.auth = {
                    username: (authObj.user || authObj.username),
                    password: (authObj.password || authObj.pass),
                };
            }
        }
        // Only set header if we have a body, otherwise it may fail
        if (requestObject.json === true) {
            // Add application/json headers - do not set charset as it breaks a lot of stuff
            // only add if no other accept headers was sent.
            const acceptHeaderExists = axiosConfig.headers === undefined
                ? false
                : Object.keys(axiosConfig.headers)
                    .map((headerKey) => headerKey.toLowerCase())
                    .includes('accept');
            if (!acceptHeaderExists) {
                axiosConfig.headers = Object.assign(axiosConfig.headers || {}, {
                    Accept: 'application/json',
                });
            }
        }
        if (requestObject.json === false || requestObject.json === undefined) {
            // Prevent json parsing
            axiosConfig.transformResponse = (res) => res;
        }
        // Axios will follow redirects by default, so we simply tell it otherwise if needed.
        if (requestObject.followRedirect === false &&
            (requestObject.method || 'get').toLowerCase() === 'get') {
            axiosConfig.maxRedirects = 0;
        }
        if (requestObject.followAllRedirects === false &&
            (requestObject.method || 'get').toLowerCase() !== 'get') {
            axiosConfig.maxRedirects = 0;
        }
        if (requestObject.rejectUnauthorized === false) {
            axiosConfig.httpsAgent = new https_1.Agent({
                rejectUnauthorized: false,
            });
        }
        if (requestObject.timeout !== undefined) {
            axiosConfig.timeout = requestObject.timeout;
        }
        if (requestObject.proxy !== undefined) {
            // try our best to parse the url provided.
            if (typeof requestObject.proxy === 'string') {
                try {
                    const url = new url_1.URL(requestObject.proxy);
                    axiosConfig.proxy = {
                        host: url.hostname,
                        port: parseInt(url.port, 10),
                        protocol: url.protocol,
                    };
                    if (!url.port) {
                        // Sets port to a default if not informed
                        if (url.protocol === 'http') {
                            axiosConfig.proxy.port = 80;
                        }
                        else if (url.protocol === 'https') {
                            axiosConfig.proxy.port = 443;
                        }
                    }
                    if (url.username || url.password) {
                        axiosConfig.proxy.auth = {
                            username: url.username,
                            password: url.password,
                        };
                    }
                }
                catch (error) {
                    // Not a valid URL. We will try to simply parse stuff
                    // such as user:pass@host:port without protocol (we'll assume http)
                    if (requestObject.proxy.includes('@')) {
                        const [userpass, hostport] = requestObject.proxy.split('@');
                        const [username, password] = userpass.split(':');
                        const [hostname, port] = hostport.split(':');
                        axiosConfig.proxy = {
                            host: hostname,
                            port: parseInt(port, 10),
                            protocol: 'http',
                            auth: {
                                username,
                                password,
                            },
                        };
                    }
                    else if (requestObject.proxy.includes(':')) {
                        const [hostname, port] = requestObject.proxy.split(':');
                        axiosConfig.proxy = {
                            host: hostname,
                            port: parseInt(port, 10),
                            protocol: 'http',
                        };
                    }
                    else {
                        axiosConfig.proxy = {
                            host: requestObject.proxy,
                            port: 80,
                            protocol: 'http',
                        };
                    }
                }
            }
            else {
                axiosConfig.proxy = requestObject.proxy;
            }
        }
        if (requestObject.encoding === null) {
            // When downloading files, return an arrayBuffer.
            axiosConfig.responseType = 'arraybuffer';
        }
        // If we don't set an accept header
        // Axios forces "application/json, text/plan, */*"
        // Which causes some nodes like NextCloud to break
        // as the service returns XML unless requested otherwise.
        const allHeaders = axiosConfig.headers ? Object.keys(axiosConfig.headers) : [];
        if (!allHeaders.some((headerKey) => headerKey.toLowerCase() === 'accept')) {
            axiosConfig.headers = Object.assign(axiosConfig.headers || {}, { accept: '*/*' });
        }
        if (requestObject.json !== false &&
            axiosConfig.data !== undefined &&
            axiosConfig.data !== '' &&
            !(axiosConfig.data instanceof Buffer) &&
            !allHeaders.some((headerKey) => headerKey.toLowerCase() === 'content-type')) {
            // Use default header for application/json
            // If we don't specify this here, axios will add
            // application/json; charset=utf-8
            // and this breaks a lot of stuff
            axiosConfig.headers = Object.assign(axiosConfig.headers || {}, {
                'content-type': 'application/json',
            });
        }
        /**
         * Missing properties:
         * encoding (need testing)
         * gzip (ignored - default already works)
         * resolveWithFullResponse (implemented elsewhere)
         * simple (???)
         */
        return axiosConfig;
    });
}
function digestAuthAxiosConfig(axiosConfig, response, auth) {
    var _a;
    const authDetails = response.headers['www-authenticate']
        .split(',')
        .map((v) => v.split('='));
    if (authDetails) {
        const nonceCount = `000000001`;
        const cnonce = crypto_1.default.randomBytes(24).toString('hex');
        const realm = authDetails
            .find((el) => el[0].toLowerCase().indexOf('realm') > -1)[1]
            .replace(/"/g, '');
        const opaque = authDetails
            .find((el) => el[0].toLowerCase().indexOf('opaque') > -1)[1]
            .replace(/"/g, '');
        const nonce = authDetails
            .find((el) => el[0].toLowerCase().indexOf('nonce') > -1)[1]
            .replace(/"/g, '');
        const ha1 = crypto_1.default
            .createHash('md5')
            .update(`${auth === null || auth === void 0 ? void 0 : auth.username}:${realm}:${auth === null || auth === void 0 ? void 0 : auth.password}`)
            .digest('hex');
        const path = new url_1.default.URL(axiosConfig.url).pathname;
        const ha2 = crypto_1.default
            .createHash('md5')
            .update(`${(_a = axiosConfig.method) !== null && _a !== void 0 ? _a : 'GET'}:${path}`)
            .digest('hex');
        const response = crypto_1.default
            .createHash('md5')
            .update(`${ha1}:${nonce}:${nonceCount}:${cnonce}:auth:${ha2}`)
            .digest('hex');
        const authorization = `Digest username="${auth === null || auth === void 0 ? void 0 : auth.username}",realm="${realm}",` +
            `nonce="${nonce}",uri="${path}",qop="auth",algorithm="MD5",` +
            `response="${response}",nc="${nonceCount}",cnonce="${cnonce}",opaque="${opaque}"`;
        if (axiosConfig.headers) {
            axiosConfig.headers.authorization = authorization;
        }
        else {
            axiosConfig.headers = { authorization };
        }
    }
    return axiosConfig;
}
function proxyRequestToAxios(uriOrObject, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-line:no-any
        // Check if there's a better way of getting this config here
        if (process.env.N8N_USE_DEPRECATED_REQUEST_LIB) {
            // @ts-ignore
            return requestPromiseWithDefaults.call(null, uriOrObject, options);
        }
        let axiosConfig = {
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        };
        let axiosPromise;
        let configObject;
        if (uriOrObject !== undefined && typeof uriOrObject === 'string') {
            axiosConfig.url = uriOrObject;
        }
        if (uriOrObject !== undefined && typeof uriOrObject === 'object') {
            configObject = uriOrObject;
        }
        else {
            configObject = options || {};
        }
        axiosConfig = Object.assign(axiosConfig, yield parseRequestObject(configObject));
        n8n_workflow_1.LoggerProxy.debug('Proxying request to axios');
        if (((_a = configObject.auth) === null || _a === void 0 ? void 0 : _a.sendImmediately) === false) {
            // for digest-auth
            const { auth } = axiosConfig;
            delete axiosConfig.auth;
            // eslint-disable-next-line no-async-promise-executor
            axiosPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                try {
                    const result = yield (0, axios_1.default)(axiosConfig);
                    resolve(result);
                }
                catch (resp) {
                    if (resp.response === undefined ||
                        resp.response.status !== 401 ||
                        !((_b = resp.response.headers['www-authenticate']) === null || _b === void 0 ? void 0 : _b.includes('nonce'))) {
                        reject(resp);
                    }
                    axiosConfig = digestAuthAxiosConfig(axiosConfig, resp.response, auth);
                    resolve((0, axios_1.default)(axiosConfig));
                }
            }));
        }
        else {
            axiosPromise = (0, axios_1.default)(axiosConfig);
        }
        return new Promise((resolve, reject) => {
            axiosPromise
                .then((response) => {
                if (configObject.resolveWithFullResponse === true) {
                    let body = response.data;
                    if (response.data === '') {
                        if (axiosConfig.responseType === 'arraybuffer') {
                            body = Buffer.alloc(0);
                        }
                        else {
                            body = undefined;
                        }
                    }
                    resolve({
                        body,
                        headers: response.headers,
                        statusCode: response.status,
                        statusMessage: response.statusText,
                        request: response.request,
                    });
                }
                else {
                    let body = response.data;
                    if (response.data === '') {
                        if (axiosConfig.responseType === 'arraybuffer') {
                            body = Buffer.alloc(0);
                        }
                        else {
                            body = undefined;
                        }
                    }
                    resolve(body);
                }
            })
                .catch((error) => {
                var _a, _b;
                if (configObject.simple === false && error.response) {
                    if (configObject.resolveWithFullResponse) {
                        resolve({
                            body: error.response.data,
                            headers: error.response.headers,
                            statusCode: error.response.status,
                            statusMessage: error.response.statusText,
                        });
                    }
                    else {
                        resolve(error.response.data);
                    }
                    return;
                }
                n8n_workflow_1.LoggerProxy.debug('Request proxied to Axios failed', { error });
                // Axios hydrates the original error with more data. We extract them.
                // https://github.com/axios/axios/blob/master/lib/core/enhanceError.js
                // Note: `code` is ignored as it's an expected part of the errorData.
                const { request, response, isAxiosError, toJSON, config } = error, errorData = __rest(error, ["request", "response", "isAxiosError", "toJSON", "config"]);
                if (response) {
                    error.message = `${response.status} - ${JSON.stringify(response.data)}`;
                }
                error.cause = errorData;
                error.error = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || errorData;
                error.statusCode = (_b = error.response) === null || _b === void 0 ? void 0 : _b.status;
                error.options = config || {};
                // Remove not needed data and so also remove circular references
                error.request = undefined;
                error.config = undefined;
                error.options.adapter = undefined;
                error.options.httpsAgent = undefined;
                error.options.paramsSerializer = undefined;
                error.options.transformRequest = undefined;
                error.options.transformResponse = undefined;
                error.options.validateStatus = undefined;
                reject(error);
            });
        });
    });
}
function convertN8nRequestToAxios(n8nRequest) {
    // Destructure properties with the same name first.
    const { headers, method, timeout, auth, proxy, url } = n8nRequest;
    const axiosRequest = {
        headers: headers !== null && headers !== void 0 ? headers : {},
        method,
        timeout,
        auth,
        proxy,
        url,
    };
    axiosRequest.params = n8nRequest.qs;
    if (n8nRequest.baseURL !== undefined) {
        axiosRequest.baseURL = n8nRequest.baseURL;
    }
    if (n8nRequest.disableFollowRedirect === true) {
        axiosRequest.maxRedirects = 0;
    }
    if (n8nRequest.encoding !== undefined) {
        axiosRequest.responseType = n8nRequest.encoding;
    }
    if (n8nRequest.skipSslCertificateValidation === true) {
        axiosRequest.httpsAgent = new https_1.Agent({
            rejectUnauthorized: false,
        });
    }
    if (n8nRequest.arrayFormat !== undefined) {
        axiosRequest.paramsSerializer = (params) => {
            return (0, qs_1.stringify)(params, { arrayFormat: n8nRequest.arrayFormat });
        };
    }
    // if there is a body and it's empty (does not have properties),
    // make sure not to send anything in it as some services fail when
    // sending GET request with empty body.
    if (n8nRequest.body && Object.keys(n8nRequest.body).length) {
        axiosRequest.data = n8nRequest.body;
        // Let's add some useful header standards here.
        const existingContentTypeHeaderKey = searchForHeader(axiosRequest.headers, 'content-type');
        if (existingContentTypeHeaderKey === undefined) {
            // We are only setting content type headers if the user did
            // not set it already manually. We're not overriding, even if it's wrong.
            if (axiosRequest.data instanceof form_data_1.default) {
                axiosRequest.headers = axiosRequest.headers || {};
                axiosRequest.headers['Content-Type'] = 'multipart/form-data';
            }
            else if (axiosRequest.data instanceof url_1.URLSearchParams) {
                axiosRequest.headers = axiosRequest.headers || {};
                axiosRequest.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        }
    }
    if (n8nRequest.json) {
        const key = searchForHeader(axiosRequest.headers, 'accept');
        // If key exists, then the user has set both accept
        // header and the json flag. Header should take precedence.
        if (!key) {
            axiosRequest.headers.Accept = 'application/json';
        }
    }
    const userAgentHeader = searchForHeader(axiosRequest.headers, 'user-agent');
    // If key exists, then the user has set both accept
    // header and the json flag. Header should take precedence.
    if (!userAgentHeader) {
        axiosRequest.headers['User-Agent'] = 'n8n';
    }
    if (n8nRequest.ignoreHttpStatusErrors) {
        axiosRequest.validateStatus = () => true;
    }
    return axiosRequest;
}
function httpRequest(requestOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const axiosRequest = convertN8nRequestToAxios(requestOptions);
        const result = yield (0, axios_1.default)(axiosRequest);
        if (requestOptions.returnFullResponse) {
            return {
                body: result.data,
                headers: result.headers,
                statusCode: result.status,
                statusMessage: result.statusText,
            };
        }
        return result.data;
    });
}
/**
 * Returns binary data buffer for given item index and property name.
 *
 * @export
 * @param {ITaskDataConnections} inputData
 * @param {number} itemIndex
 * @param {string} propertyName
 * @param {number} inputIndex
 * @returns {Promise<Buffer>}
 */
function getBinaryDataBuffer(inputData, itemIndex, propertyName, inputIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const binaryData = inputData.main[inputIndex][itemIndex].binary[propertyName];
        return BinaryDataManager_1.BinaryDataManager.getInstance().retrieveBinaryData(binaryData);
    });
}
exports.getBinaryDataBuffer = getBinaryDataBuffer;
/**
 * Takes a buffer and converts it into the format n8n uses. It encodes the binary data as
 * base64 and adds metadata.
 *
 * @export
 * @param {Buffer} binaryData
 * @param {string} [filePath]
 * @param {string} [mimeType]
 * @returns {Promise<IBinaryData>}
 */
function prepareBinaryData(binaryData, executionId, filePath, mimeType) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileExtension;
        if (!mimeType) {
            // If no mime type is given figure it out
            if (filePath) {
                // Use file path to guess mime type
                const mimeTypeLookup = (0, mime_types_1.lookup)(filePath);
                if (mimeTypeLookup) {
                    mimeType = mimeTypeLookup;
                }
            }
            if (!mimeType) {
                // Use buffer to guess mime type
                const fileTypeData = yield (0, file_type_1.fromBuffer)(binaryData);
                if (fileTypeData) {
                    mimeType = fileTypeData.mime;
                    fileExtension = fileTypeData.ext;
                }
            }
            if (!mimeType) {
                // Fall back to text
                mimeType = 'text/plain';
            }
        }
        const returnData = {
            mimeType,
            fileExtension,
            data: '',
        };
        if (filePath) {
            if (filePath.includes('?')) {
                // Remove maybe present query parameters
                filePath = filePath.split('?').shift();
            }
            const filePathParts = path_1.default.parse(filePath);
            if (filePathParts.dir !== '') {
                returnData.directory = filePathParts.dir;
            }
            returnData.fileName = filePathParts.base;
            // Remove the dot
            const fileExtension = filePathParts.ext.slice(1);
            if (fileExtension) {
                returnData.fileExtension = fileExtension;
            }
        }
        return BinaryDataManager_1.BinaryDataManager.getInstance().storeBinaryData(returnData, binaryData, executionId);
    });
}
exports.prepareBinaryData = prepareBinaryData;
/**
 * Makes a request using OAuth data for authentication
 *
 * @export
 * @param {IAllExecuteFunctions} this
 * @param {string} credentialsType
 * @param {(OptionsWithUri | requestPromise.RequestPromiseOptions)} requestOptions
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 *
 * @returns
 */
function requestOAuth2(credentialsType, requestOptions, node, additionalData, oAuth2Options, isN8nRequest = false) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = (yield this.getCredentials(credentialsType));
        // Only the OAuth2 with authorization code grant needs connection
        if (credentials.grantType === n8n_workflow_1.OAuth2GrantType.authorizationCode &&
            credentials.oauthTokenData === undefined) {
            throw new Error('OAuth credentials not connected!');
        }
        const oAuthClient = new client_oauth2_1.default({
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
            accessTokenUri: credentials.accessTokenUrl,
            scopes: credentials.scope.split(' '),
        });
        let oauthTokenData = credentials.oauthTokenData;
        // if it's the first time using the credentials, get the access token and save it into the DB.
        if (credentials.grantType === n8n_workflow_1.OAuth2GrantType.clientCredentials && oauthTokenData === undefined) {
            const { data } = yield oAuthClient.credentials.getToken();
            // Find the credentials
            if (!node.credentials || !node.credentials[credentialsType]) {
                throw new Error(`The node "${node.name}" does not have credentials of type "${credentialsType}"!`);
            }
            const nodeCredentials = node.credentials[credentialsType];
            // Save the refreshed token
            yield additionalData.credentialsHelper.updateCredentials(nodeCredentials, credentialsType, credentials);
            oauthTokenData = data;
        }
        const token = oAuthClient.createToken((0, lodash_1.get)(oauthTokenData, oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.property) || oauthTokenData.accessToken, oauthTokenData.refreshToken, (oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.tokenType) || oauthTokenData.tokenType, oauthTokenData);
        // Signs the request by adding authorization headers or query parameters depending
        // on the token-type used.
        const newRequestOptions = token.sign(requestOptions);
        // If keep bearer is false remove the it from the authorization header
        if ((oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.keepBearer) === false) {
            // @ts-ignore
            (_a = newRequestOptions === null || newRequestOptions === void 0 ? void 0 : newRequestOptions.headers) === null || _a === void 0 ? void 0 : _a.Authorization =
                // @ts-ignore
                (_b = newRequestOptions === null || newRequestOptions === void 0 ? void 0 : newRequestOptions.headers) === null || _b === void 0 ? void 0 : _b.Authorization.split(' ')[1];
        }
        return this.helpers.request(newRequestOptions).catch((error) => __awaiter(this, void 0, void 0, function* () {
            const statusCodeReturned = (oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.tokenExpiredStatusCode) === undefined
                ? 401
                : oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.tokenExpiredStatusCode;
            if (error.statusCode === statusCodeReturned) {
                // Token is probably not valid anymore. So try refresh it.
                const tokenRefreshOptions = {};
                if (oAuth2Options === null || oAuth2Options === void 0 ? void 0 : oAuth2Options.includeCredentialsOnRefreshOnBody) {
                    const body = {
                        client_id: credentials.clientId,
                        client_secret: credentials.clientSecret,
                    };
                    tokenRefreshOptions.body = body;
                    // Override authorization property so the credentails are not included in it
                    tokenRefreshOptions.headers = {
                        Authorization: '',
                    };
                }
                n8n_workflow_1.LoggerProxy.debug(`OAuth2 token for "${credentialsType}" used by node "${node.name}" expired. Should revalidate.`);
                let newToken;
                // if it's OAuth2 with client credentials grant type, get a new token
                // instead of refreshing it.
                if (n8n_workflow_1.OAuth2GrantType.clientCredentials === credentials.grantType) {
                    newToken = yield token.client.credentials.getToken();
                }
                else {
                    newToken = yield token.refresh(tokenRefreshOptions);
                }
                n8n_workflow_1.LoggerProxy.debug(`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been renewed.`);
                credentials.oauthTokenData = newToken.data;
                // Find the credentials
                if (!node.credentials || !node.credentials[credentialsType]) {
                    throw new Error(`The node "${node.name}" does not have credentials of type "${credentialsType}"!`);
                }
                const nodeCredentials = node.credentials[credentialsType];
                // Save the refreshed token
                yield additionalData.credentialsHelper.updateCredentials(nodeCredentials, credentialsType, credentials);
                n8n_workflow_1.LoggerProxy.debug(`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been saved to database successfully.`);
                // Make the request again with the new token
                const newRequestOptions = newToken.sign(requestOptions);
                if (isN8nRequest) {
                    return this.helpers.httpRequest(newRequestOptions);
                }
                return this.helpers.request(newRequestOptions);
            }
            // Unknown error so simply throw it
            throw error;
        }));
    });
}
exports.requestOAuth2 = requestOAuth2;
/* Makes a request using OAuth1 data for authentication
 *
 * @export
 * @param {IAllExecuteFunctions} this
 * @param {string} credentialsType
 * @param {(OptionsWithUrl | requestPromise.RequestPromiseOptions)} requestOptionså
 * @returns
 */
function requestOAuth1(credentialsType, requestOptions, isN8nRequest = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials(credentialsType);
        if (credentials === undefined) {
            throw new Error('No credentials were returned!');
        }
        if (credentials.oauthTokenData === undefined) {
            throw new Error('OAuth credentials not connected!');
        }
        const oauth = new oauth_1_0a_1.default({
            consumer: {
                key: credentials.consumerKey,
                secret: credentials.consumerSecret,
            },
            signature_method: credentials.signatureMethod,
            hash_function(base, key) {
                const algorithm = credentials.signatureMethod === 'HMAC-SHA1' ? 'sha1' : 'sha256';
                return (0, crypto_1.createHmac)(algorithm, key).update(base).digest('base64');
            },
        });
        const oauthTokenData = credentials.oauthTokenData;
        const token = {
            key: oauthTokenData.oauth_token,
            secret: oauthTokenData.oauth_token_secret,
        };
        // @ts-ignore
        requestOptions.data = Object.assign(Object.assign({}, requestOptions.qs), requestOptions.form);
        // Fixes issue that OAuth1 library only works with "url" property and not with "uri"
        // @ts-ignore
        if (requestOptions.uri && !requestOptions.url) {
            // @ts-ignore
            requestOptions.url = requestOptions.uri;
            // @ts-ignore
            delete requestOptions.uri;
        }
        // @ts-ignore
        requestOptions.headers = oauth.toHeader(oauth.authorize(requestOptions, token));
        if (isN8nRequest) {
            return this.helpers.httpRequest(requestOptions);
        }
        return this.helpers.request(requestOptions).catch((error) => __awaiter(this, void 0, void 0, function* () {
            // Unknown error so simply throw it
            throw error;
        }));
    });
}
exports.requestOAuth1 = requestOAuth1;
function httpRequestWithAuthentication(credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parentTypes = additionalData.credentialsHelper.getParentTypes(credentialsType);
            if (parentTypes.includes('oAuth1Api')) {
                return yield requestOAuth1.call(this, credentialsType, requestOptions, true);
            }
            if (parentTypes.includes('oAuth2Api')) {
                return yield requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, additionalCredentialOptions === null || additionalCredentialOptions === void 0 ? void 0 : additionalCredentialOptions.oauth2, true);
            }
            let credentialsDecrypted;
            if (additionalCredentialOptions === null || additionalCredentialOptions === void 0 ? void 0 : additionalCredentialOptions.credentialsDecrypted) {
                credentialsDecrypted = additionalCredentialOptions.credentialsDecrypted.data;
            }
            else {
                credentialsDecrypted = yield this.getCredentials(credentialsType);
            }
            if (credentialsDecrypted === undefined) {
                throw new n8n_workflow_1.NodeOperationError(node, `Node "${node.name}" does not have any credentials of type "${credentialsType}" set!`);
            }
            requestOptions = yield additionalData.credentialsHelper.authenticate(credentialsDecrypted, credentialsType, requestOptions, workflow, node, additionalData.timezone);
            return yield httpRequest(requestOptions);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.httpRequestWithAuthentication = httpRequestWithAuthentication;
/**
 * Takes generic input data and brings it into the json format n8n uses.
 *
 * @export
 * @param {(IDataObject | IDataObject[])} jsonData
 * @returns {INodeExecutionData[]}
 */
function returnJsonArray(jsonData) {
    const returnData = [];
    if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
    }
    jsonData.forEach((data) => {
        returnData.push({ json: data });
    });
    return returnData;
}
exports.returnJsonArray = returnJsonArray;
/**
 * Automatically put the objects under a 'json' key and don't error,
 * if some objects contain json/binary keys and others don't, throws error 'Inconsistent item format'
 *
 * @export
 * @param {INodeExecutionData | INodeExecutionData[]} executionData
 * @returns {INodeExecutionData[]}
 */
function normalizeItems(executionData) {
    if (typeof executionData === 'object' && !Array.isArray(executionData))
        executionData = [{ json: executionData }];
    if (executionData.every((item) => typeof item === 'object' && 'json' in item))
        return executionData;
    if (executionData.some((item) => typeof item === 'object' && 'json' in item)) {
        throw new Error('Inconsistent item format');
    }
    if (executionData.every((item) => typeof item === 'object' && 'binary' in item)) {
        const normalizedItems = [];
        executionData.forEach((item) => {
            const json = Object.keys(item).reduce((acc, key) => {
                if (key === 'binary')
                    return acc;
                return Object.assign(Object.assign({}, acc), { [key]: item[key] });
            }, {});
            normalizedItems.push({
                json,
                binary: item.binary,
            });
        });
        return normalizedItems;
    }
    if (executionData.some((item) => typeof item === 'object' && 'binary' in item)) {
        throw new Error('Inconsistent item format');
    }
    return executionData.map((item) => {
        return { json: item };
    });
}
exports.normalizeItems = normalizeItems;
// TODO: Move up later
function requestWithAuthentication(credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parentTypes = additionalData.credentialsHelper.getParentTypes(credentialsType);
            if (parentTypes.includes('oAuth1Api')) {
                return yield requestOAuth1.call(this, credentialsType, requestOptions, false);
            }
            if (parentTypes.includes('oAuth2Api')) {
                return yield requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, additionalCredentialOptions === null || additionalCredentialOptions === void 0 ? void 0 : additionalCredentialOptions.oauth2, false);
            }
            let credentialsDecrypted;
            if (additionalCredentialOptions === null || additionalCredentialOptions === void 0 ? void 0 : additionalCredentialOptions.credentialsDecrypted) {
                credentialsDecrypted = additionalCredentialOptions.credentialsDecrypted.data;
            }
            else {
                credentialsDecrypted = yield this.getCredentials(credentialsType);
            }
            if (credentialsDecrypted === undefined) {
                throw new n8n_workflow_1.NodeOperationError(node, `Node "${node.name}" does not have any credentials of type "${credentialsType}" set!`);
            }
            requestOptions = yield additionalData.credentialsHelper.authenticate(credentialsDecrypted, credentialsType, requestOptions, workflow, node, additionalData.timezone);
            return yield proxyRequestToAxios(requestOptions);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.requestWithAuthentication = requestWithAuthentication;
/**
 * Returns the additional keys for Expressions and Function-Nodes
 *
 * @export
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @returns {(IWorkflowDataProxyAdditionalKeys)}
 */
function getAdditionalKeys(additionalData) {
    const executionId = additionalData.executionId || _1.PLACEHOLDER_EMPTY_EXECUTION_ID;
    return {
        $executionId: executionId,
        $resumeWebhookUrl: `${additionalData.webhookWaitingBaseUrl}/${executionId}`,
    };
}
exports.getAdditionalKeys = getAdditionalKeys;
/**
 * Returns the requested decrypted credentials if the node has access to them.
 *
 * @export
 * @param {Workflow} workflow Workflow which requests the data
 * @param {INode} node Node which request the data
 * @param {string} type The credential type to return
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @returns {(ICredentialDataDecryptedObject | undefined)}
 */
function getCredentials(workflow, node, type, additionalData, mode, runExecutionData, runIndex, connectionInputData, itemIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the NodeType as it has the information if the credentials are required
        const nodeType = workflow.nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
        if (nodeType === undefined) {
            throw new n8n_workflow_1.NodeOperationError(node, `Node type "${node.type}" is not known so can not get credentials!`);
        }
        // Hardcode for now for security reasons that only a single node can access
        // all credentials
        const fullAccess = ['n8n-nodes-base.httpRequest'].includes(node.type);
        let nodeCredentialDescription;
        if (!fullAccess) {
            if (nodeType.description.credentials === undefined) {
                throw new n8n_workflow_1.NodeOperationError(node, `Node type "${node.type}" does not have any credentials defined!`);
            }
            nodeCredentialDescription = nodeType.description.credentials.find((credentialTypeDescription) => credentialTypeDescription.name === type);
            if (nodeCredentialDescription === undefined) {
                throw new n8n_workflow_1.NodeOperationError(node, `Node type "${node.type}" does not have any credentials of type "${type}" defined!`);
            }
            if (!n8n_workflow_1.NodeHelpers.displayParameter(additionalData.currentNodeParameters || node.parameters, nodeCredentialDescription, node, node.parameters)) {
                // Credentials should not be displayed even if they would be defined
                throw new n8n_workflow_1.NodeOperationError(node, 'Credentials not found');
            }
        }
        // Check if node has any credentials defined
        if (!fullAccess && (!node.credentials || !node.credentials[type])) {
            // If none are defined check if the credentials are required or not
            if ((nodeCredentialDescription === null || nodeCredentialDescription === void 0 ? void 0 : nodeCredentialDescription.required) === true) {
                // Credentials are required so error
                if (!node.credentials) {
                    throw new n8n_workflow_1.NodeOperationError(node, 'Node does not have any credentials set!');
                }
                if (!node.credentials[type]) {
                    throw new n8n_workflow_1.NodeOperationError(node, `Node does not have any credentials set for "${type}"!`);
                }
            }
            else {
                // Credentials are not required
                throw new n8n_workflow_1.NodeOperationError(node, 'Node does not require credentials');
            }
        }
        if (fullAccess && (!node.credentials || !node.credentials[type])) {
            // Make sure that fullAccess nodes still behave like before that if they
            // request access to credentials that are currently not set it returns undefined
            throw new n8n_workflow_1.NodeOperationError(node, 'Credentials not found');
        }
        let expressionResolveValues;
        if (connectionInputData && runExecutionData && runIndex !== undefined) {
            expressionResolveValues = {
                connectionInputData,
                itemIndex: itemIndex || 0,
                node,
                runExecutionData,
                runIndex,
                workflow,
            };
        }
        const nodeCredentials = node.credentials
            ? node.credentials[type]
            : {};
        // TODO: solve using credentials via expression
        // if (name.charAt(0) === '=') {
        // 	// If the credential name is an expression resolve it
        // 	const additionalKeys = getAdditionalKeys(additionalData);
        // 	name = workflow.expression.getParameterValue(
        // 		name,
        // 		runExecutionData || null,
        // 		runIndex || 0,
        // 		itemIndex || 0,
        // 		node.name,
        // 		connectionInputData || [],
        // 		mode,
        // 		additionalKeys,
        // 	) as string;
        // }
        const decryptedDataObject = yield additionalData.credentialsHelper.getDecrypted(nodeCredentials, type, mode, additionalData.timezone, false, expressionResolveValues);
        return decryptedDataObject;
    });
}
exports.getCredentials = getCredentials;
/**
 * Returns a copy of the node
 *
 * @export
 * @param {INode} node
 * @returns {INode}
 */
function getNode(node) {
    return JSON.parse(JSON.stringify(node));
}
exports.getNode = getNode;
/**
 * Clean up parameter data to make sure that only valid data gets returned
 * INFO: Currently only converts Luxon Dates as we know for sure it will not be breaking
 */
function cleanupParameterData(inputData) {
    if (inputData === null || inputData === undefined) {
        return inputData;
    }
    if (Array.isArray(inputData)) {
        inputData.forEach((value) => cleanupParameterData(value));
        return inputData;
    }
    if (inputData.constructor.name === 'DateTime') {
        // Is a special luxon date so convert to string
        return inputData.toString();
    }
    if (typeof inputData === 'object') {
        Object.keys(inputData).forEach((key) => {
            inputData[key] = cleanupParameterData(inputData[key]);
        });
    }
    return inputData;
}
/**
 * Returns the requested resolved (all expressions replaced) node parameters.
 *
 * @export
 * @param {Workflow} workflow
 * @param {(IRunExecutionData | null)} runExecutionData
 * @param {number} runIndex
 * @param {INodeExecutionData[]} connectionInputData
 * @param {INode} node
 * @param {string} parameterName
 * @param {number} itemIndex
 * @param {*} [fallbackValue]
 * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | object)}
 */
function getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, timezone, additionalKeys, executeData, fallbackValue) {
    const nodeType = workflow.nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
    if (nodeType === undefined) {
        throw new Error(`Node type "${node.type}" is not known so can not return paramter value!`);
    }
    const value = (0, lodash_1.get)(node.parameters, parameterName, fallbackValue);
    if (value === undefined) {
        throw new Error(`Could not get parameter "${parameterName}"!`);
    }
    let returnData;
    try {
        returnData = workflow.expression.getParameterValue(value, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, mode, timezone, additionalKeys, executeData);
        returnData = cleanupParameterData(returnData);
    }
    catch (e) {
        if (e.context)
            e.context.parameter = parameterName;
        e.cause = value;
        throw e;
    }
    return returnData;
}
exports.getNodeParameter = getNodeParameter;
/**
 * Returns if execution should be continued even if there was an error.
 *
 * @export
 * @param {INode} node
 * @returns {boolean}
 */
function continueOnFail(node) {
    return (0, lodash_1.get)(node, 'continueOnFail', false);
}
exports.continueOnFail = continueOnFail;
/**
 * Returns the webhook URL of the webhook with the given name
 *
 * @export
 * @param {string} name
 * @param {Workflow} workflow
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {boolean} [isTest]
 * @returns {(string | undefined)}
 */
function getNodeWebhookUrl(name, workflow, node, additionalData, mode, timezone, additionalKeys, isTest) {
    let baseUrl = additionalData.webhookBaseUrl;
    if (isTest === true) {
        baseUrl = additionalData.webhookTestBaseUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const webhookDescription = getWebhookDescription(name, workflow, node);
    if (webhookDescription === undefined) {
        return undefined;
    }
    const path = workflow.expression.getSimpleParameterValue(node, webhookDescription.path, mode, timezone, additionalKeys);
    if (path === undefined) {
        return undefined;
    }
    const isFullPath = workflow.expression.getSimpleParameterValue(node, webhookDescription.isFullPath, mode, timezone, additionalKeys, undefined, false);
    return n8n_workflow_1.NodeHelpers.getNodeWebhookUrl(baseUrl, workflow.id, node, path.toString(), isFullPath);
}
exports.getNodeWebhookUrl = getNodeWebhookUrl;
/**
 * Returns the timezone for the workflow
 *
 * @export
 * @param {Workflow} workflow
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @returns {string}
 */
function getTimezone(workflow, additionalData) {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (workflow.settings !== undefined && workflow.settings.timezone !== undefined) {
        return workflow.settings.timezone;
    }
    return additionalData.timezone;
}
exports.getTimezone = getTimezone;
/**
 * Returns the full webhook description of the webhook with the given name
 *
 * @export
 * @param {string} name
 * @param {Workflow} workflow
 * @param {INode} node
 * @returns {(IWebhookDescription | undefined)}
 */
function getWebhookDescription(name, workflow, node) {
    const nodeType = workflow.nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
    if (nodeType.description.webhooks === undefined) {
        // Node does not have any webhooks so return
        return undefined;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const webhookDescription of nodeType.description.webhooks) {
        if (webhookDescription.name === name) {
            return webhookDescription;
        }
    }
    return undefined;
}
exports.getWebhookDescription = getWebhookDescription;
/**
 * Returns the workflow metadata
 *
 * @export
 * @param {Workflow} workflow
 * @returns {IWorkflowMetadata}
 */
function getWorkflowMetadata(workflow) {
    return {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
    };
}
exports.getWorkflowMetadata = getWorkflowMetadata;
/**
 * Returns the execute functions the poll nodes have access to.
 *
 * @export
 * @param {Workflow} workflow
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {ITriggerFunctions}
 */
// TODO: Check if I can get rid of: additionalData, and so then maybe also at ActiveWorkflowRunner.add
function getExecutePollFunctions(workflow, node, additionalData, mode, activation) {
    return ((workflow, node) => {
        return {
            __emit: (data) => {
                throw new Error('Overwrite NodeExecuteFunctions.getExecutePullFunctions.__emit function!');
            },
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode);
                });
            },
            getMode: () => {
                return mode;
            },
            getActivationMode: () => {
                return activation;
            },
            getNode: () => {
                return getNode(node);
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                const runExecutionData = null;
                const itemIndex = 0;
                const runIndex = 0;
                const connectionInputData = [];
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), undefined, fallbackValue);
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            helpers: {
                httpRequest,
                prepareBinaryData(binaryData, filePath, mimeType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return prepareBinaryData.call(this, binaryData, additionalData.executionId, filePath, mimeType);
                    });
                },
                request: proxyRequestToAxios,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                returnJsonArray,
            },
        };
    })(workflow, node);
}
exports.getExecutePollFunctions = getExecutePollFunctions;
/**
 * Returns the execute functions the trigger nodes have access to.
 *
 * @export
 * @param {Workflow} workflow
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {ITriggerFunctions}
 */
// TODO: Check if I can get rid of: additionalData, and so then maybe also at ActiveWorkflowRunner.add
function getExecuteTriggerFunctions(workflow, node, additionalData, mode, activation) {
    return ((workflow, node) => {
        return {
            emit: (data) => {
                throw new Error('Overwrite NodeExecuteFunctions.getExecuteTriggerFunctions.emit function!');
            },
            emitError: (error) => {
                throw new Error('Overwrite NodeExecuteFunctions.getExecuteTriggerFunctions.emit function!');
            },
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode);
                });
            },
            getNode: () => {
                return getNode(node);
            },
            getMode: () => {
                return mode;
            },
            getActivationMode: () => {
                return activation;
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                const runExecutionData = null;
                const itemIndex = 0;
                const runIndex = 0;
                const connectionInputData = [];
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), undefined, fallbackValue);
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            helpers: {
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                prepareBinaryData(binaryData, filePath, mimeType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return prepareBinaryData.call(this, binaryData, additionalData.executionId, filePath, mimeType);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                returnJsonArray,
            },
        };
    })(workflow, node);
}
exports.getExecuteTriggerFunctions = getExecuteTriggerFunctions;
/**
 * Returns the execute functions regular nodes have access to.
 *
 * @export
 * @param {Workflow} workflow
 * @param {IRunExecutionData} runExecutionData
 * @param {number} runIndex
 * @param {INodeExecutionData[]} connectionInputData
 * @param {ITaskDataConnections} inputData
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {IExecuteFunctions}
 */
function getExecuteFunctions(workflow, runExecutionData, runIndex, connectionInputData, inputData, node, additionalData, executeData, mode) {
    return ((workflow, runExecutionData, connectionInputData, inputData, node) => {
        return {
            continueOnFail: () => {
                return continueOnFail(node);
            },
            evaluateExpression: (expression, itemIndex) => {
                return workflow.expression.resolveSimpleParameterValue(`=${expression}`, {}, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData);
            },
            executeWorkflow(workflowInfo, inputData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return additionalData
                        .executeWorkflow(workflowInfo, additionalData, inputData)
                        .then((result) => __awaiter(this, void 0, void 0, function* () {
                        return BinaryDataManager_1.BinaryDataManager.getInstance().duplicateBinaryData(result, additionalData.executionId);
                    }));
                });
            },
            getContext(type) {
                return n8n_workflow_1.NodeHelpers.getContext(runExecutionData, type, node);
            },
            getCredentials(type, itemIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode, runExecutionData, runIndex, connectionInputData, itemIndex);
                });
            },
            getExecutionId: () => {
                return additionalData.executionId;
            },
            getInputData: (inputIndex = 0, inputName = 'main') => {
                if (!inputData.hasOwnProperty(inputName)) {
                    // Return empty array because else it would throw error when nothing is connected to input
                    return [];
                }
                // TODO: Check if nodeType has input with that index defined
                if (inputData[inputName].length < inputIndex) {
                    throw new Error(`Could not get input index "${inputIndex}" of input "${inputName}"!`);
                }
                if (inputData[inputName][inputIndex] === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" did not get set!`);
                }
                return inputData[inputName][inputIndex];
            },
            getNodeParameter: (parameterName, itemIndex, fallbackValue) => {
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData, fallbackValue);
            },
            getMode: () => {
                return mode;
            },
            getNode: () => {
                return getNode(node);
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getExecuteData: () => {
                return executeData;
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowDataProxy: (itemIndex) => {
                const dataProxy = new n8n_workflow_1.WorkflowDataProxy(workflow, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, {}, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData);
                return dataProxy.getDataProxy();
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            prepareOutputData: n8n_workflow_1.NodeHelpers.prepareOutputData,
            putExecutionToWait(waitTill) {
                return __awaiter(this, void 0, void 0, function* () {
                    runExecutionData.waitTill = waitTill;
                });
            },
            sendMessageToUI(...args) {
                if (mode !== 'manual') {
                    return;
                }
                try {
                    if (additionalData.sendMessageToUI) {
                        additionalData.sendMessageToUI(node.name, args);
                    }
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    n8n_workflow_1.LoggerProxy.warn(`There was a problem sending messsage to UI: ${error.message}`);
                }
            },
            sendResponse(response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    yield ((_a = additionalData.hooks) === null || _a === void 0 ? void 0 : _a.executeHookFunctions('sendResponse', [response]));
                });
            },
            helpers: {
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                prepareBinaryData(binaryData, filePath, mimeType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return prepareBinaryData.call(this, binaryData, additionalData.executionId, filePath, mimeType);
                    });
                },
                getBinaryDataBuffer(itemIndex, propertyName, inputIndex = 0) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return getBinaryDataBuffer.call(this, inputData, itemIndex, propertyName, inputIndex);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                returnJsonArray,
                normalizeItems,
            },
        };
    })(workflow, runExecutionData, connectionInputData, inputData, node);
}
exports.getExecuteFunctions = getExecuteFunctions;
/**
 * Returns the execute functions regular nodes have access to when single-function is defined.
 *
 * @export
 * @param {Workflow} workflow
 * @param {IRunExecutionData} runExecutionData
 * @param {number} runIndex
 * @param {INodeExecutionData[]} connectionInputData
 * @param {ITaskDataConnections} inputData
 * @param {INode} node
 * @param {number} itemIndex
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {IExecuteSingleFunctions}
 */
function getExecuteSingleFunctions(workflow, runExecutionData, runIndex, connectionInputData, inputData, node, itemIndex, additionalData, executeData, mode) {
    return ((workflow, runExecutionData, connectionInputData, inputData, node, itemIndex) => {
        return {
            continueOnFail: () => {
                return continueOnFail(node);
            },
            evaluateExpression: (expression, evaluateItemIndex) => {
                evaluateItemIndex = evaluateItemIndex === undefined ? itemIndex : evaluateItemIndex;
                return workflow.expression.resolveSimpleParameterValue(`=${expression}`, {}, runExecutionData, runIndex, evaluateItemIndex, node.name, connectionInputData, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData);
            },
            getContext(type) {
                return n8n_workflow_1.NodeHelpers.getContext(runExecutionData, type, node);
            },
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode, runExecutionData, runIndex, connectionInputData, itemIndex);
                });
            },
            getInputData: (inputIndex = 0, inputName = 'main') => {
                if (!inputData.hasOwnProperty(inputName)) {
                    // Return empty array because else it would throw error when nothing is connected to input
                    return { json: {} };
                }
                // TODO: Check if nodeType has input with that index defined
                if (inputData[inputName].length < inputIndex) {
                    throw new Error(`Could not get input index "${inputIndex}" of input "${inputName}"!`);
                }
                const allItems = inputData[inputName][inputIndex];
                if (allItems === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" did not get set!`);
                }
                if (allItems[itemIndex] === null) {
                    // return [];
                    throw new Error(`Value "${inputIndex}" of input "${inputName}" with itemIndex "${itemIndex}" did not get set!`);
                }
                return allItems[itemIndex];
            },
            getItemIndex() {
                return itemIndex;
            },
            getMode: () => {
                return mode;
            },
            getNode: () => {
                return getNode(node);
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getExecuteData: () => {
                return executeData;
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData, fallbackValue);
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowDataProxy: () => {
                const dataProxy = new n8n_workflow_1.WorkflowDataProxy(workflow, runExecutionData, runIndex, itemIndex, node.name, connectionInputData, {}, mode, additionalData.timezone, getAdditionalKeys(additionalData), executeData);
                return dataProxy.getDataProxy();
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            helpers: {
                getBinaryDataBuffer(propertyName, inputIndex = 0) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return getBinaryDataBuffer.call(this, inputData, itemIndex, propertyName, inputIndex);
                    });
                },
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                prepareBinaryData(binaryData, filePath, mimeType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return prepareBinaryData.call(this, binaryData, additionalData.executionId, filePath, mimeType);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
            },
        };
    })(workflow, runExecutionData, connectionInputData, inputData, node, itemIndex);
}
exports.getExecuteSingleFunctions = getExecuteSingleFunctions;
function getCredentialTestFunctions() {
    return {
        helpers: {
            request: requestPromiseWithDefaults,
        },
    };
}
exports.getCredentialTestFunctions = getCredentialTestFunctions;
/**
 * Returns the execute functions regular nodes have access to in load-options-function.
 *
 * @export
 * @param {Workflow} workflow
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @returns {ILoadOptionsFunctions}
 */
function getLoadOptionsFunctions(workflow, node, path, additionalData) {
    return ((workflow, node, path) => {
        const that = {
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, 'internal');
                });
            },
            getCurrentNodeParameter: (parameterPath) => {
                const nodeParameters = additionalData.currentNodeParameters;
                if (parameterPath.charAt(0) === '&') {
                    parameterPath = `${path.split('.').slice(1, -1).join('.')}.${parameterPath.slice(1)}`;
                }
                return (0, lodash_1.get)(nodeParameters, parameterPath);
            },
            getCurrentNodeParameters: () => {
                return additionalData.currentNodeParameters;
            },
            getNode: () => {
                return getNode(node);
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                const runExecutionData = null;
                const itemIndex = 0;
                const runIndex = 0;
                const connectionInputData = [];
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, 'internal', additionalData.timezone, getAdditionalKeys(additionalData), undefined, fallbackValue);
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getRestApiUrl: () => {
                return additionalData.restApiUrl;
            },
            helpers: {
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
            },
        };
        return that;
    })(workflow, node, path);
}
exports.getLoadOptionsFunctions = getLoadOptionsFunctions;
/**
 * Returns the execute functions regular nodes have access to in hook-function.
 *
 * @export
 * @param {Workflow} workflow
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {IHookFunctions}
 */
function getExecuteHookFunctions(workflow, node, additionalData, mode, activation, isTest, webhookData) {
    return ((workflow, node) => {
        const that = {
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode);
                });
            },
            getMode: () => {
                return mode;
            },
            getActivationMode: () => {
                return activation;
            },
            getNode: () => {
                return getNode(node);
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                const runExecutionData = null;
                const itemIndex = 0;
                const runIndex = 0;
                const connectionInputData = [];
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), undefined, fallbackValue);
            },
            getNodeWebhookUrl: (name) => {
                return getNodeWebhookUrl(name, workflow, node, additionalData, mode, additionalData.timezone, getAdditionalKeys(additionalData), isTest);
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getWebhookName() {
                if (webhookData === undefined) {
                    throw new Error('Is only supported in webhook functions!');
                }
                return webhookData.webhookDescription.name;
            },
            getWebhookDescription(name) {
                return getWebhookDescription(name, workflow, node);
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            helpers: {
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
            },
        };
        return that;
    })(workflow, node);
}
exports.getExecuteHookFunctions = getExecuteHookFunctions;
/**
 * Returns the execute functions regular nodes have access to when webhook-function is defined.
 *
 * @export
 * @param {Workflow} workflow
 * @param {IRunExecutionData} runExecutionData
 * @param {INode} node
 * @param {IWorkflowExecuteAdditionalData} additionalData
 * @param {WorkflowExecuteMode} mode
 * @returns {IWebhookFunctions}
 */
function getExecuteWebhookFunctions(workflow, node, additionalData, mode, webhookData) {
    return ((workflow, node) => {
        return {
            getBodyData() {
                if (additionalData.httpRequest === undefined) {
                    throw new Error('Request is missing!');
                }
                return additionalData.httpRequest.body;
            },
            getCredentials(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getCredentials(workflow, node, type, additionalData, mode);
                });
            },
            getHeaderData() {
                if (additionalData.httpRequest === undefined) {
                    throw new Error('Request is missing!');
                }
                return additionalData.httpRequest.headers;
            },
            getMode: () => {
                return mode;
            },
            getNode: () => {
                return getNode(node);
            },
            getNodeParameter: (parameterName, fallbackValue) => {
                const runExecutionData = null;
                const itemIndex = 0;
                const runIndex = 0;
                const connectionInputData = [];
                return getNodeParameter(workflow, runExecutionData, runIndex, connectionInputData, node, parameterName, itemIndex, mode, additionalData.timezone, getAdditionalKeys(additionalData), undefined, fallbackValue);
            },
            getParamsData() {
                if (additionalData.httpRequest === undefined) {
                    throw new Error('Request is missing!');
                }
                return additionalData.httpRequest.params;
            },
            getQueryData() {
                if (additionalData.httpRequest === undefined) {
                    throw new Error('Request is missing!');
                }
                return additionalData.httpRequest.query;
            },
            getRequestObject() {
                if (additionalData.httpRequest === undefined) {
                    throw new Error('Request is missing!');
                }
                return additionalData.httpRequest;
            },
            getResponseObject() {
                if (additionalData.httpResponse === undefined) {
                    throw new Error('Response is missing!');
                }
                return additionalData.httpResponse;
            },
            getNodeWebhookUrl: (name) => {
                return getNodeWebhookUrl(name, workflow, node, additionalData, mode, additionalData.timezone, getAdditionalKeys(additionalData));
            },
            getTimezone: () => {
                return getTimezone(workflow, additionalData);
            },
            getWorkflow: () => {
                return getWorkflowMetadata(workflow);
            },
            getWorkflowStaticData(type) {
                return workflow.getStaticData(type, node);
            },
            getWebhookName() {
                return webhookData.webhookDescription.name;
            },
            prepareOutputData: n8n_workflow_1.NodeHelpers.prepareOutputData,
            helpers: {
                httpRequest,
                requestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                prepareBinaryData(binaryData, filePath, mimeType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return prepareBinaryData.call(this, binaryData, additionalData.executionId, filePath, mimeType);
                    });
                },
                request: proxyRequestToAxios,
                requestOAuth2(credentialsType, requestOptions, oAuth2Options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth2.call(this, credentialsType, requestOptions, node, additionalData, oAuth2Options);
                    });
                },
                requestOAuth1(credentialsType, requestOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return requestOAuth1.call(this, credentialsType, requestOptions);
                    });
                },
                httpRequestWithAuthentication(credentialsType, requestOptions, additionalCredentialOptions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return httpRequestWithAuthentication.call(this, credentialsType, requestOptions, workflow, node, additionalData, additionalCredentialOptions);
                    });
                },
                returnJsonArray,
            },
        };
    })(workflow, node);
}
exports.getExecuteWebhookFunctions = getExecuteWebhookFunctions;
