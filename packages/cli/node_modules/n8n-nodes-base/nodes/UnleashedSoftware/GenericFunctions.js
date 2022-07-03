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
exports.convertNETDates = exports.unleashedApiRequestAllItems = exports.unleashedApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
const qs_1 = __importDefault(require("qs"));
function unleashedApiRequest(method, path, body = {}, query = {}, pageNumber, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const paginatedPath = pageNumber ? `/${path}/${pageNumber}` : `/${path}`;
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            qs: query,
            body,
            url: `https://api.unleashedsoftware.com/${paginatedPath}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        const credentials = yield this.getCredentials('unleashedSoftwareApi');
        const signature = (0, crypto_1.createHmac)('sha256', credentials.apiKey)
            .update(qs_1.default.stringify(query))
            .digest('base64');
        options.headers = Object.assign({}, headers, {
            'api-auth-id': credentials.apiId,
            'api-auth-signature': signature,
        });
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.unleashedApiRequest = unleashedApiRequest;
function unleashedApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let pageNumber = 1;
        query.pageSize = 1000;
        do {
            responseData = yield unleashedApiRequest.call(this, method, endpoint, body, query, pageNumber);
            returnData.push.apply(returnData, responseData[propertyName]);
            pageNumber++;
        } while (responseData.Pagination.PageNumber < responseData.Pagination.NumberOfPages);
        return returnData;
    });
}
exports.unleashedApiRequestAllItems = unleashedApiRequestAllItems;
//.NET code is serializing dates in the following format: "/Date(1586833770780)/"
//which is useless on JS side and could not treated as a date for other nodes
//so we need to convert all of the fields that has it.
function convertNETDates(item) {
    Object.keys(item).forEach(path => {
        const type = typeof item[path];
        if (type === 'string') {
            const value = item[path];
            const a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                item[path] = new Date(+a[1]);
            }
        }
        if (type === 'object' && item[path]) {
            convertNETDates(item[path]);
        }
    });
}
exports.convertNETDates = convertNETDates;
