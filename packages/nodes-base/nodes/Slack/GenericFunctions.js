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
exports.validateJSON = exports.slackApiRequestAllItems = exports.slackApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = __importDefault(require("lodash"));
function slackApiRequest(method, resource, body = {}, query = {}, headers = undefined, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken');
        let options = {
            method,
            headers: headers || {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body,
            qs: query,
            uri: `https://slack.com/api${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        const oAuth2Options = {
            tokenType: 'Bearer',
            property: 'authed_user.access_token',
        };
        try {
            let response; // tslint:disable-line:no-any
            const credentialType = authenticationMethod === 'accessToken' ? 'slackApi' : 'slackOAuth2Api';
            response = yield this.helpers.requestWithAuthentication.call(this, credentialType, options, { oauth2: oAuth2Options });
            if (response.ok === false) {
                if (response.error === 'paid_teams_only') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Your current Slack plan does not include the resource '${this.getNodeParameter('resource', 0)}'`, {
                        description: `Hint: Upgrate to the Slack plan that includes the funcionality you want to use.`,
                    });
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Slack error response: ' + JSON.stringify(response));
            }
            return response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.slackApiRequest = slackApiRequest;
function slackApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        //if the endpoint uses legacy pagination use count
        //https://api.slack.com/docs/pagination#classic
        if (endpoint.includes('files.list')) {
            query.count = 100;
        }
        else {
            query.limit = 100;
        }
        do {
            responseData = yield slackApiRequest.call(this, method, endpoint, body, query);
            query.cursor = lodash_1.default.get(responseData, 'response_metadata.next_cursor');
            query.page++;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while ((responseData.response_metadata !== undefined &&
            responseData.response_metadata.next_cursor !== undefined &&
            responseData.response_metadata.next_cursor !== '' &&
            responseData.response_metadata.next_cursor !== null) ||
            (responseData.paging !== undefined &&
                responseData.paging.pages !== undefined &&
                responseData.paging.page !== undefined &&
                responseData.paging.page < responseData.paging.pages));
        return returnData;
    });
}
exports.slackApiRequestAllItems = slackApiRequestAllItems;
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
