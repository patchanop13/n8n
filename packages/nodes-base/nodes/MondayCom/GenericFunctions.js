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
exports.mondayComApiRequestAllItems = exports.mondayComApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function mondayComApiRequest(body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const endpoint = 'https://api.monday.com/v2/';
        let options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body,
            uri: endpoint,
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('mondayComApi');
                options.headers = { Authorization: `Bearer ${credentials.apiToken}` };
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'mondayComOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mondayComApiRequest = mondayComApiRequest;
function mondayComApiRequestAllItems(propertyName, body = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        body.variables.limit = 50;
        body.variables.page = 1;
        do {
            responseData = yield mondayComApiRequest.call(this, body);
            returnData.push.apply(returnData, (0, lodash_1.get)(responseData, propertyName));
            body.variables.page++;
        } while ((0, lodash_1.get)(responseData, propertyName).length > 0);
        return returnData;
    });
}
exports.mondayComApiRequestAllItems = mondayComApiRequestAllItems;
