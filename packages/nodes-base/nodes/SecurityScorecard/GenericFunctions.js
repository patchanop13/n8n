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
exports.simplify = exports.scorecardApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function scorecardApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('securityScorecardApi');
        const headerWithAuthentication = { Authorization: `Token ${credentials.apiKey}` };
        let options = {
            headers: headerWithAuthentication,
            method,
            qs: query,
            uri: uri || `https://api.securityscorecard.io/${resource}`,
            body,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            options = Object.assign({}, options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.scorecardApiRequest = scorecardApiRequest;
function simplify(data) {
    const results = [];
    for (const record of data) {
        const newRecord = { date: record.date };
        for (const factor of record.factors) {
            newRecord[factor.name] = factor.score;
        }
        results.push(newRecord);
    }
    return results;
}
exports.simplify = simplify;
