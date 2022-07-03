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
exports.throwOnZeroDefinedFields = exports.parseAutoMappedInputs = exports.parseDefinedFields = exports.parseFilterProperties = exports.parseSortProperties = exports.gristApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function gristApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, planType, customSubdomain, selfHostedUrl, } = yield this.getCredentials('gristApi');
        const gristapiurl = (planType === 'free') ? `https://docs.getgrist.com/api${endpoint}` :
            (planType === 'paid') ? `https://${customSubdomain}.getgrist.com/api${endpoint}` :
                `${selfHostedUrl}/api${endpoint}`;
        const options = {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            method,
            uri: gristapiurl,
            qs,
            body,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.gristApiRequest = gristApiRequest;
function parseSortProperties(sortProperties) {
    return sortProperties.reduce((acc, cur, curIdx) => {
        if (cur.direction === 'desc')
            acc += '-';
        acc += cur.field;
        if (curIdx !== sortProperties.length - 1)
            acc += ',';
        return acc;
    }, '');
}
exports.parseSortProperties = parseSortProperties;
function parseFilterProperties(filterProperties) {
    return filterProperties.reduce((acc, cur) => {
        var _a;
        acc[cur.field] = (_a = acc[cur.field]) !== null && _a !== void 0 ? _a : [];
        const values = isNaN(Number(cur.values)) ? cur.values : Number(cur.values);
        acc[cur.field].push(values);
        return acc;
    }, {});
}
exports.parseFilterProperties = parseFilterProperties;
function parseDefinedFields(fieldsToSendProperties) {
    return fieldsToSendProperties.reduce((acc, cur) => {
        acc[cur.fieldId] = cur.fieldValue;
        return acc;
    }, {});
}
exports.parseDefinedFields = parseDefinedFields;
function parseAutoMappedInputs(incomingKeys, inputsToIgnore, item) {
    return incomingKeys.reduce((acc, curKey) => {
        if (inputsToIgnore.includes(curKey))
            return acc;
        acc = Object.assign(Object.assign({}, acc), { [curKey]: item[curKey] });
        return acc;
    }, {});
}
exports.parseAutoMappedInputs = parseAutoMappedInputs;
function throwOnZeroDefinedFields(fields) {
    if (!(fields === null || fields === void 0 ? void 0 : fields.length)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No defined data found. Please specify the data to send in \'Fields to Send\'.');
    }
}
exports.throwOnZeroDefinedFields = throwOnZeroDefinedFields;
