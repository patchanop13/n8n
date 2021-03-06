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
exports.Reddit = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const PostCommentDescription_1 = require("./PostCommentDescription");
const PostDescription_1 = require("./PostDescription");
const ProfileDescription_1 = require("./ProfileDescription");
const SubredditDescription_1 = require("./SubredditDescription");
const UserDescription_1 = require("./UserDescription");
class Reddit {
    constructor() {
        this.description = {
            displayName: 'Reddit',
            name: 'reddit',
            icon: 'file:reddit.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Reddit API',
            defaults: {
                name: 'Reddit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'redditOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'postComment',
                                'post',
                                'profile',
                            ],
                        },
                    },
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
                            name: 'Post Comment',
                            value: 'postComment',
                        },
                        {
                            name: 'Profile',
                            value: 'profile',
                        },
                        {
                            name: 'Subreddit',
                            value: 'subreddit',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'post',
                },
                ...PostCommentDescription_1.postCommentOperations,
                ...PostCommentDescription_1.postCommentFields,
                ...ProfileDescription_1.profileOperations,
                ...ProfileDescription_1.profileFields,
                ...SubredditDescription_1.subredditOperations,
                ...SubredditDescription_1.subredditFields,
                ...PostDescription_1.postOperations,
                ...PostDescription_1.postFields,
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
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
                    // *********************************************************************
                    //         post
                    // *********************************************************************
                    if (resource === 'post') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         post: create
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#POST_api_submit
                            const qs = {
                                title: this.getNodeParameter('title', i),
                                sr: this.getNodeParameter('subreddit', i),
                                kind: this.getNodeParameter('kind', i),
                            };
                            qs.kind === 'self'
                                ? qs.text = this.getNodeParameter('text', i)
                                : qs.url = this.getNodeParameter('url', i);
                            if (qs.url) {
                                qs.resubmit = this.getNodeParameter('resubmit', i);
                            }
                            responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'POST', 'api/submit', qs);
                            responseData = responseData.json.data;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         post: delete
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#POST_api_del
                            const postTypePrefix = 't3_';
                            const qs = {
                                id: postTypePrefix + this.getNodeParameter('postId', i),
                            };
                            yield GenericFunctions_1.redditApiRequest.call(this, 'POST', 'api/del', qs);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         post: get
                            // ----------------------------------
                            const subreddit = this.getNodeParameter('subreddit', i);
                            const postId = this.getNodeParameter('postId', i);
                            const endpoint = `r/${subreddit}/comments/${postId}.json`;
                            responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'GET', endpoint, {});
                            responseData = responseData[0].data.children[0].data;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         post: getAll
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_hot
                            // https://www.reddit.com/dev/api/#GET_new
                            // https://www.reddit.com/dev/api/#GET_rising
                            // https://www.reddit.com/dev/api/#GET_{sort}
                            const subreddit = this.getNodeParameter('subreddit', i);
                            let endpoint = `r/${subreddit}.json`;
                            const { category } = this.getNodeParameter('filters', i);
                            if (category) {
                                endpoint = `r/${subreddit}/${category}.json`;
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint);
                        }
                        else if (operation === 'search') {
                            // ----------------------------------
                            //         post: search
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_search
                            const location = this.getNodeParameter('location', i);
                            const qs = {
                                q: this.getNodeParameter('keyword', i),
                                restrict_sr: location === 'subreddit',
                            };
                            const { sort } = this.getNodeParameter('additionalFields', i);
                            if (sort) {
                                qs.sort = sort;
                            }
                            let endpoint = '';
                            if (location === 'allReddit') {
                                endpoint = 'search.json';
                            }
                            else {
                                const subreddit = this.getNodeParameter('subreddit', i);
                                endpoint = `r/${subreddit}/search.json`;
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, qs);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'postComment') {
                        // *********************************************************************
                        //        postComment
                        // *********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //        postComment: create
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#POST_api_comment
                            const postTypePrefix = 't3_';
                            const qs = {
                                text: this.getNodeParameter('commentText', i),
                                thing_id: postTypePrefix + this.getNodeParameter('postId', i),
                            };
                            responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'POST', 'api/comment', qs);
                            responseData = responseData.json.data.things[0].data;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        postComment: getAll
                            // ----------------------------------
                            // https://www.reddit.com/r/{subrreddit}/comments/{postId}.json
                            const subreddit = this.getNodeParameter('subreddit', i);
                            const postId = this.getNodeParameter('postId', i);
                            const endpoint = `r/${subreddit}/comments/${postId}.json`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //        postComment: delete
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#POST_api_del
                            const commentTypePrefix = 't1_';
                            const qs = {
                                id: commentTypePrefix + this.getNodeParameter('commentId', i),
                            };
                            yield GenericFunctions_1.redditApiRequest.call(this, 'POST', 'api/del', qs);
                            responseData = { success: true };
                        }
                        else if (operation === 'reply') {
                            // ----------------------------------
                            //        postComment: reply
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#POST_api_comment
                            const commentTypePrefix = 't1_';
                            const qs = {
                                text: this.getNodeParameter('replyText', i),
                                thing_id: commentTypePrefix + this.getNodeParameter('commentId', i),
                            };
                            responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'POST', 'api/comment', qs);
                            responseData = responseData.json.data.things[0].data;
                        }
                    }
                    else if (resource === 'profile') {
                        // *********************************************************************
                        //         profile
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //         profile: get
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_api_v1_me
                            // https://www.reddit.com/dev/api/#GET_api_v1_me_karma
                            // https://www.reddit.com/dev/api/#GET_api_v1_me_prefs
                            // https://www.reddit.com/dev/api/#GET_api_v1_me_trophies
                            // https://www.reddit.com/dev/api/#GET_prefs_{where}
                            const endpoints = {
                                identity: 'me',
                                blockedUsers: 'me/blocked',
                                friends: 'me/friends',
                                karma: 'me/karma',
                                prefs: 'me/prefs',
                                trophies: 'me/trophies',
                            };
                            const details = this.getNodeParameter('details', i);
                            const endpoint = `api/v1/${endpoints[details]}`;
                            let username;
                            if (details === 'saved') {
                                ({ name: username } = yield GenericFunctions_1.redditApiRequest.call(this, 'GET', `api/v1/me`, {}));
                            }
                            responseData = details === 'saved'
                                ? yield GenericFunctions_1.handleListing.call(this, i, `user/${username}/saved.json`)
                                : yield GenericFunctions_1.redditApiRequest.call(this, 'GET', endpoint, {});
                            if (details === 'identity') {
                                responseData = responseData.features;
                            }
                            else if (details === 'friends') {
                                responseData = responseData.data.children;
                                if (!responseData.length) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
                                }
                            }
                            else if (details === 'karma') {
                                responseData = responseData.data;
                                if (!responseData.length) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
                                }
                            }
                            else if (details === 'trophies') {
                                responseData = responseData.data.trophies.map((trophy) => trophy.data);
                            }
                        }
                    }
                    else if (resource === 'subreddit') {
                        // *********************************************************************
                        //        subreddit
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //        subreddit: get
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_r_{subreddit}_about
                            // https://www.reddit.com/dev/api/#GET_r_{subreddit}_about_rules
                            const subreddit = this.getNodeParameter('subreddit', i);
                            const content = this.getNodeParameter('content', i);
                            const endpoint = `r/${subreddit}/about/${content}.json`;
                            responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'GET', endpoint, {});
                            if (content === 'rules') {
                                responseData = responseData.rules;
                            }
                            else if (content === 'about') {
                                responseData = responseData.data;
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        subreddit: getAll
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_api_trending_subreddits
                            // https://www.reddit.com/dev/api/#POST_api_search_subreddits
                            // https://www.reddit.com/r/subreddits.json
                            const filters = this.getNodeParameter('filters', i);
                            if (filters.trending) {
                                const returnAll = this.getNodeParameter('returnAll', 0);
                                const endpoint = 'api/trending_subreddits.json';
                                responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'GET', endpoint, {});
                                responseData = responseData.subreddit_names.map((name) => ({ name }));
                                if (returnAll === false) {
                                    const limit = this.getNodeParameter('limit', 0);
                                    responseData = responseData.splice(0, limit);
                                }
                            }
                            else if (filters.keyword) {
                                const qs = {};
                                qs.query = filters.keyword;
                                const endpoint = 'api/search_subreddits.json';
                                responseData = yield GenericFunctions_1.redditApiRequest.call(this, 'POST', endpoint, qs);
                                const returnAll = this.getNodeParameter('returnAll', 0);
                                if (returnAll === false) {
                                    const limit = this.getNodeParameter('limit', 0);
                                    responseData = responseData.subreddits.splice(0, limit);
                                }
                            }
                            else {
                                const endpoint = 'r/subreddits.json';
                                responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint);
                            }
                        }
                    }
                    else if (resource === 'user') {
                        // *********************************************************************
                        //           user
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //           user: get
                            // ----------------------------------
                            // https://www.reddit.com/dev/api/#GET_user_{username}_{where}
                            const username = this.getNodeParameter('username', i);
                            const details = this.getNodeParameter('details', i);
                            const endpoint = `user/${username}/${details}.json`;
                            responseData = details === 'about'
                                ? yield GenericFunctions_1.redditApiRequest.call(this, 'GET', endpoint, {})
                                : yield GenericFunctions_1.handleListing.call(this, i, endpoint);
                            if (details === 'about') {
                                responseData = responseData.data;
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
exports.Reddit = Reddit;
