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
exports.SIGNL4ApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to SIGNL4
 *
 * @param {IHookFunctions | IExecuteFunctions} this
 * @param {string} method
 * @param {string} contentType
 * @param {string} body
 * @param {object} query
 * @param {string} teamSecret
 * @param {object} options
 * @returns {Promise<any>}
 *
 */
function SIGNL4ApiRequest(method, body, query = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('signl4Api');
        const teamSecret = credentials === null || credentials === void 0 ? void 0 : credentials.teamSecret;
        let options = {
            headers: {
                'Accept': '*/*',
            },
            method,
            body,
            qs: query,
            uri: `https://connect.signl4.com/webhook/${teamSecret}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(query).length) {
            delete options.qs;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.SIGNL4ApiRequest = SIGNL4ApiRequest;
