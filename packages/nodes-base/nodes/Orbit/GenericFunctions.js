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
exports.resolveMember = exports.resolveIdentities = exports.orbitApiRequestAllItems = exports.orbitApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function orbitApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = yield this.getCredentials('orbitApi');
            let options = {
                headers: {
                    Authorization: `Bearer ${credentials.accessToken}`,
                },
                method,
                qs,
                body,
                uri: uri || `https://app.orbit.love/api/v1${resource}`,
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
exports.orbitApiRequest = orbitApiRequest;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
function orbitApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page = 1;
        do {
            responseData = yield orbitApiRequest.call(this, method, resource, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            if (query.resolveIdentities === true) {
                resolveIdentities(responseData);
            }
            if (query.resolveMember === true) {
                resolveMember(responseData);
            }
            query.page++;
            if (query.limit && (returnData.length >= query.limit)) {
                return returnData;
            }
        } while (responseData.data.length !== 0);
        return returnData;
    });
}
exports.orbitApiRequestAllItems = orbitApiRequestAllItems;
function resolveIdentities(responseData) {
    const identities = {};
    for (const data of responseData.included) {
        identities[data.id] = data;
    }
    if (!Array.isArray(responseData.data)) {
        responseData.data = [responseData.data];
    }
    for (let i = 0; i < responseData.data.length; i++) {
        for (let y = 0; y < responseData.data[i].relationships.identities.data.length; y++) {
            //@ts-ignore
            responseData.data[i].relationships.identities.data[y] = identities[responseData.data[i].relationships.identities.data[y].id];
        }
    }
}
exports.resolveIdentities = resolveIdentities;
function resolveMember(responseData) {
    const members = {};
    for (const data of responseData.included) {
        members[data.id] = data;
    }
    if (!Array.isArray(responseData.data)) {
        responseData.data = [responseData.data];
    }
    for (let i = 0; i < responseData.data.length; i++) {
        //@ts-ignore
        responseData.data[i].relationships.member.data = members[responseData.data[i].relationships.member.data.id];
    }
}
exports.resolveMember = resolveMember;
