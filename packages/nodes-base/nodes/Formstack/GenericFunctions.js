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
exports.getSubmission = exports.getFields = exports.getForms = exports.apiRequestAllItems = exports.apiRequest = exports.FormstackFieldFormat = void 0;
const n8n_workflow_1 = require("n8n-workflow");
var FormstackFieldFormat;
(function (FormstackFieldFormat) {
    FormstackFieldFormat["ID"] = "id";
    FormstackFieldFormat["Label"] = "label";
    FormstackFieldFormat["Name"] = "name";
})(FormstackFieldFormat = exports.FormstackFieldFormat || (exports.FormstackFieldFormat = {}));
/**
 * Make an API request to Formstack
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function apiRequest(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {},
            method,
            body,
            qs: query || {},
            uri: `https://www.formstack.com/api/v2/${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        try {
            if (authenticationMethod === 'accessToken') {
                const credentials = yield this.getCredentials('formstackApi');
                options.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                return yield this.helpers.request(options);
            }
            else {
                return yield this.helpers.requestOAuth2.call(this, 'formstackOAuth2Api', options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
/**
 * Make an API request to paginated Formstack endpoint
 * and return all results
 *
 * @export
 * @param {(IHookFunctions | IExecuteFunctions)} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} body
 * @param {IDataObject} [query]
 * @returns {Promise<any>}
 */
function apiRequestAllItems(method, endpoint, body, dataKey, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query === undefined) {
            query = {};
        }
        query.per_page = 200;
        query.page = 0;
        const returnData = {
            items: [],
        };
        let responseData;
        do {
            query.page += 1;
            responseData = yield apiRequest.call(this, method, endpoint, body, query);
            returnData.items.push.apply(returnData.items, responseData[dataKey]);
        } while (responseData.total !== undefined &&
            Math.ceil(responseData.total / query.per_page) > query.page);
        return returnData;
    });
}
exports.apiRequestAllItems = apiRequestAllItems;
/**
 * Returns all the available forms
 *
 * @export
 * @param {ILoadOptionsFunctions} this
 * @returns {Promise<INodePropertyOptions[]>}
 */
function getForms() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'form.json';
        const responseData = yield apiRequestAllItems.call(this, 'GET', endpoint, {}, 'forms', { folders: false });
        if (responseData.items === undefined) {
            throw new Error('No data got returned');
        }
        const returnData = [];
        for (const baseData of responseData.items) {
            returnData.push({
                name: baseData.name,
                value: baseData.id,
            });
        }
        return returnData;
    });
}
exports.getForms = getForms;
/**
 * Returns all the fields of a form
 *
 * @export
 * @param {ILoadOptionsFunctions} this
 * @param {string} formID
 * @returns {Promise<IFormstackFieldDefinitionType[]>}
 */
function getFields(formID) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `form/${formID}.json`;
        const responseData = yield apiRequestAllItems.call(this, 'GET', endpoint, {}, 'fields');
        if (responseData.items === undefined) {
            throw new Error('No form fields meta data got returned');
        }
        const fields = responseData.items;
        const fieldMap = {};
        fields.forEach(field => {
            fieldMap[field.id] = field;
        });
        return fieldMap;
    });
}
exports.getFields = getFields;
/**
 * Returns all the fields of a form
 *
 * @export
 * @param {ILoadOptionsFunctions} this
 * @param {string} uniqueId
 * @returns {Promise<IFormstackFieldDefinitionType[]>}
 */
function getSubmission(uniqueId) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `submission/${uniqueId}.json`;
        const responseData = yield apiRequestAllItems.call(this, 'GET', endpoint, {}, 'data');
        if (responseData.items === undefined) {
            throw new Error('No form fields meta data got returned');
        }
        return responseData.items;
    });
}
exports.getSubmission = getSubmission;
