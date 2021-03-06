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
exports.Medium = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Medium {
    constructor() {
        this.description = {
            displayName: 'Medium',
            name: 'medium',
            group: ['output'],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:medium.png',
            version: 1,
            description: 'Consume Medium API',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'Medium',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mediumApi',
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
                    name: 'mediumOAuth2Api',
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
                            name: 'Post',
                            value: 'post',
                        },
                        {
                            name: 'Publication',
                            value: 'publication',
                        },
                    ],
                    default: 'post',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'post',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a post',
                        },
                    ],
                    default: 'create',
                },
                // ----------------------------------
                //         post:create
                // ----------------------------------
                {
                    displayName: 'Publication',
                    name: 'publication',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'post',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether you are posting for a publication',
                },
                {
                    displayName: 'Publication Name or ID',
                    name: 'publicationId',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: [
                                'post',
                            ],
                            operation: [
                                'create',
                            ],
                            publication: [
                                true,
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getPublications',
                    },
                    default: '',
                    description: 'Publication IDs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                    placeholder: 'My Open Source Contribution',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'post',
                            ],
                        },
                    },
                    description: 'Title of the post. Max Length : 100 characters.',
                },
                {
                    displayName: 'Content Format',
                    name: 'contentFormat',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'post',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'HTML',
                            value: 'html',
                        },
                        {
                            name: 'Markdown',
                            value: 'markdown',
                        },
                    ],
                    description: 'The format of the content to be posted',
                },
                {
                    displayName: 'Content',
                    name: 'content',
                    type: 'string',
                    default: '',
                    placeholder: 'My open source contribution',
                    required: true,
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'post',
                            ],
                        },
                    },
                    description: 'The body of the post, in a valid semantic HTML fragment, or Markdown',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                            resource: [
                                'post',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Canonical Url',
                            name: 'canonicalUrl',
                            type: 'string',
                            default: '',
                            description: 'The original home of this content, if it was originally published elsewhere',
                        },
                        {
                            displayName: 'License',
                            name: 'license',
                            type: 'options',
                            default: 'all-rights-reserved',
                            options: [
                                {
                                    name: 'all-rights-reserved',
                                    value: 'all-rights-reserved',
                                },
                                {
                                    name: 'cc-40-by',
                                    value: 'cc-40-by',
                                },
                                {
                                    name: 'cc-40-by-nc',
                                    value: 'cc-40-by-nc',
                                },
                                {
                                    name: 'cc-40-by-nc-nd',
                                    value: 'cc-40-by-nc-nd',
                                },
                                {
                                    name: 'cc-40-by-nc-sa',
                                    value: 'cc-40-by-nc-sa',
                                },
                                {
                                    name: 'cc-40-by-nd',
                                    value: 'cc-40-by-nd',
                                },
                                {
                                    name: 'cc-40-by-sa',
                                    value: 'cc-40-by-sa',
                                },
                                {
                                    name: 'cc-40-zero',
                                    value: 'cc-40-zero',
                                },
                                {
                                    name: 'public-domain',
                                    value: 'public-domain',
                                },
                            ],
                            description: 'License of the post',
                        },
                        {
                            displayName: 'Notify Followers',
                            name: 'notifyFollowers',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to notify followers that the user has published',
                        },
                        {
                            displayName: 'Publish Status',
                            name: 'publishStatus',
                            default: 'public',
                            type: 'options',
                            options: [
                                {
                                    name: 'Public',
                                    value: 'public',
                                },
                                {
                                    name: 'Draft',
                                    value: 'draft',
                                },
                                {
                                    name: 'Unlisted',
                                    value: 'unlisted',
                                },
                            ],
                            description: 'The status of the post',
                        },
                        {
                            displayName: 'Tags',
                            name: 'tags',
                            type: 'string',
                            default: '',
                            placeholder: 'open-source,mlh,fellowship',
                            description: 'Comma-separated strings to be used as tags for post classification. Max allowed tags: 5. Max tag length: 25 characters.',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'publication',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all publications',
                        },
                    ],
                    default: 'publication',
                },
                // ----------------------------------
                //         publication:getAll
                // ----------------------------------
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            resource: [
                                'publication',
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
                            resource: [
                                'publication',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 200,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available publications to display them to user so that he can
                // select them easily
                getPublications() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        //Get the User Id
                        const user = yield GenericFunctions_1.mediumApiRequest.call(this, 'GET', `/me`);
                        const userId = user.data.id;
                        //Get all publications of that user
                        const publications = yield GenericFunctions_1.mediumApiRequest.call(this, 'GET', `/users/${userId}/publications`);
                        const publicationsList = publications.data;
                        for (const publication of publicationsList) {
                            const publicationName = publication.name;
                            const publicationId = publication.id;
                            returnData.push({
                                name: publicationName,
                                value: publicationId,
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
            const returnData = [];
            let operation;
            let resource;
            // For POST
            let bodyRequest;
            // For Query string
            let qs;
            let responseData;
            for (let i = 0; i < items.length; i++) {
                qs = {};
                try {
                    resource = this.getNodeParameter('resource', i);
                    operation = this.getNodeParameter('operation', i);
                    if (resource === 'post') {
                        //https://github.com/Medium/medium-api-docs
                        if (operation === 'create') {
                            // ----------------------------------
                            //         post:create
                            // ----------------------------------
                            const title = this.getNodeParameter('title', i);
                            const contentFormat = this.getNodeParameter('contentFormat', i);
                            const content = this.getNodeParameter('content', i);
                            bodyRequest = {
                                tags: [],
                                title,
                                contentFormat,
                                content,
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.tags) {
                                const tags = additionalFields.tags;
                                bodyRequest.tags = tags.split(',').map(name => {
                                    const returnValue = name.trim();
                                    if (returnValue.length > 25) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The tag "${returnValue}" is to long. Maximum lenght of a tag is 25 characters.`);
                                    }
                                    return returnValue;
                                });
                                if (bodyRequest.tags.length > 5) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'To many tags got used. Maximum 5 can be set.');
                                }
                            }
                            if (additionalFields.canonicalUrl) {
                                bodyRequest.canonicalUrl = additionalFields.canonicalUrl;
                            }
                            if (additionalFields.publishStatus) {
                                bodyRequest.publishStatus = additionalFields.publishStatus;
                            }
                            if (additionalFields.license) {
                                bodyRequest.license = additionalFields.license;
                            }
                            if (additionalFields.notifyFollowers) {
                                bodyRequest.notifyFollowers = additionalFields.notifyFollowers;
                            }
                            const underPublication = this.getNodeParameter('publication', i);
                            // if user wants to publish it under a specific publication
                            if (underPublication) {
                                const publicationId = this.getNodeParameter('publicationId', i);
                                responseData = yield GenericFunctions_1.mediumApiRequest.call(this, 'POST', `/publications/${publicationId}/posts`, bodyRequest, qs);
                            }
                            else {
                                const responseAuthorId = yield GenericFunctions_1.mediumApiRequest.call(this, 'GET', '/me', {}, qs);
                                const authorId = responseAuthorId.data.id;
                                responseData = yield GenericFunctions_1.mediumApiRequest.call(this, 'POST', `/users/${authorId}/posts`, bodyRequest, qs);
                                responseData = responseData.data;
                            }
                        }
                    }
                    if (resource === 'publication') {
                        //https://github.com/Medium/medium-api-docs#32-publications
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //         publication:getAll
                            // ----------------------------------
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const user = yield GenericFunctions_1.mediumApiRequest.call(this, 'GET', `/me`);
                            const userId = user.data.id;
                            //Get all publications of that user
                            responseData = yield GenericFunctions_1.mediumApiRequest.call(this, 'GET', `/users/${userId}/publications`);
                            responseData = responseData.data;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
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
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Medium = Medium;
