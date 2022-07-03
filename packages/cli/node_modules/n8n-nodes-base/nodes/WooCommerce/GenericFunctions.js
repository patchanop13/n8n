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
exports.adjustMetadata = exports.setFields = exports.toSnakeCase = exports.setMetadata = exports.getAutomaticSecret = exports.woocommerceApiRequestAllItems = exports.woocommerceApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
const change_case_1 = require("change-case");
const lodash_1 = require("lodash");
function woocommerceApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('wooCommerceApi');
        let options = {
            auth: {
                user: credentials.consumerKey,
                password: credentials.consumerSecret,
            },
            method,
            qs,
            body,
            uri: uri || `${credentials.url}/wp-json/wc/v3${resource}`,
            json: true,
        };
        if (credentials.includeCredentialsInQuery === true) {
            delete options.auth;
            Object.assign(qs, { consumer_key: credentials.consumerKey, consumer_secret: credentials.consumerSecret });
        }
        if (!Object.keys(body).length) {
            delete options.form;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.woocommerceApiRequest = woocommerceApiRequest;
function woocommerceApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.per_page = 100;
        do {
            responseData = yield woocommerceApiRequest.call(this, method, endpoint, body, query, uri, { resolveWithFullResponse: true });
            const links = responseData.headers.link.split(',');
            const nextLink = links.find((link) => link.indexOf('rel="next"') !== -1);
            if (nextLink) {
                uri = nextLink.split(';')[0].replace(/<(.*)>/, '$1');
            }
            returnData.push.apply(returnData, responseData.body);
        } while (responseData.headers['link'] !== undefined &&
            responseData.headers['link'].includes('rel="next"'));
        return returnData;
    });
}
exports.woocommerceApiRequestAllItems = woocommerceApiRequestAllItems;
/**
 * Creates a secret from the credentials
 *
 * @export
 * @param {ICredentialDataDecryptedObject} credentials
 * @returns
 */
function getAutomaticSecret(credentials) {
    const data = `${credentials.consumerKey},${credentials.consumerSecret}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
exports.getAutomaticSecret = getAutomaticSecret;
function setMetadata(data) {
    for (let i = 0; i < data.length; i++) {
        //@ts-ignore\
        if (data[i].metadataUi && data[i].metadataUi.metadataValues) {
            //@ts-ignore
            data[i].meta_data = data[i].metadataUi.metadataValues;
            //@ts-ignore
            delete data[i].metadataUi;
        }
        else {
            //@ts-ignore
            delete data[i].metadataUi;
        }
    }
}
exports.setMetadata = setMetadata;
function toSnakeCase(data) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    let remove = false;
    for (let i = 0; i < data.length; i++) {
        for (const key of Object.keys(data[i])) {
            //@ts-ignore
            if (data[i][(0, change_case_1.snakeCase)(key)] === undefined) {
                remove = true;
            }
            //@ts-ignore
            data[i][(0, change_case_1.snakeCase)(key)] = data[i][key];
            if (remove) {
                //@ts-ignore
                delete data[i][key];
                remove = false;
            }
        }
    }
}
exports.toSnakeCase = toSnakeCase;
function setFields(fieldsToSet, body) {
    for (const fields in fieldsToSet) {
        if (fields === 'tags') {
            body['tags'] = fieldsToSet[fields].map(tag => ({ id: parseInt(tag, 10) }));
        }
        else {
            body[(0, change_case_1.snakeCase)(fields.toString())] = fieldsToSet[fields];
        }
    }
}
exports.setFields = setFields;
function adjustMetadata(fields) {
    if (!fields.meta_data)
        return fields;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(fields, ['meta_data'])), { meta_data: fields.meta_data.meta_data_fields });
}
exports.adjustMetadata = adjustMetadata;
