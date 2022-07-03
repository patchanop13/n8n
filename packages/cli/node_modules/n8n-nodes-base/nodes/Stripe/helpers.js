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
exports.handleListing = exports.loadResource = exports.adjustMetadata = exports.adjustCustomerFields = exports.adjustChargeFields = exports.stripeApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
/**
 * Make an API request to Stripe
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function stripeApiRequest(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('stripeApi');
        const options = {
            method,
            auth: {
                user: credentials.secretKey,
            },
            form: body,
            qs: query,
            uri: `https://api.stripe.com/v1${endpoint}`,
            json: true,
        };
        if (options.qs && Object.keys(options.qs).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.stripeApiRequest = stripeApiRequest;
/**
 * Make n8n's charge fields compliant with the Stripe API request object.
 */
exports.adjustChargeFields = (0, lodash_1.flow)([
    adjustShipping,
    adjustMetadata,
]);
/**
 * Make n8n's customer fields compliant with the Stripe API request object.
 */
exports.adjustCustomerFields = (0, lodash_1.flow)([
    adjustShipping,
    adjustAddress,
    adjustMetadata,
]);
/**
 * Convert n8n's address object into a Stripe API request shipping object.
 */
function adjustAddress(addressFields) {
    if (!addressFields.address)
        return addressFields;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(addressFields, ['address'])), { address: addressFields.address.details });
}
/**
 * Convert n8n's `fixedCollection` metadata object into a Stripe API request metadata object.
 */
function adjustMetadata(fields) {
    if (!fields.metadata || (0, lodash_1.isEmpty)(fields.metadata))
        return fields;
    const adjustedMetadata = {};
    fields.metadata.metadataProperties.forEach(pair => {
        adjustedMetadata[pair.key] = pair.value;
    });
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(fields, ['metadata'])), { metadata: adjustedMetadata });
}
exports.adjustMetadata = adjustMetadata;
/**
 * Convert n8n's shipping object into a Stripe API request shipping object.
 */
function adjustShipping(shippingFields) {
    var _a;
    const shippingProperties = (_a = shippingFields.shipping) === null || _a === void 0 ? void 0 : _a.shippingProperties[0];
    if (!(shippingProperties === null || shippingProperties === void 0 ? void 0 : shippingProperties.address) || (0, lodash_1.isEmpty)(shippingProperties.address))
        return shippingFields;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(shippingFields, ['shipping'])), { shipping: Object.assign(Object.assign({}, (0, lodash_1.omit)(shippingProperties, ['address'])), { address: shippingProperties.address.details }) });
}
/**
 * Load a resource so it can be selected by name from a dropdown.
 */
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield stripeApiRequest.call(this, 'GET', `/${resource}s`, {}, {});
        return responseData.data.map(({ name, id }) => ({
            name,
            value: id,
        }));
    });
}
exports.loadResource = loadResource;
/**
 * Handles a Stripe listing by returning all items or up to a limit.
 */
function handleListing(resource, i, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        const returnAll = this.getNodeParameter('returnAll', i);
        const limit = this.getNodeParameter('limit', i, 0);
        do {
            responseData = yield stripeApiRequest.call(this, 'GET', `/${resource}s`, {}, qs);
            returnData.push(...responseData.data);
            if (!returnAll && returnData.length >= limit) {
                return returnData.slice(0, limit);
            }
            qs.starting_after = returnData[returnData.length - 1].id;
        } while (responseData.has_more);
        return returnData;
    });
}
exports.handleListing = handleListing;
