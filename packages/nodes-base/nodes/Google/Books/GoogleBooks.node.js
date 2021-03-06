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
exports.GoogleBooks = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class GoogleBooks {
    constructor() {
        this.description = {
            displayName: 'Google Books',
            name: 'googleBooks',
            icon: 'file:googlebooks.svg',
            group: ['input', 'output'],
            version: 1,
            description: 'Read data from Google Books',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'Google Books',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                },
                {
                    name: 'googleBooksOAuth2Api',
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
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'serviceAccount',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Bookshelf',
                            value: 'bookshelf',
                        },
                        {
                            name: 'Bookshelf Volume',
                            value: 'bookshelfVolume',
                        },
                        {
                            name: 'Volume',
                            value: 'volume',
                        },
                    ],
                    default: 'bookshelf',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve a specific bookshelf resource for the specified user',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all public bookshelf resource for the specified user',
                        },
                    ],
                    displayOptions: {
                        show: {
                            resource: [
                                'bookshelf',
                            ],
                        },
                    },
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a volume to a bookshelf',
                        },
                        {
                            name: 'Clear',
                            value: 'clear',
                            description: 'Clears all volumes from a bookshelf',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all volumes in a specific bookshelf for the specified user',
                        },
                        {
                            name: 'Move',
                            value: 'move',
                            description: 'Moves a volume within a bookshelf',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Removes a volume from a bookshelf',
                        },
                    ],
                    displayOptions: {
                        show: {
                            resource: [
                                'bookshelfVolume',
                            ],
                        },
                    },
                    default: 'getAll',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a volume resource based on ID',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all volumes filtered by query',
                        },
                    ],
                    displayOptions: {
                        show: {
                            resource: [
                                'volume',
                            ],
                        },
                    },
                    default: 'get',
                },
                {
                    displayName: 'My Library',
                    name: 'myLibrary',
                    type: 'boolean',
                    default: false,
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                                'getAll',
                            ],
                            resource: [
                                'bookshelf',
                                'bookshelfVolume',
                            ],
                        },
                    },
                },
                // ----------------------------------
                //         All
                // ----------------------------------
                {
                    displayName: 'Search Query',
                    name: 'searchQuery',
                    type: 'string',
                    description: 'Full-text search query string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'volume',
                            ],
                        },
                    },
                },
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    description: 'ID of user',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                                'getAll',
                            ],
                            resource: [
                                'bookshelf',
                                'bookshelfVolume',
                            ],
                        },
                        hide: {
                            myLibrary: [
                                true,
                            ],
                        },
                    },
                },
                {
                    displayName: 'Bookshelf ID',
                    name: 'shelfId',
                    type: 'string',
                    description: 'ID of the bookshelf',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                                'add',
                                'clear',
                                'move',
                                'remove',
                            ],
                            resource: [
                                'bookshelf',
                                'bookshelfVolume',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Bookshelf ID',
                    name: 'shelfId',
                    type: 'string',
                    description: 'ID of the bookshelf',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'bookshelfVolume',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Volume ID',
                    name: 'volumeId',
                    type: 'string',
                    description: 'ID of the volume',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'add',
                                'move',
                                'remove',
                                'get',
                            ],
                            resource: [
                                'bookshelfVolume',
                                'volume',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Volume Position',
                    name: 'volumePosition',
                    type: 'string',
                    description: 'Position on shelf to move the item (0 puts the item before the current first item, 1 puts it between the first and the second and so on)',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'move',
                            ],
                            resource: [
                                'bookshelfVolume',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
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
                                'getAll',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 40,
                    },
                    default: 40,
                    description: 'Max number of results to return',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const qs = {};
            let responseData;
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'volume') {
                        if (operation === 'get') {
                            const volumeId = this.getNodeParameter('volumeId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `v1/volumes/${volumeId}`, {});
                        }
                        else if (operation === 'getAll') {
                            const searchQuery = this.getNodeParameter('searchQuery', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `v1/volumes?q=${searchQuery}`, {});
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `v1/volumes?q=${searchQuery}`, {}, qs);
                                responseData = responseData.items || [];
                            }
                        }
                    }
                    if (resource === 'bookshelf') {
                        if (operation === 'get') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            const myLibrary = this.getNodeParameter('myLibrary', i);
                            let endpoint;
                            if (myLibrary === false) {
                                const userId = this.getNodeParameter('userId', i);
                                endpoint = `v1/users/${userId}/bookshelves/${shelfId}`;
                            }
                            else {
                                endpoint = `v1/mylibrary/bookshelves/${shelfId}`;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', endpoint, {});
                        }
                        else if (operation === 'getAll') {
                            const myLibrary = this.getNodeParameter('myLibrary', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let endpoint;
                            if (myLibrary === false) {
                                const userId = this.getNodeParameter('userId', i);
                                endpoint = `v1/users/${userId}/bookshelves`;
                            }
                            else {
                                endpoint = `v1/mylibrary/bookshelves`;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items || [];
                            }
                        }
                    }
                    if (resource === 'bookshelfVolume') {
                        if (operation === 'add') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            const volumeId = this.getNodeParameter('volumeId', i);
                            const body = {
                                volumeId,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `v1/mylibrary/bookshelves/${shelfId}/addVolume`, body);
                        }
                        if (operation === 'clear') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `v1/mylibrary/bookshelves/${shelfId}/clearVolumes`);
                        }
                        if (operation === 'getAll') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const myLibrary = this.getNodeParameter('myLibrary', i);
                            let endpoint;
                            if (myLibrary === false) {
                                const userId = this.getNodeParameter('userId', i);
                                endpoint = `v1/users/${userId}/bookshelves/${shelfId}/volumes`;
                            }
                            else {
                                endpoint = `v1/mylibrary/bookshelves/${shelfId}/volumes`;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', endpoint, {});
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', endpoint, {}, qs);
                                responseData = responseData.items || [];
                            }
                        }
                        if (operation === 'move') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            const volumeId = this.getNodeParameter('volumeId', i);
                            const volumePosition = this.getNodeParameter('volumePosition', i);
                            const body = {
                                volumeId,
                                volumePosition,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `v1/mylibrary/bookshelves/${shelfId}/moveVolume`, body);
                        }
                        if (operation === 'remove') {
                            const shelfId = this.getNodeParameter('shelfId', i);
                            const volumeId = this.getNodeParameter('volumeId', i);
                            const body = {
                                volumeId,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `v1/mylibrary/bookshelves/${shelfId}/removeVolume`, body);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(responseData)];
        });
    }
}
exports.GoogleBooks = GoogleBooks;
