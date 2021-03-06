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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ghost = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const PostDescription_1 = require("./PostDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Ghost {
    constructor() {
        this.description = {
            displayName: 'Ghost',
            name: 'ghost',
            icon: 'file:ghost.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Ghost API',
            defaults: {
                name: 'Ghost',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'ghostAdminApi',
                    required: true,
                    displayOptions: {
                        show: {
                            source: [
                                'adminApi',
                            ],
                        },
                    },
                },
                {
                    name: 'ghostContentApi',
                    required: true,
                    displayOptions: {
                        show: {
                            source: [
                                'contentApi',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Source',
                    name: 'source',
                    type: 'options',
                    description: 'Pick where your data comes from, Content or Admin API',
                    options: [
                        {
                            name: 'Admin API',
                            value: 'adminApi',
                        },
                        {
                            name: 'Content API',
                            value: 'contentApi',
                        },
                    ],
                    default: 'contentApi',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    options: [
                        {
                            name: 'Post',
                            value: 'post',
                        },
                    ],
                    noDataExpression: true,
                    default: 'post',
                },
                ...PostDescription_1.postOperations,
                ...PostDescription_1.postFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the authors to display them to user so that he can
                // select them easily
                getAuthors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.ghostApiRequestAllItems.call(this, 'users', 'GET', `/admin/users`);
                        for (const user of users) {
                            returnData.push({
                                name: user.name,
                                value: user.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.ghostApiRequestAllItems.call(this, 'tags', 'GET', `/admin/tags`);
                        for (const tag of tags) {
                            returnData.push({
                                name: tag.name,
                                value: tag.name,
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
            const length = items.length;
            const timezone = this.getTimezone();
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const source = this.getNodeParameter('source', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (source === 'contentApi') {
                        if (resource === 'post') {
                            if (operation === 'get') {
                                const by = this.getNodeParameter('by', i);
                                const identifier = this.getNodeParameter('identifier', i);
                                const options = this.getNodeParameter('options', i);
                                Object.assign(qs, options);
                                let endpoint;
                                if (by === 'slug') {
                                    endpoint = `/content/posts/slug/${identifier}`;
                                }
                                else {
                                    endpoint = `/content/posts/${identifier}`;
                                }
                                responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'GET', endpoint, {}, qs);
                                returnData.push.apply(returnData, responseData.posts);
                            }
                            if (operation === 'getAll') {
                                const returnAll = this.getNodeParameter('returnAll', 0);
                                const options = this.getNodeParameter('options', i);
                                Object.assign(qs, options);
                                if (returnAll) {
                                    responseData = yield GenericFunctions_1.ghostApiRequestAllItems.call(this, 'posts', 'GET', '/content/posts', {}, qs);
                                }
                                else {
                                    qs.limit = this.getNodeParameter('limit', 0);
                                    responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'GET', '/content/posts', {}, qs);
                                    responseData = responseData.posts;
                                }
                                returnData.push.apply(returnData, responseData);
                            }
                        }
                    }
                    if (source === 'adminApi') {
                        if (resource === 'post') {
                            if (operation === 'create') {
                                const title = this.getNodeParameter('title', i);
                                const contentFormat = this.getNodeParameter('contentFormat', i);
                                const content = this.getNodeParameter('content', i);
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                const post = {
                                    title,
                                };
                                if (contentFormat === 'html') {
                                    post.html = content;
                                    qs.source = 'html';
                                }
                                else {
                                    const mobileDoc = (0, GenericFunctions_1.validateJSON)(content);
                                    if (mobileDoc === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Content must be a valid JSON');
                                    }
                                    post.mobiledoc = content;
                                }
                                delete post.content;
                                Object.assign(post, additionalFields);
                                if (post.published_at) {
                                    post.published_at = moment_timezone_1.default.tz(post.published_at, timezone).utc().format();
                                }
                                if (post.status === 'scheduled' && post.published_at === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Published at must be define when status is scheduled');
                                }
                                responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'POST', '/admin/posts', { posts: [post] }, qs);
                                returnData.push.apply(returnData, responseData.posts);
                            }
                            if (operation === 'delete') {
                                const postId = this.getNodeParameter('postId', i);
                                responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'DELETE', `/admin/posts/${postId}`);
                                returnData.push({ success: true });
                            }
                            if (operation === 'get') {
                                const by = this.getNodeParameter('by', i);
                                const identifier = this.getNodeParameter('identifier', i);
                                const options = this.getNodeParameter('options', i);
                                Object.assign(qs, options);
                                let endpoint;
                                if (by === 'slug') {
                                    endpoint = `/admin/posts/slug/${identifier}`;
                                }
                                else {
                                    endpoint = `/admin/posts/${identifier}`;
                                }
                                responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'GET', endpoint, {}, qs);
                                returnData.push.apply(returnData, responseData.posts);
                            }
                            if (operation === 'getAll') {
                                const returnAll = this.getNodeParameter('returnAll', 0);
                                const options = this.getNodeParameter('options', i);
                                Object.assign(qs, options);
                                if (returnAll) {
                                    responseData = yield GenericFunctions_1.ghostApiRequestAllItems.call(this, 'posts', 'GET', '/admin/posts', {}, qs);
                                }
                                else {
                                    qs.limit = this.getNodeParameter('limit', 0);
                                    responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'GET', '/admin/posts', {}, qs);
                                    responseData = responseData.posts;
                                }
                                returnData.push.apply(returnData, responseData);
                            }
                            if (operation === 'update') {
                                const postId = this.getNodeParameter('postId', i);
                                const contentFormat = this.getNodeParameter('contentFormat', i);
                                const updateFields = this.getNodeParameter('updateFields', i);
                                const post = {};
                                if (contentFormat === 'html') {
                                    post.html = updateFields.content || '';
                                    qs.source = 'html';
                                    delete updateFields.content;
                                }
                                else {
                                    const mobileDoc = (0, GenericFunctions_1.validateJSON)(updateFields.contentJson || undefined);
                                    if (mobileDoc === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Content must be a valid JSON');
                                    }
                                    post.mobiledoc = updateFields.contentJson;
                                    delete updateFields.contentJson;
                                }
                                Object.assign(post, updateFields);
                                const { posts } = yield GenericFunctions_1.ghostApiRequest.call(this, 'GET', `/admin/posts/${postId}`, {}, { fields: 'id, updated_at' });
                                if (post.published_at) {
                                    post.published_at = moment_timezone_1.default.tz(post.published_at, timezone).utc().format();
                                }
                                if (post.status === 'scheduled' && post.published_at === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Published at must be define when status is scheduled');
                                }
                                post.updated_at = posts[0].updated_at;
                                responseData = yield GenericFunctions_1.ghostApiRequest.call(this, 'PUT', `/admin/posts/${postId}`, { posts: [post] }, qs);
                                returnData.push.apply(returnData, responseData.posts);
                            }
                        }
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
exports.Ghost = Ghost;
