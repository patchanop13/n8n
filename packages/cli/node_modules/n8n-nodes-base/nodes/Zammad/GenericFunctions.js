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
exports.doesNotBelongToZammad = exports.isNotZammadFoundation = exports.getTicketCustomFields = exports.getUserCustomFields = exports.getOrganizationCustomFields = exports.getGroupCustomFields = exports.getTicketFields = exports.getUserFields = exports.getOrganizationFields = exports.getGroupFields = exports.getAllFields = exports.isCustomer = exports.prettifyDisplayName = exports.fieldToLoadOption = exports.throwOnEmptyUpdate = exports.tolerateTrailingSlash = exports.zammadApiRequestAllItems = exports.zammadApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function zammadApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            body,
            qs,
            uri: '',
            json: true,
        };
        const authentication = this.getNodeParameter('authentication', 0);
        if (authentication === 'basicAuth') {
            const credentials = yield this.getCredentials('zammadBasicAuthApi');
            const baseUrl = tolerateTrailingSlash(credentials.baseUrl);
            options.uri = `${baseUrl}/api/v1${endpoint}`;
            options.auth = {
                user: credentials.username,
                pass: credentials.password,
            };
            options.rejectUnauthorized = !credentials.allowUnauthorizedCerts;
        }
        else {
            const credentials = yield this.getCredentials('zammadTokenAuthApi');
            const baseUrl = tolerateTrailingSlash(credentials.baseUrl);
            options.uri = `${baseUrl}/api/v1${endpoint}`;
            options.headers = {
                Authorization: `Token token=${credentials.accessToken}`,
            };
            options.rejectUnauthorized = !credentials.allowUnauthorizedCerts;
        }
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
            if (error.error.error === 'Object already exists!') {
                error.error.error = 'An entity with this name already exists.';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.zammadApiRequest = zammadApiRequest;
function zammadApiRequestAllItems(method, endpoint, body = {}, qs = {}, limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        // https://docs.zammad.org/en/latest/api/intro.html#pagination
        const returnData = [];
        let responseData;
        qs.per_page = 20;
        qs.page = 1;
        do {
            responseData = yield zammadApiRequest.call(this, method, endpoint, body, qs);
            returnData.push(...responseData);
            if (limit && returnData.length > limit) {
                return returnData.slice(0, limit);
            }
            qs.page++;
        } while (responseData.length);
        return returnData;
    });
}
exports.zammadApiRequestAllItems = zammadApiRequestAllItems;
function tolerateTrailingSlash(url) {
    return url.endsWith('/')
        ? url.substr(0, url.length - 1)
        : url;
}
exports.tolerateTrailingSlash = tolerateTrailingSlash;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}`);
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
// ----------------------------------
//        loadOptions utils
// ----------------------------------
const fieldToLoadOption = (i) => {
    return { name: i.display ? (0, exports.prettifyDisplayName)(i.display) : i.name, value: i.name };
};
exports.fieldToLoadOption = fieldToLoadOption;
const prettifyDisplayName = (fieldName) => fieldName.replace('name', ' Name');
exports.prettifyDisplayName = prettifyDisplayName;
const isCustomer = (user) => user.role_ids.includes(3) && !user.email.endsWith('@zammad.org');
exports.isCustomer = isCustomer;
function getAllFields() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zammadApiRequest.call(this, 'GET', '/object_manager_attributes');
    });
}
exports.getAllFields = getAllFields;
const isTypeField = (resource) => (arr) => arr.filter(i => i.object === resource);
exports.getGroupFields = isTypeField('Group');
exports.getOrganizationFields = isTypeField('Organization');
exports.getUserFields = isTypeField('User');
exports.getTicketFields = isTypeField('Ticket');
const getCustomFields = (arr) => arr.filter(i => i.created_by_id !== 1);
exports.getGroupCustomFields = (0, lodash_1.flow)(exports.getGroupFields, getCustomFields);
exports.getOrganizationCustomFields = (0, lodash_1.flow)(exports.getOrganizationFields, getCustomFields);
exports.getUserCustomFields = (0, lodash_1.flow)(exports.getUserFields, getCustomFields);
exports.getTicketCustomFields = (0, lodash_1.flow)(exports.getTicketFields, getCustomFields);
const isNotZammadFoundation = (i) => i.name !== 'Zammad Foundation';
exports.isNotZammadFoundation = isNotZammadFoundation;
const doesNotBelongToZammad = (i) => !i.email.endsWith('@zammad.org') && i.login !== '-';
exports.doesNotBelongToZammad = doesNotBelongToZammad;
