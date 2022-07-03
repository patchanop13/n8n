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
exports.Webflow = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ItemDescription_1 = require("./ItemDescription");
class Webflow {
    constructor() {
        this.description = {
            displayName: 'Webflow',
            name: 'webflow',
            icon: 'file:webflow.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Webflow API',
            defaults: {
                name: 'Webflow',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'webflowApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'webflowOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Item',
                            value: 'item',
                        },
                    ],
                    default: 'item',
                },
                ...ItemDescription_1.itemOperations,
                ...ItemDescription_1.itemFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getSites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const sites = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', '/sites');
                        for (const site of sites) {
                            returnData.push({
                                name: site.name,
                                value: site._id,
                            });
                        }
                        return returnData;
                    });
                },
                getCollections() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const siteId = this.getCurrentNodeParameter('siteId');
                        const collections = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', `/sites/${siteId}/collections`);
                        for (const collection of collections) {
                            returnData.push({
                                name: collection.name,
                                value: collection._id,
                            });
                        }
                        return returnData;
                    });
                },
                getFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const collectionId = this.getCurrentNodeParameter('collectionId');
                        const { fields } = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', `/collections/${collectionId}`);
                        for (const field of fields) {
                            returnData.push({
                                name: `${field.name} (${field.type}) ${(field.required) ? ' (required)' : ''}`,
                                value: field.slug,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const qs = {};
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'item') {
                        // *********************************************************************
                        //                             item
                        // *********************************************************************
                        // https://developers.webflow.com/#item-model
                        if (operation === 'create') {
                            // ----------------------------------
                            //         item: create
                            // ----------------------------------
                            // https://developers.webflow.com/#create-new-collection-item
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const properties = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            const live = this.getNodeParameter('live', i);
                            const fields = {};
                            properties.forEach(data => (fields[data.fieldId] = data.fieldValue));
                            const body = {
                                fields,
                            };
                            responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'POST', `/collections/${collectionId}/items`, body, { live });
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         item: delete
                            // ----------------------------------
                            // https://developers.webflow.com/#remove-collection-item
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'DELETE', `/collections/${collectionId}/items/${itemId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         item: get
                            // ----------------------------------
                            // https://developers.webflow.com/#get-single-item
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', `/collections/${collectionId}/items/${itemId}`);
                            responseData = responseData.items;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         item: getAll
                            // ----------------------------------
                            // https://developers.webflow.com/#get-all-items-for-a-collection
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const qs = {};
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.webflowApiRequestAllItems.call(this, 'GET', `/collections/${collectionId}/items`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', `/collections/${collectionId}/items`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         item: update
                            // ----------------------------------
                            // https://developers.webflow.com/#update-collection-item
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            const properties = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                            const live = this.getNodeParameter('live', i);
                            const fields = {};
                            properties.forEach(data => (fields[data.fieldId] = data.fieldValue));
                            const body = {
                                fields,
                            };
                            responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'PUT', `/collections/${collectionId}/items/${itemId}`, body, { live });
                        }
                    }
                    Array.isArray(responseData)
                        ? returnData.push(...responseData)
                        : returnData.push(responseData);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Webflow = Webflow;
