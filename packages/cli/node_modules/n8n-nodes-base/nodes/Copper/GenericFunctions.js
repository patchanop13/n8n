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
exports.copperApiRequestAllItems = exports.handleListing = exports.adjustTaskFields = exports.adjustPersonFields = exports.adjustLeadFields = exports.adjustCompanyFields = exports.adjustEmail = exports.adjustProjectIds = exports.adjustEmails = exports.adjustPhoneNumbers = exports.adjustAddress = exports.getAutomaticSecret = exports.copperApiRequest = void 0;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
/**
 * Make an authenticated API request to Copper.
 */
function copperApiRequest(method, resource, body = {}, qs = {}, uri = '', option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('copperApi');
        let options = {
            headers: {
                'X-PW-AccessToken': credentials.apiKey,
                'X-PW-Application': 'developer_api',
                'X-PW-UserEmail': credentials.email,
                'Content-Type': 'application/json',
            },
            method,
            qs,
            body,
            uri: uri || `https://api.prosperworks.com/developer_api/v1${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
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
exports.copperApiRequest = copperApiRequest;
/**
 * Creates a secret from the credentials
 *
 * @export
 * @param {ICredentialDataDecryptedObject} credentials
 * @returns
 */
function getAutomaticSecret(credentials) {
    const data = `${credentials.email},${credentials.apiKey}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
exports.getAutomaticSecret = getAutomaticSecret;
function adjustAddress(fixedCollection) {
    if (!fixedCollection.address)
        return fixedCollection;
    const adjusted = (0, lodash_1.omit)(fixedCollection, ['address']);
    if (fixedCollection.address) {
        adjusted.address = fixedCollection.address.addressFields;
    }
    return adjusted;
}
exports.adjustAddress = adjustAddress;
function adjustPhoneNumbers(fixedCollection) {
    if (!fixedCollection.phone_numbers)
        return fixedCollection;
    const adjusted = (0, lodash_1.omit)(fixedCollection, ['phone_numbers']);
    if (fixedCollection.phone_numbers) {
        adjusted.phone_numbers = fixedCollection.phone_numbers.phoneFields;
    }
    return adjusted;
}
exports.adjustPhoneNumbers = adjustPhoneNumbers;
function adjustEmails(fixedCollection) {
    if (!fixedCollection.emails)
        return fixedCollection;
    const adjusted = (0, lodash_1.omit)(fixedCollection, ['emails']);
    if (fixedCollection.emails) {
        adjusted.emails = fixedCollection.emails.emailFields;
    }
    return adjusted;
}
exports.adjustEmails = adjustEmails;
function adjustProjectIds(fields) {
    if (!fields.project_ids)
        return fields;
    const adjusted = (0, lodash_1.omit)(fields, ['project_ids']);
    adjusted.project_ids = fields.project_ids.includes(',')
        ? fields.project_ids.split(',')
        : [fields.project_ids];
    return adjusted;
}
exports.adjustProjectIds = adjustProjectIds;
function adjustEmail(fixedCollection) {
    if (!fixedCollection.email)
        return fixedCollection;
    const adjusted = (0, lodash_1.omit)(fixedCollection, ['email']);
    if (fixedCollection.email) {
        adjusted.email = fixedCollection.email.emailFields;
    }
    return adjusted;
}
exports.adjustEmail = adjustEmail;
exports.adjustCompanyFields = (0, lodash_1.flow)(adjustAddress, adjustPhoneNumbers);
exports.adjustLeadFields = (0, lodash_1.flow)(exports.adjustCompanyFields, adjustEmail);
exports.adjustPersonFields = (0, lodash_1.flow)(exports.adjustCompanyFields, adjustEmails);
exports.adjustTaskFields = (0, lodash_1.flow)(exports.adjustLeadFields, adjustProjectIds);
/**
 * Handle a Copper listing by returning all items or up to a limit.
 */
function handleListing(method, endpoint, qs = {}, body = {}, uri = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        const returnAll = this.getNodeParameter('returnAll', 0);
        const option = { resolveWithFullResponse: true };
        if (returnAll) {
            return yield copperApiRequestAllItems.call(this, method, endpoint, body, qs, uri, option);
        }
        const limit = this.getNodeParameter('limit', 0);
        responseData = yield copperApiRequestAllItems.call(this, method, endpoint, body, qs, uri, option);
        return responseData.slice(0, limit);
    });
}
exports.handleListing = handleListing;
/**
 * Make an authenticated API request to Copper and return all items.
 */
function copperApiRequestAllItems(method, resource, body = {}, qs = {}, uri = '', option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        qs.page_size = 200;
        let totalItems = 0;
        const returnData = [];
        do {
            responseData = yield copperApiRequest.call(this, method, resource, body, qs, uri, option);
            totalItems = responseData.headers['x-pw-total'];
            returnData.push(...responseData.body);
        } while (totalItems > returnData.length);
        return returnData;
    });
}
exports.copperApiRequestAllItems = copperApiRequestAllItems;
