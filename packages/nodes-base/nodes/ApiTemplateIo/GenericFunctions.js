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
exports.downloadImage = exports.validateJSON = exports.loadResource = exports.apiTemplateIoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function apiTemplateIoApiRequest(method, endpoint, qs = {}, body = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield this.getCredentials('apiTemplateIoApi');
        const options = {
            headers: {
                'user-agent': 'n8n',
                Accept: 'application/json',
                'X-API-KEY': `${apiKey}`,
            },
            uri: `https://api.apitemplate.io/v1${endpoint}`,
            method,
            qs,
            body,
            followRedirect: true,
            followAllRedirects: true,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            const response = yield this.helpers.request(options);
            if (response.status === 'error') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response.message);
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiTemplateIoApiRequest = apiTemplateIoApiRequest;
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const target = resource === 'image' ? ['JPEG', 'PNG'] : ['PDF'];
        const templates = yield apiTemplateIoApiRequest.call(this, 'GET', '/list-templates');
        const filtered = templates.filter(({ format }) => target.includes(format));
        return filtered.map(({ format, name, id }) => ({
            name: `${name} (${format})`,
            value: id,
        }));
    });
}
exports.loadResource = loadResource;
function validateJSON(json) {
    let result;
    if (typeof json === 'object') {
        return json;
    }
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
exports.validateJSON = validateJSON;
function downloadImage(url) {
    return this.helpers.request({
        uri: url,
        method: 'GET',
        json: false,
        encoding: null,
    });
}
exports.downloadImage = downloadImage;
