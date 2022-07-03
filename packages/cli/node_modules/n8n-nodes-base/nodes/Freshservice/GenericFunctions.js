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
exports.adjustAddress = exports.toArray = exports.validateUpdateFields = exports.formatFilters = exports.adjustAgentRoles = exports.sanitizeAssignmentScopeGroup = exports.validateAssignmentScopeGroup = exports.toUserOptions = exports.toOptions = exports.handleListing = exports.freshserviceApiRequestAllItems = exports.freshserviceApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function freshserviceApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, domain } = yield this.getCredentials('freshserviceApi');
        const encodedApiKey = Buffer.from(`${apiKey}:X`).toString('base64');
        const options = {
            headers: {
                Authorization: `Basic ${encodedApiKey}`,
            },
            method,
            body,
            qs,
            uri: `https://${domain}.freshservice.com/api/v2${endpoint}`,
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
            if (error.error.description === 'Validation failed') {
                const numberOfErrors = error.error.errors.length;
                const message = 'Please check your parameters';
                if (numberOfErrors === 1) {
                    const [validationError] = error.error.errors;
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                        message,
                        description: `For ${validationError.field}: ${validationError.message}`,
                    });
                }
                else if (numberOfErrors > 1) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                        message,
                        description: 'For more information, expand \'details\' below and look at \'cause\' section',
                    });
                }
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.freshserviceApiRequest = freshserviceApiRequest;
function freshserviceApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        qs.page = 1;
        let items;
        do {
            const responseData = yield freshserviceApiRequest.call(this, method, endpoint, body, qs);
            const key = Object.keys(responseData)[0];
            items = responseData[key];
            if (!items.length)
                return returnData;
            returnData.push(...items);
            qs.page++;
        } while (items.length >= 30);
        return returnData;
    });
}
exports.freshserviceApiRequestAllItems = freshserviceApiRequestAllItems;
function handleListing(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (returnAll) {
            return yield freshserviceApiRequestAllItems.call(this, method, endpoint, body, qs);
        }
        const responseData = yield freshserviceApiRequestAllItems.call(this, method, endpoint, body, qs);
        const limit = this.getNodeParameter('limit', 0);
        return responseData.slice(0, limit);
    });
}
exports.handleListing = handleListing;
const toOptions = (loadedResources) => {
    return loadedResources
        .map(({ id, name }) => ({ value: id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
};
exports.toOptions = toOptions;
const toUserOptions = (loadedUsers) => {
    return loadedUsers
        .map(({ id, last_name, first_name }) => {
        return {
            value: id,
            name: last_name ? `${last_name}, ${first_name}` : `${first_name}`,
        };
    })
        .sort((a, b) => a.name.localeCompare(b.name));
};
exports.toUserOptions = toUserOptions;
/**
 * Ensure at least one role has been specified.
 */
function validateAssignmentScopeGroup(roles) {
    var _a;
    if (!((_a = roles.roleProperties) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please specify a role for the agent to create.');
    }
}
exports.validateAssignmentScopeGroup = validateAssignmentScopeGroup;
function sanitizeAssignmentScopeGroup(roles) {
    roles.roleProperties.forEach(roleProperty => {
        var _a;
        if (roleProperty.assignment_scope === 'specified_groups' && !((_a = roleProperty === null || roleProperty === void 0 ? void 0 : roleProperty.groups) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please specify a group for every role of the agent to create.');
        }
        // remove the `groups` param, only needed for scopes other than `specified_groups`
        if (roleProperty.assignment_scope !== 'specified_groups' && roleProperty.groups) {
            delete roleProperty.groups;
        }
    });
}
exports.sanitizeAssignmentScopeGroup = sanitizeAssignmentScopeGroup;
/**
 * Adjust a roles fixed collection into the format expected by Freshservice API.
 */
function adjustAgentRoles(roles) {
    return {
        roles: roles.roleProperties.map(({ role, assignment_scope, groups }) => {
            return {
                role_id: role,
                assignment_scope,
                groups,
            };
        }),
    };
}
exports.adjustAgentRoles = adjustAgentRoles;
function formatFilters(filters) {
    const query = Object.keys(filters).map(key => {
        const value = filters[key];
        if (!isNaN(Number(value))) {
            return `${key}:${filters[key]}`; // number
        }
        if (typeof value === 'string' && value.endsWith('Z')) {
            return `${key}:'${value.split('T')[0]}'`; // date
        }
        return `${key}:'${filters[key]}'`; // string
    }).join(' AND ');
    return {
        query: `"${query}"`,
    };
}
exports.formatFilters = formatFilters;
function validateUpdateFields(updateFields, resource) {
    var _a;
    if (!Object.keys(updateFields).length) {
        const twoWordResources = {
            agentGroup: 'agent group',
            agentRole: 'agent role',
            assetType: 'asset type',
            requesterGroup: 'requester group',
        };
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${(_a = twoWordResources[resource]) !== null && _a !== void 0 ? _a : resource}.`);
    }
}
exports.validateUpdateFields = validateUpdateFields;
const toArray = (str) => str.split(',').map(e => e.trim());
exports.toArray = toArray;
function adjustAddress(fixedCollection) {
    if (!fixedCollection.address)
        return fixedCollection;
    const adjusted = (0, lodash_1.omit)(fixedCollection, ['address']);
    adjusted.address = fixedCollection.address.addressFields;
    return adjusted;
}
exports.adjustAddress = adjustAddress;
