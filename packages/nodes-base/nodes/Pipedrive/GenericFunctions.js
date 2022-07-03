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
exports.sortOptionParameters = exports.pipedriveResolveCustomProperties = exports.pipedriveEncodeCustomProperties = exports.pipedriveGetCustomProperties = exports.pipedriveApiRequestAllItems = exports.pipedriveApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Pipedrive
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function pipedriveApiRequest(method, endpoint, body, query = {}, formData, downloadFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {
                Accept: 'application/json',
            },
            method,
            qs: query,
            uri: `https://api.pipedrive.com/v1${endpoint}`,
        };
        if (downloadFile === true) {
            options.encoding = null;
        }
        else {
            options.json = true;
        }
        if (Object.keys(body).length !== 0) {
            options.body = body;
        }
        if (formData !== undefined && Object.keys(formData).length !== 0) {
            options.formData = formData;
        }
        if (query === undefined) {
            query = {};
        }
        try {
            const credentialType = authenticationMethod === 'apiToken' ? 'pipedriveApi' : 'pipedriveOAuth2Api';
            const responseData = yield this.helpers.requestWithAuthentication.call(this, credentialType, options);
            if (downloadFile === true) {
                return {
                    data: responseData,
                };
            }
            if (responseData.success === false) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
            }
            return {
                additionalData: responseData.additional_data,
                data: (responseData.data === null) ? [] : responseData.data,
            };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.pipedriveApiRequest = pipedriveApiRequest;
/**
 * Make an API request to paginated Pipedrive endpoint
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
function pipedriveApiRequestAllItems(method, endpoint, body, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query === undefined) {
            query = {};
        }
        query.limit = 100;
        query.start = 0;
        const returnData = [];
        let responseData;
        do {
            responseData = yield pipedriveApiRequest.call(this, method, endpoint, body, query);
            // the search path returns data diferently
            if (responseData.data.items) {
                returnData.push.apply(returnData, responseData.data.items);
            }
            else {
                returnData.push.apply(returnData, responseData.data);
            }
            query.start = responseData.additionalData.pagination.next_start;
        } while (responseData.additionalData !== undefined &&
            responseData.additionalData.pagination !== undefined &&
            responseData.additionalData.pagination.more_items_in_collection === true);
        return {
            data: returnData,
        };
    });
}
exports.pipedriveApiRequestAllItems = pipedriveApiRequestAllItems;
/**
 * Gets the custom properties from Pipedrive
 *
 * @export
 * @param {(IHookFunctions | IExecuteFunctions)} this
 * @param {string} resource
 * @returns {Promise<ICustomProperties>}
 */
function pipedriveGetCustomProperties(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = {
            'activity': '/activityFields',
            'deal': '/dealFields',
            'organization': '/organizationFields',
            'person': '/personFields',
            'product': '/productFields',
        };
        if (endpoints[resource] === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not supported for resolving custom values!`);
        }
        const requestMethod = 'GET';
        const body = {};
        const qs = {};
        // Get the custom properties and their values
        const responseData = yield pipedriveApiRequest.call(this, requestMethod, endpoints[resource], body, qs);
        const customProperties = {};
        for (const customPropertyData of responseData.data) {
            customProperties[customPropertyData.key] = customPropertyData;
        }
        return customProperties;
    });
}
exports.pipedriveGetCustomProperties = pipedriveGetCustomProperties;
/**
 * Converts names and values of custom properties from their actual values to the
 * Pipedrive internal ones
 *
 * @export
 * @param {ICustomProperties} customProperties
 * @param {IDataObject} item
 */
function pipedriveEncodeCustomProperties(customProperties, item) {
    let customPropertyData;
    for (const key of Object.keys(item)) {
        customPropertyData = Object.values(customProperties).find(customPropertyData => customPropertyData.name === key);
        if (customPropertyData !== undefined) {
            // Is a custom property
            // Check if also the value has to be resolved or just the key
            if (item[key] !== null && item[key] !== undefined && customPropertyData.options !== undefined && Array.isArray(customPropertyData.options)) {
                // Has an option key so get the actual option-value
                const propertyOption = customPropertyData.options.find(option => option.label.toString() === item[key].toString());
                if (propertyOption !== undefined) {
                    item[customPropertyData.key] = propertyOption.id;
                    delete item[key];
                }
            }
            else {
                // Does already represent the actual value or is null
                item[customPropertyData.key] = item[key];
                delete item[key];
            }
        }
    }
}
exports.pipedriveEncodeCustomProperties = pipedriveEncodeCustomProperties;
/**
 * Converts names and values of custom properties to their actual values
 *
 * @export
 * @param {ICustomProperties} customProperties
 * @param {IDataObject} item
 */
function pipedriveResolveCustomProperties(customProperties, item) {
    let customPropertyData;
    // Itterate over all keys and replace the custom ones
    for (const key of Object.keys(item)) {
        if (customProperties[key] !== undefined) {
            // Is a custom property
            customPropertyData = customProperties[key];
            // value is not set, so nothing to resolve
            if (item[key] === null) {
                item[customPropertyData.name] = item[key];
                delete item[key];
                continue;
            }
            if ([
                'date',
                'address',
                'double',
                'monetary',
                'org',
                'people',
                'phone',
                'text',
                'time',
                'user',
                'varchar',
                'varchar_auto',
                'int',
                'time',
                'timerange',
            ].includes(customPropertyData.field_type)) {
                item[customPropertyData.name] = item[key];
                delete item[key];
                // type options
            }
            else if (['enum', 'visible_to'].includes(customPropertyData.field_type) && customPropertyData.options) {
                const propertyOption = customPropertyData.options.find(option => option.id.toString() === item[key].toString());
                if (propertyOption !== undefined) {
                    item[customPropertyData.name] = propertyOption.label;
                    delete item[key];
                }
                // type multioptions
            }
            else if (['set'].includes(customPropertyData.field_type) && customPropertyData.options) {
                const selectedIds = item[key].split(',');
                const selectedLabels = customPropertyData.options.
                    filter(option => selectedIds.includes(option.id.toString())).
                    map(option => option.label);
                item[customPropertyData.name] = selectedLabels;
                delete item[key];
            }
        }
    }
}
exports.pipedriveResolveCustomProperties = pipedriveResolveCustomProperties;
function sortOptionParameters(optionParameters) {
    optionParameters.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        return 0;
    });
    return optionParameters;
}
exports.sortOptionParameters = sortOptionParameters;
