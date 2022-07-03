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
exports.simplify = exports.egoiApiRequestAllItems = exports.egoiApiRequest = exports.getFields = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const fieldCache = {};
function getFields(listId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fieldCache[listId]) {
            return fieldCache[listId];
        }
        fieldCache[listId] = yield egoiApiRequest.call(this, 'GET', `/lists/${listId}/fields`);
        return fieldCache[listId];
    });
}
exports.getFields = getFields;
function egoiApiRequest(method, endpoint, body = {}, qs = {}, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('egoiApi');
        const options = {
            headers: {
                'accept': 'application/json',
                'Apikey': `${credentials.apiKey}`,
            },
            method,
            qs,
            body,
            url: `https://api.egoiapp.com${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
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
exports.egoiApiRequest = egoiApiRequest;
function egoiApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.offset = 0;
        query.count = 500;
        do {
            responseData = yield egoiApiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            query.offset += query.count;
        } while (responseData[propertyName] && responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.egoiApiRequestAllItems = egoiApiRequestAllItems;
function simplify(contacts, listId) {
    return __awaiter(this, void 0, void 0, function* () {
        let fields = yield getFields.call(this, listId);
        fields = fields.filter((element) => element.type === 'extra');
        const fieldsKeyValue = {};
        for (const field of fields) {
            fieldsKeyValue[field.field_id] = field.name;
        }
        const data = [];
        for (const contact of contacts) {
            const extras = contact.extra.reduce((acumulator, currentValue) => {
                const key = fieldsKeyValue[currentValue.field_id];
                return Object.assign({ [key]: currentValue.value }, acumulator);
            }, {});
            data.push(Object.assign(Object.assign(Object.assign({}, contact.base), extras), { tags: contact.tags }));
        }
        return data;
    });
}
exports.simplify = simplify;
