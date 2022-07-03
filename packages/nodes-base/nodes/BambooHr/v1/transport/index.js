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
exports.apiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Mattermost
 */
function apiRequest(method, endpoint, body = {}, query = {}, option = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('bambooHrApi');
        //set-up credentials
        const apiKey = credentials.apiKey;
        const subdomain = credentials.subdomain;
        //set-up uri
        const uri = `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1/${endpoint}`;
        const options = {
            method,
            body,
            qs: query,
            url: uri,
            auth: {
                username: apiKey,
                password: 'x',
            },
            json: true,
        };
        if (Object.keys(option).length) {
            Object.assign(options, option);
        }
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        try {
            //@ts-ignore
            return yield this.helpers.request(options);
        }
        catch (error) {
            const description = ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.headers['x-bamboohr-error-messsage']) || '';
            const message = (error === null || error === void 0 ? void 0 : error.message) || '';
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message, description });
        }
    });
}
exports.apiRequest = apiRequest;
