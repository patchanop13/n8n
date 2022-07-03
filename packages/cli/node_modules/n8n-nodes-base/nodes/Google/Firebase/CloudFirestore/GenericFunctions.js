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
exports.documentToJson = exports.fullDocumentToJson = exports.jsonToDocument = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function googleApiRequest(method, resource, body = {}, qs = {}, uri = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            qsStringifyOptions: {
                arrayFormat: 'repeat',
            },
            uri: uri || `https://firestore.googleapis.com/v1/projects${resource}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'googleFirebaseCloudFirestoreOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, uri = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.pageSize = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query, uri);
            query.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
const isValidDate = (str) => (0, moment_timezone_1.default)(str, ['YYYY-MM-DD HH:mm:ss Z', moment_timezone_1.default.ISO_8601], true).isValid();
// Both functions below were taken from Stack Overflow jsonToDocument was fixed as it was unable to handle null values correctly
// https://stackoverflow.com/questions/62246410/how-to-convert-a-firestore-document-to-plain-json-and-vice-versa
// Great thanks to https://stackoverflow.com/users/3915246/mahindar
function jsonToDocument(value) {
    if (value === 'true' || value === 'false' || typeof value === 'boolean') {
        return { 'booleanValue': value };
    }
    else if (value === null) {
        return { 'nullValue': null };
    }
    else if (!isNaN(value)) {
        if (value.toString().indexOf('.') !== -1) {
            return { 'doubleValue': value };
        }
        else {
            return { 'integerValue': value };
        }
    }
    else if (isValidDate(value)) {
        const date = new Date(Date.parse(value));
        return { 'timestampValue': date.toISOString() };
    }
    else if (typeof value === 'string') {
        return { 'stringValue': value };
    }
    else if (value && value.constructor === Array) {
        return { 'arrayValue': { values: value.map(v => jsonToDocument(v)) } };
    }
    else if (typeof value === 'object') {
        const obj = {};
        for (const o of Object.keys(value)) {
            //@ts-ignore
            obj[o] = jsonToDocument(value[o]);
        }
        return { 'mapValue': { fields: obj } };
    }
    return {};
}
exports.jsonToDocument = jsonToDocument;
function fullDocumentToJson(data) {
    if (data === undefined) {
        return data;
    }
    return Object.assign({ _name: data.name, _id: data.id, _createTime: data.createTime, _updateTime: data.updateTime }, documentToJson(data.fields));
}
exports.fullDocumentToJson = fullDocumentToJson;
function documentToJson(fields) {
    if (fields === undefined)
        return {};
    const result = {};
    for (const f of Object.keys(fields)) {
        const key = f, value = fields[f], isDocumentType = ['stringValue', 'booleanValue', 'doubleValue',
            'integerValue', 'timestampValue', 'mapValue', 'arrayValue', 'nullValue', 'geoPointValue'].find(t => t === key);
        if (isDocumentType) {
            const item = ['stringValue', 'booleanValue', 'doubleValue', 'integerValue', 'timestampValue', 'nullValue', 'geoPointValue']
                .find(t => t === key);
            if (item) {
                return value;
            }
            else if ('mapValue' === key) {
                //@ts-ignore
                return documentToJson(value.fields || {});
            }
            else if ('arrayValue' === key) {
                // @ts-ignore
                const list = value.values;
                // @ts-ignore
                return !!list ? list.map(l => documentToJson(l)) : [];
            }
        }
        else {
            // @ts-ignore
            result[key] = documentToJson(value);
        }
    }
    return result;
}
exports.documentToJson = documentToJson;
