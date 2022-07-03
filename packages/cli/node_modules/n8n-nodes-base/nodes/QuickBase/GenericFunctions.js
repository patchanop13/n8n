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
exports.quickbaseApiRequestAllItems = exports.getFieldsObject = exports.quickbaseApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function quickbaseApiRequest(method, resource, body = {}, qs = {}, option = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('quickbaseApi');
        if (!credentials.hostname) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Hostname must be defined');
        }
        if (!credentials.userToken) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'User Token must be defined');
        }
        try {
            const options = {
                headers: {
                    'QB-Realm-Hostname': credentials.hostname,
                    'User-Agent': 'n8n',
                    'Authorization': `QB-USER-TOKEN ${credentials.userToken}`,
                    'Content-Type': 'application/json',
                },
                method,
                body,
                qs,
                uri: `https://api.quickbase.com/v1${resource}`,
                json: true,
            };
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            if (Object.keys(option).length !== 0) {
                Object.assign(options, option);
            }
            //@ts-ignore
            return yield ((_a = this.helpers) === null || _a === void 0 ? void 0 : _a.request(options));
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.quickbaseApiRequest = quickbaseApiRequest;
//@ts-ignore
function getFieldsObject(tableId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fieldsLabelKey = {};
        const fieldsIdKey = {};
        const data = yield quickbaseApiRequest.call(this, 'GET', '/fields', {}, { tableId });
        for (const field of data) {
            fieldsLabelKey[field.label] = field.id;
            fieldsIdKey[field.id] = field.label;
        }
        return { fieldsLabelKey, fieldsIdKey };
    });
}
exports.getFieldsObject = getFieldsObject;
function quickbaseApiRequestAllItems(method, resource, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData = [];
        if (method === 'POST') {
            body.options = {
                skip: 0,
                top: 100,
            };
        }
        else {
            query.skip = 0;
            query.top = 100;
        }
        let metadata;
        do {
            const { data, fields, metadata: meta } = yield quickbaseApiRequest.call(this, method, resource, body, query);
            metadata = meta;
            const fieldsIdKey = {};
            for (const field of fields) {
                fieldsIdKey[field.id] = field.label;
            }
            for (const record of data) {
                const data = {};
                for (const [key, value] of Object.entries(record)) {
                    data[fieldsIdKey[key]] = value.value;
                }
                responseData.push(data);
            }
            if (method === 'POST') {
                body.options.skip += body.options.top;
            }
            else {
                //@ts-ignore
                query.skip += query.top;
            }
            returnData.push.apply(returnData, responseData);
            responseData = [];
        } while (returnData.length < metadata.totalRecords);
        return returnData;
    });
}
exports.quickbaseApiRequestAllItems = quickbaseApiRequestAllItems;
