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
exports.Wordpress = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const PostDescription_1 = require("./PostDescription");
const UserDescription_1 = require("./UserDescription");
class Wordpress {
    constructor() {
        this.description = {
            displayName: 'Wordpress',
            name: 'wordpress',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:wordpress.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Wordpress API',
            defaults: {
                name: 'Wordpress',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wordpressApi',
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
                            name: 'Post',
                            value: 'post',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'post',
                },
                ...PostDescription_1.postOperations,
                ...PostDescription_1.postFields,
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available categories to display them to user so that he can
                // select them easily
                getCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const categories = yield GenericFunctions_1.wordpressApiRequestAllItems.call(this, 'GET', '/categories', {});
                        for (const category of categories) {
                            const categoryName = category.name;
                            const categoryId = category.id;
                            returnData.push({
                                name: categoryName,
                                value: categoryId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.wordpressApiRequestAllItems.call(this, 'GET', '/tags', {});
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = tag.id;
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available authors to display them to user so that he can
                // select them easily
                getAuthors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const authors = yield GenericFunctions_1.wordpressApiRequestAllItems.call(this, 'GET', '/users', {}, { who: 'authors' });
                        for (const author of authors) {
                            const authorName = author.name;
                            const authorId = author.id;
                            returnData.push({
                                name: authorName,
                                value: authorId,
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
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'post') {
                        //https://developer.wordpress.org/rest-api/reference/posts/#create-a-post
                        if (operation === 'create') {
                            const title = this.getNodeParameter('title', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                title,
                            };
                            if (additionalFields.authorId) {
                                body.author = additionalFields.authorId;
                            }
                            if (additionalFields.content) {
                                body.content = additionalFields.content;
                            }
                            if (additionalFields.slug) {
                                body.slug = additionalFields.slug;
                            }
                            if (additionalFields.password) {
                                body.password = additionalFields.password;
                            }
                            if (additionalFields.status) {
                                body.status = additionalFields.status;
                            }
                            if (additionalFields.commentStatus) {
                                body.comment_status = additionalFields.commentStatus;
                            }
                            if (additionalFields.pingStatus) {
                                body.ping_status = additionalFields.pingStatus;
                            }
                            if (additionalFields.sticky) {
                                body.sticky = additionalFields.sticky;
                            }
                            if (additionalFields.categories) {
                                body.categories = additionalFields.categories;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags;
                            }
                            if (additionalFields.format) {
                                body.format = additionalFields.format;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'POST', '/posts', body);
                        }
                        //https://developer.wordpress.org/rest-api/reference/posts/#update-a-post
                        if (operation === 'update') {
                            const postId = this.getNodeParameter('postId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: parseInt(postId, 10),
                            };
                            if (updateFields.authorId) {
                                body.author = updateFields.authorId;
                            }
                            if (updateFields.title) {
                                body.title = updateFields.title;
                            }
                            if (updateFields.content) {
                                body.content = updateFields.content;
                            }
                            if (updateFields.slug) {
                                body.slug = updateFields.slug;
                            }
                            if (updateFields.password) {
                                body.password = updateFields.password;
                            }
                            if (updateFields.status) {
                                body.status = updateFields.status;
                            }
                            if (updateFields.commentStatus) {
                                body.comment_status = updateFields.commentStatus;
                            }
                            if (updateFields.pingStatus) {
                                body.ping_status = updateFields.pingStatus;
                            }
                            if (updateFields.sticky) {
                                body.sticky = updateFields.sticky;
                            }
                            if (updateFields.categories) {
                                body.categories = updateFields.categories;
                            }
                            if (updateFields.tags) {
                                body.tags = updateFields.tags;
                            }
                            if (updateFields.format) {
                                body.format = updateFields.format;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'POST', `/posts/${postId}`, body);
                        }
                        //https://developer.wordpress.org/rest-api/reference/posts/#retrieve-a-post
                        if (operation === 'get') {
                            const postId = this.getNodeParameter('postId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.password) {
                                qs.password = options.password;
                            }
                            if (options.context) {
                                qs.context = options.context;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'GET', `/posts/${postId}`, {}, qs);
                        }
                        //https://developer.wordpress.org/rest-api/reference/posts/#list-posts
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.context) {
                                qs.context = options.context;
                            }
                            if (options.orderBy) {
                                qs.orderby = options.orderBy;
                            }
                            if (options.order) {
                                qs.order = options.order;
                            }
                            if (options.search) {
                                qs.search = options.search;
                            }
                            if (options.after) {
                                qs.after = options.after;
                            }
                            if (options.author) {
                                qs.author = options.author;
                            }
                            if (options.categories) {
                                qs.categories = options.categories;
                            }
                            if (options.excludedCategories) {
                                qs.categories_exclude = options.excludedCategories;
                            }
                            if (options.tags) {
                                qs.tags = options.tags;
                            }
                            if (options.excludedTags) {
                                qs.tags_exclude = options.excludedTags;
                            }
                            if (options.sticky) {
                                qs.sticky = options.sticky;
                            }
                            if (options.status) {
                                qs.status = options.status;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.wordpressApiRequestAllItems.call(this, 'GET', '/posts', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'GET', '/posts', {}, qs);
                            }
                        }
                        //https://developer.wordpress.org/rest-api/reference/posts/#delete-a-post
                        if (operation === 'delete') {
                            const postId = this.getNodeParameter('postId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.force) {
                                qs.force = options.force;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'DELETE', `/posts/${postId}`, {}, qs);
                        }
                    }
                    if (resource === 'user') {
                        //https://developer.wordpress.org/rest-api/reference/users/#create-a-user
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const username = this.getNodeParameter('username', i);
                            const firstName = this.getNodeParameter('firstName', i);
                            const lastName = this.getNodeParameter('lastName', i);
                            const email = this.getNodeParameter('email', i);
                            const password = this.getNodeParameter('password', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                name,
                                username,
                                first_name: firstName,
                                last_name: lastName,
                                email,
                                password,
                            };
                            if (additionalFields.url) {
                                body.url = additionalFields.url;
                            }
                            if (additionalFields.description) {
                                body.description = additionalFields.description;
                            }
                            if (additionalFields.nickname) {
                                body.nickname = additionalFields.nickname;
                            }
                            if (additionalFields.slug) {
                                body.slug = additionalFields.slug;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'POST', '/users', body);
                        }
                        //https://developer.wordpress.org/rest-api/reference/users/#update-a-user
                        if (operation === 'update') {
                            const userId = this.getNodeParameter('userId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: userId,
                            };
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.firstName) {
                                body.first_name = updateFields.firstName;
                            }
                            if (updateFields.lastName) {
                                body.last_name = updateFields.lastName;
                            }
                            if (updateFields.email) {
                                body.email = updateFields.email;
                            }
                            if (updateFields.password) {
                                body.password = updateFields.password;
                            }
                            if (updateFields.username) {
                                body.username = updateFields.username;
                            }
                            if (updateFields.url) {
                                body.url = updateFields.url;
                            }
                            if (updateFields.description) {
                                body.description = updateFields.description;
                            }
                            if (updateFields.nickname) {
                                body.nickname = updateFields.nickname;
                            }
                            if (updateFields.slug) {
                                body.slug = updateFields.slug;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'POST', `/users/${userId}`, body);
                        }
                        //https://developer.wordpress.org/rest-api/reference/users/#retrieve-a-user
                        if (operation === 'get') {
                            const userId = this.getNodeParameter('userId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.context) {
                                qs.context = options.context;
                            }
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'GET', `/users/${userId}`, {}, qs);
                        }
                        //https://developer.wordpress.org/rest-api/reference/users/#list-users
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.context) {
                                qs.context = options.context;
                            }
                            if (options.orderBy) {
                                qs.orderby = options.orderBy;
                            }
                            if (options.order) {
                                qs.order = options.order;
                            }
                            if (options.search) {
                                qs.search = options.search;
                            }
                            if (options.who) {
                                qs.who = options.who;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.wordpressApiRequestAllItems.call(this, 'GET', '/users', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'GET', '/users', {}, qs);
                            }
                        }
                        //https://developer.wordpress.org/rest-api/reference/users/#delete-a-user
                        if (operation === 'delete') {
                            const reassign = this.getNodeParameter('reassign', i);
                            qs.reassign = reassign;
                            qs.force = true;
                            responseData = yield GenericFunctions_1.wordpressApiRequest.call(this, 'DELETE', `/users/me`, {}, qs);
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
exports.Wordpress = Wordpress;
