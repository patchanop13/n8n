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
exports.activeCampaignDefaultGetAllProperties = exports.activeCampaignApiRequestAllItems = exports.activeCampaignApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to ActiveCampaign
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function activeCampaignApiRequest(method, endpoint, body, query, dataKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('activeCampaignApi');
        if (query === undefined) {
            query = {};
        }
        const options = {
            headers: {
                'Api-Token': credentials.apiKey,
            },
            method,
            qs: query,
            uri: `${credentials.apiUrl}${endpoint}`,
            json: true,
        };
        if (Object.keys(body).length !== 0) {
            options.body = body;
        }
        try {
            const responseData = yield this.helpers.request(options);
            if (responseData.success === false) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
            }
            if (dataKey === undefined) {
                return responseData;
            }
            else {
                return responseData[dataKey];
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.activeCampaignApiRequest = activeCampaignApiRequest;
/**
 * Make an API request to paginated ActiveCampaign endpoint
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
function activeCampaignApiRequestAllItems(method, endpoint, body, query, dataKey) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query === undefined) {
            query = {};
        }
        query.limit = 100;
        query.offset = 0;
        const returnData = [];
        let responseData;
        let itemsReceived = 0;
        do {
            responseData = yield activeCampaignApiRequest.call(this, method, endpoint, body, query);
            if (dataKey === undefined) {
                returnData.push.apply(returnData, responseData);
                if (returnData !== undefined) {
                    itemsReceived += returnData.length;
                }
            }
            else {
                returnData.push.apply(returnData, responseData[dataKey]);
                if (responseData[dataKey] !== undefined) {
                    itemsReceived += responseData[dataKey].length;
                }
            }
            query.offset = itemsReceived;
        } while (responseData.meta !== undefined &&
            responseData.meta.total !== undefined &&
            responseData.meta.total > itemsReceived);
        return returnData;
    });
}
exports.activeCampaignApiRequestAllItems = activeCampaignApiRequestAllItems;
function activeCampaignDefaultGetAllProperties(resource, operation) {
    return [
        {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            displayOptions: {
                show: {
                    operation: [
                        operation,
                    ],
                    resource: [
                        resource,
                    ],
                },
            },
            default: false,
            description: 'Whether to return all results or only up to a given limit',
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            displayOptions: {
                show: {
                    operation: [
                        operation,
                    ],
                    resource: [
                        resource,
                    ],
                    returnAll: [
                        false,
                    ],
                },
            },
            typeOptions: {
                minValue: 1,
                maxValue: 500,
            },
            default: 100,
            description: 'Max number of results to return',
        },
        {
            displayName: 'Simplify',
            name: 'simple',
            type: 'boolean',
            displayOptions: {
                show: {
                    operation: [
                        operation,
                    ],
                    resource: [
                        resource,
                    ],
                },
            },
            default: true,
            description: 'Whether to return a simplified version of the response instead of the raw data',
        },
    ];
}
exports.activeCampaignDefaultGetAllProperties = activeCampaignDefaultGetAllProperties;
