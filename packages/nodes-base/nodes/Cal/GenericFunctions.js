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
exports.sortOptionParameters = exports.calApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function calApiRequest(method, resource, body = {}, query = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('calApi');
        let options = {
            baseURL: credentials.host,
            method,
            body,
            qs: query,
            url: resource,
        };
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.httpRequestWithAuthentication.call(this, 'calApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.calApiRequest = calApiRequest;
function sortOptionParameters(optionParameters) {
    optionParameters.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        return 0;
    });
    return optionParameters;
}
exports.sortOptionParameters = sortOptionParameters;
