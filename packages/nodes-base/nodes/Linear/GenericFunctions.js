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
exports.sort = exports.validateCredentials = exports.linearApiRequestAllItems = exports.capitalizeFirstLetter = exports.linearApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_get_1 = __importDefault(require("lodash.get"));
const Queries_1 = require("./Queries");
function linearApiRequest(body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('linearApi');
        const endpoint = 'https://api.linear.app/graphql';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: credentials.apiKey,
            },
            method: 'POST',
            body,
            uri: endpoint,
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.linearApiRequest = linearApiRequest;
function capitalizeFirstLetter(data) {
    return data.charAt(0).toUpperCase() + data.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function linearApiRequestAllItems(propertyName, body = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        body.variables.first = 50;
        body.variables.after = null;
        do {
            responseData = yield linearApiRequest.call(this, body);
            returnData.push.apply(returnData, (0, lodash_get_1.default)(responseData, `${propertyName}.nodes`));
            body.variables.after = (0, lodash_get_1.default)(responseData, `${propertyName}.pageInfo.endCursor`);
        } while ((0, lodash_get_1.default)(responseData, `${propertyName}.pageInfo.hasNextPage`));
        return returnData;
    });
}
exports.linearApiRequestAllItems = linearApiRequestAllItems;
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: credentials.apiKey,
            },
            method: 'POST',
            body: {
                query: Queries_1.query.getIssues(),
                variables: {
                    first: 1,
                },
            },
            uri: 'https://api.linear.app/graphql',
            json: true,
        };
        return this.helpers.request(options);
    });
}
exports.validateCredentials = validateCredentials;
//@ts-ignore
const sort = (a, b) => {
    if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
    }
    if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
    }
    return 0;
};
exports.sort = sort;
