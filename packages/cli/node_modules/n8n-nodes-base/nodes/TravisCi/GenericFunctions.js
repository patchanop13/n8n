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
exports.travisciApiRequestAllItems = exports.travisciApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const querystring_1 = __importDefault(require("querystring"));
function travisciApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('travisCiApi');
        let options = {
            headers: {
                'Travis-API-Version': '3',
                'Accept': 'application/json',
                'Content-Type': 'application.json',
                'Authorization': `token ${credentials.apiToken}`,
            },
            method,
            qs,
            body,
            uri: uri || `https://api.travis-ci.com${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.travisciApiRequest = travisciApiRequest;
/**
 * Make an API request to paginated TravisCI endpoint
 * and return all results
 */
function travisciApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield travisciApiRequest.call(this, method, resource, body, query);
            const path = (0, lodash_1.get)(responseData, '@pagination.next.@href');
            if (path !== undefined) {
                query = querystring_1.default.parse(path);
            }
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['@pagination']['is_last'] !== true);
        return returnData;
    });
}
exports.travisciApiRequestAllItems = travisciApiRequestAllItems;
