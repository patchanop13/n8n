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
exports.createDataFromParameters = exports.cockpitApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function cockpitApiRequest(method, resource, body = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('cockpitApi');
        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            qs: {
                token: credentials.accessToken,
            },
            body,
            uri: uri || `${credentials.url}/api${resource}`,
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
exports.cockpitApiRequest = cockpitApiRequest;
function createDataFromParameters(itemIndex) {
    const dataFieldsAreJson = this.getNodeParameter('jsonDataFields', itemIndex);
    if (dataFieldsAreJson) {
        // Parameters are defined as JSON
        return JSON.parse(this.getNodeParameter('dataFieldsJson', itemIndex, '{}'));
    }
    // Parameters are defined in UI
    const uiDataFields = this.getNodeParameter('dataFieldsUi', itemIndex, {});
    const unpacked = {};
    if (uiDataFields.field === undefined) {
        return unpacked;
    }
    for (const field of uiDataFields.field) {
        unpacked[field.name] = field.value;
    }
    return unpacked;
}
exports.createDataFromParameters = createDataFromParameters;
