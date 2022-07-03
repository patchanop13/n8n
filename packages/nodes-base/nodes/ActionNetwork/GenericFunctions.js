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
exports.simplifyResponse = exports.resourceLoaders = exports.adjustEventPayload = exports.adjustPetitionPayload = exports.adjustPersonPayload = exports.isPrimary = exports.makeOsdiLink = exports.extractId = exports.handleListing = exports.actionNetworkApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function actionNetworkApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            body,
            qs,
            uri: `https://actionnetwork.org/api/v2${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.requestWithAuthentication.call(this, 'actionNetworkApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.actionNetworkApiRequest = actionNetworkApiRequest;
function handleListing(method, endpoint, body = {}, qs = {}, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.perPage = 25; // max
        qs.page = 1;
        const returnAll = (_a = options === null || options === void 0 ? void 0 : options.returnAll) !== null && _a !== void 0 ? _a : this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        const itemsKey = toItemsKey(endpoint);
        do {
            responseData = yield actionNetworkApiRequest.call(this, method, endpoint, body, qs);
            const items = responseData._embedded[itemsKey];
            returnData.push(...items);
            if (!returnAll && returnData.length >= limit) {
                return returnData.slice(0, limit);
            }
            if (responseData._links && responseData._links.next && responseData._links.next.href) {
                const queryString = new URLSearchParams(responseData._links.next.href.split('?')[1]);
                qs.page = queryString.get('page');
            }
        } while (responseData._links && responseData._links.next);
        return returnData;
    });
}
exports.handleListing = handleListing;
// ----------------------------------------
//              helpers
// ----------------------------------------
/**
 * Convert an endpoint to the key needed to access data in the response.
 */
const toItemsKey = (endpoint) => {
    // handle two-resource endpoint
    if (endpoint.includes('/signatures') ||
        endpoint.includes('/attendances') ||
        endpoint.includes('/taggings')) {
        endpoint = endpoint.split('/').pop();
    }
    return `osdi:${endpoint.replace(/\//g, '')}`;
};
const extractId = (response) => {
    var _a;
    return (_a = response._links.self.href.split('/').pop()) !== null && _a !== void 0 ? _a : 'No ID';
};
exports.extractId = extractId;
const makeOsdiLink = (personId) => {
    return {
        _links: {
            'osdi:person': {
                href: `https://actionnetwork.org/api/v2/people/${personId}`,
            },
        },
    };
};
exports.makeOsdiLink = makeOsdiLink;
const isPrimary = (field) => field.primary;
exports.isPrimary = isPrimary;
// ----------------------------------------
//           field adjusters
// ----------------------------------------
function adjustLanguagesSpoken(allFields) {
    if (!allFields.languages_spoken)
        return allFields;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(allFields, ['languages_spoken'])), { languages_spoken: [allFields.languages_spoken] });
}
function adjustPhoneNumbers(allFields) {
    if (!allFields.phone_numbers)
        return allFields;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(allFields, ['phone_numbers'])), { phone_numbers: [
            allFields.phone_numbers.phone_numbers_fields,
        ] });
}
function adjustPostalAddresses(allFields) {
    if (!allFields.postal_addresses)
        return allFields;
    if (allFields.postal_addresses.postal_addresses_fields.length) {
        const adjusted = allFields.postal_addresses.postal_addresses_fields.map((field) => {
            const copy = Object.assign({}, (0, lodash_1.omit)(field, ['address_lines', 'location']));
            if (field.address_lines) {
                copy.address_lines = [field.address_lines];
            }
            if (field.location) {
                copy.location = field.location.location_fields;
            }
            return copy;
        });
        return Object.assign(Object.assign({}, (0, lodash_1.omit)(allFields, ['postal_addresses'])), { postal_addresses: adjusted });
    }
}
function adjustLocation(allFields) {
    if (!allFields.location)
        return allFields;
    const locationFields = allFields.location.postal_addresses_fields;
    const adjusted = Object.assign({}, (0, lodash_1.omit)(locationFields, ['address_lines', 'location']));
    if (locationFields.address_lines) {
        adjusted.address_lines = [locationFields.address_lines];
    }
    if (locationFields.location) {
        adjusted.location = locationFields.location.location_fields;
    }
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(allFields, ['location'])), { location: adjusted });
}
function adjustTargets(allFields) {
    if (!allFields.target)
        return allFields;
    const adjusted = allFields.target.split(',').map(value => ({ name: value }));
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(allFields, ['target'])), { target: adjusted });
}
// ----------------------------------------
//           payload adjusters
// ----------------------------------------
exports.adjustPersonPayload = (0, lodash_1.flow)(adjustLanguagesSpoken, adjustPhoneNumbers, adjustPostalAddresses);
exports.adjustPetitionPayload = adjustTargets;
exports.adjustEventPayload = adjustLocation;
// ----------------------------------------
//           resource loaders
// ----------------------------------------
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield handleListing.call(this, 'GET', `/${resource}`, {}, {}, { returnAll: true });
    });
}
exports.resourceLoaders = {
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield loadResource.call(this, 'tags');
            return tags.map((tag) => ({ name: tag.name, value: (0, exports.extractId)(tag) }));
        });
    },
    getTaggings() {
        return __awaiter(this, void 0, void 0, function* () {
            const tagId = this.getNodeParameter('tagId', 0);
            const endpoint = `/tags/${tagId}/taggings`;
            // two-resource endpoint, so direct call
            const taggings = yield handleListing.call(this, 'GET', endpoint, {}, {}, { returnAll: true });
            return taggings.map((tagging) => {
                const taggingId = (0, exports.extractId)(tagging);
                return {
                    name: taggingId,
                    value: taggingId,
                };
            });
        });
    },
};
// ----------------------------------------
//          response simplifiers
// ----------------------------------------
const simplifyResponse = (response, resource) => {
    if (resource === 'person') {
        return simplifyPersonResponse(response);
    }
    else if (resource === 'petition') {
        return simplifyPetitionResponse(response);
    }
    const fieldsToSimplify = [
        'identifiers',
        '_links',
        'action_network:sponsor',
        'reminders',
    ];
    return Object.assign({ id: (0, exports.extractId)(response) }, (0, lodash_1.omit)(response, fieldsToSimplify));
};
exports.simplifyResponse = simplifyResponse;
const simplifyPetitionResponse = (response) => {
    const fieldsToSimplify = [
        'identifiers',
        '_links',
        'action_network:hidden',
        '_embedded',
    ];
    return Object.assign(Object.assign({ id: (0, exports.extractId)(response) }, (0, lodash_1.omit)(response, fieldsToSimplify)), { creator: simplifyPersonResponse(response._embedded['osdi:creator']) });
};
const simplifyPersonResponse = (response) => {
    var _a;
    const emailAddress = response.email_addresses.filter(exports.isPrimary);
    const phoneNumber = response.phone_numbers.filter(exports.isPrimary);
    const postalAddress = response.postal_addresses.filter(exports.isPrimary);
    const fieldsToSimplify = [
        'identifiers',
        'email_addresses',
        'phone_numbers',
        'postal_addresses',
        'languages_spoken',
        '_links',
    ];
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ id: (0, exports.extractId)(response) }, (0, lodash_1.omit)(response, fieldsToSimplify)), { email_address: emailAddress[0].address || '' }), { phone_number: phoneNumber[0].number || '' }), {
        postal_address: Object.assign(Object.assign({}, postalAddress && (0, lodash_1.omit)(postalAddress[0], 'address_lines')), { address_lines: (_a = postalAddress[0].address_lines) !== null && _a !== void 0 ? _a : '' }),
    }), { language_spoken: response.languages_spoken[0] });
};
