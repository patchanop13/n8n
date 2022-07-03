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
exports.simplifyMontlyMetrics = exports.simplifyDailyMetrics = exports.profitWellApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function profitWellApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = yield this.getCredentials('profitWellApi');
            let options = {
                headers: {
                    'Authorization': credentials.accessToken,
                },
                method,
                qs,
                body,
                uri: uri || `https://api.profitwell.com/v2${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.profitWellApiRequest = profitWellApiRequest;
function simplifyDailyMetrics(responseData) {
    const data = [];
    const keys = Object.keys(responseData);
    const dates = responseData[keys[0]].map(e => e.date);
    for (const [index, date] of dates.entries()) {
        const element = {
            date,
        };
        for (const key of keys) {
            element[key] = responseData[key][index].value;
        }
        data.push(element);
    }
    return data;
}
exports.simplifyDailyMetrics = simplifyDailyMetrics;
function simplifyMontlyMetrics(responseData) {
    const data = {};
    for (const key of Object.keys(responseData)) {
        for (const [index] of responseData[key].entries()) {
            data[key] = responseData[key][index].value;
            data['date'] = responseData[key][index].date;
        }
    }
    return data;
}
exports.simplifyMontlyMetrics = simplifyMontlyMetrics;
