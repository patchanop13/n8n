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
exports.Raindrop = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class Raindrop {
    constructor() {
        this.description = {
            displayName: 'Raindrop',
            name: 'raindrop',
            icon: 'file:raindrop.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Raindrop API',
            defaults: {
                name: 'Raindrop',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'raindropOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Bookmark',
                            value: 'bookmark',
                        },
                        {
                            name: 'Collection',
                            value: 'collection',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'collection',
                },
                ...descriptions_1.bookmarkOperations,
                ...descriptions_1.bookmarkFields,
                ...descriptions_1.collectionOperations,
                ...descriptions_1.collectionFields,
                ...descriptions_1.tagOperations,
                ...descriptions_1.tagFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCollections() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', '/collections', {}, {});
                        return responseData.items.map((item) => ({
                            name: item.title,
                            value: item._id,
                        }));
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
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'bookmark') {
                        // *********************************************************************
                        //                              bookmark
                        // *********************************************************************
                        // https://developer.raindrop.io/v1/raindrops
                        if (operation === 'create') {
                            // ----------------------------------
                            //         bookmark: create
                            // ----------------------------------
                            const body = {
                                link: this.getNodeParameter('link', i),
                                collection: {
                                    '$id': this.getNodeParameter('collectionId', i),
                                },
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            if (additionalFields.pleaseParse === true) {
                                body.pleaseParse = {};
                                delete additionalFields.pleaseParse;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags.split(',').map(tag => tag.trim());
                            }
                            const endpoint = `/raindrop`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData.item;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         bookmark: delete
                            // ----------------------------------
                            const bookmarkId = this.getNodeParameter('bookmarkId', i);
                            const endpoint = `/raindrop/${bookmarkId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         bookmark: get
                            // ----------------------------------
                            const bookmarkId = this.getNodeParameter('bookmarkId', i);
                            const endpoint = `/raindrop/${bookmarkId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.item;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         bookmark: getAll
                            // ----------------------------------
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const endpoint = `/raindrops/${collectionId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.items;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         bookmark: update
                            // ----------------------------------
                            const bookmarkId = this.getNodeParameter('bookmarkId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            Object.assign(body, updateFields);
                            if (updateFields.collectionId) {
                                body.collection = {
                                    '$id': updateFields.collectionId,
                                };
                                delete updateFields.collectionId;
                            }
                            if (updateFields.pleaseParse === true) {
                                body.pleaseParse = {};
                                delete updateFields.pleaseParse;
                            }
                            if (updateFields.tags) {
                                body.tags = updateFields.tags.split(',').map(tag => tag.trim());
                            }
                            const endpoint = `/raindrop/${bookmarkId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'PUT', endpoint, {}, body);
                            responseData = responseData.item;
                        }
                    }
                    else if (resource === 'collection') {
                        // *********************************************************************
                        //                             collection
                        // *********************************************************************
                        // https://developer.raindrop.io/v1/collections/methods
                        if (operation === 'create') {
                            // ----------------------------------
                            //       collection: create
                            // ----------------------------------
                            const body = {
                                title: this.getNodeParameter('title', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            if (additionalFields.cover) {
                                body.cover = [body.cover];
                            }
                            if (additionalFields.parentId) {
                                body['parent.$id'] = parseInt(additionalFields.parentId, 10);
                                delete additionalFields.parentId;
                            }
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'POST', `/collection`, {}, body);
                            responseData = responseData.item;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //        collection: delete
                            // ----------------------------------
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const endpoint = `/collection/${collectionId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //        collection: get
                            // ----------------------------------
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const endpoint = `/collection/${collectionId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.item;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        collection: getAll
                            // ----------------------------------
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const endpoint = this.getNodeParameter('type', i) === 'parent'
                                ? '/collections'
                                : '/collections/childrens';
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.items;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //        collection: update
                            // ----------------------------------
                            const collectionId = this.getNodeParameter('collectionId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            if (updateFields.parentId) {
                                body['parent.$id'] = parseInt(updateFields.parentId, 10);
                                delete updateFields.parentId;
                            }
                            Object.assign(body, (0, lodash_1.omit)(updateFields, 'binaryPropertyName'));
                            const endpoint = `/collection/${collectionId}`;
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'PUT', endpoint, {}, body);
                            responseData = responseData.item;
                            // cover-specific endpoint
                            if (updateFields.cover) {
                                if (!items[i].binary) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                if (!updateFields.cover) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter a binary property to upload a cover image.');
                                }
                                const binaryPropertyName = updateFields.cover;
                                const binaryData = items[i].binary[binaryPropertyName];
                                const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                const formData = {
                                    cover: {
                                        value: dataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                            contentType: binaryData.mimeType,
                                        },
                                    },
                                };
                                const endpoint = `/collection/${collectionId}/cover`;
                                responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'PUT', endpoint, {}, {}, { 'Content-Type': 'multipart/form-data', formData });
                                responseData = responseData.item;
                            }
                        }
                    }
                    else if (resource === 'user') {
                        // *********************************************************************
                        //                                user
                        // *********************************************************************
                        // https://developer.raindrop.io/v1/user
                        if (operation === 'get') {
                            // ----------------------------------
                            //           user: get
                            // ----------------------------------
                            const self = this.getNodeParameter('self', i);
                            let endpoint = '/user';
                            if (self === false) {
                                const userId = this.getNodeParameter('userId', i);
                                endpoint += `/${userId}`;
                            }
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.user;
                        }
                    }
                    else if (resource === 'tag') {
                        // *********************************************************************
                        //                              tag
                        // *********************************************************************
                        // https://developer.raindrop.io/v1/tags
                        if (operation === 'delete') {
                            // ----------------------------------
                            //           tag: delete
                            // ----------------------------------
                            let endpoint = `/tags`;
                            const body = {
                                tags: this.getNodeParameter('tags', i).split(','),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.collectionId) {
                                endpoint += `/${additionalFields.collectionId}`;
                            }
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'DELETE', endpoint, {}, body);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //           tag: getAll
                            // ----------------------------------
                            let endpoint = `/tags`;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filter = this.getNodeParameter('filters', i);
                            if (filter.collectionId) {
                                endpoint += `/${filter.collectionId}`;
                            }
                            responseData = yield GenericFunctions_1.raindropApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData.items;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.slice(0, limit);
                            }
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
exports.Raindrop = Raindrop;
