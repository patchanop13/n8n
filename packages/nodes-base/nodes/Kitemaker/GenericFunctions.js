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
exports.createLoadOptions = exports.kitemakerRequestAllItems = exports.kitemakerRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function kitemakerRequest(body = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { personalAccessToken } = yield this.getCredentials('kitemakerApi');
        const options = {
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
            },
            method: 'POST',
            body,
            uri: 'https://toil.kitemaker.co/developers/graphql',
            json: true,
        };
        const responseData = yield this.helpers.request.call(this, options);
        if (responseData.errors) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
        }
        return responseData;
    });
}
exports.kitemakerRequest = kitemakerRequest;
function kitemakerRequestAllItems(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const [group, items] = getGroupAndItems(resource);
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        const returnData = [];
        let responseData;
        do {
            responseData = yield kitemakerRequest.call(this, body);
            body.variables.cursor = responseData.data[group].cursor;
            returnData.push(...responseData.data[group][items]);
            if (!returnAll && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
        } while (responseData.data[group].hasMore);
        return returnData;
    });
}
exports.kitemakerRequestAllItems = kitemakerRequestAllItems;
function getGroupAndItems(resource) {
    const map = {
        space: { group: 'organization', items: 'spaces' },
        user: { group: 'organization', items: 'users' },
        workItem: { group: 'workItems', items: 'workItems' },
    };
    return [
        map[resource]['group'],
        map[resource]['items'],
    ];
}
function createLoadOptions(resources) {
    return resources.map(option => {
        var _a;
        if (option.username)
            return ({ name: option.username, value: option.id });
        if (option.title)
            return ({ name: option.title, value: option.id });
        return ({ name: (_a = option.name) !== null && _a !== void 0 ? _a : 'Unnamed', value: option.id });
    });
}
exports.createLoadOptions = createLoadOptions;
