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
exports.Bitly = void 0;
const LinkDescription_1 = require("./LinkDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class Bitly {
    constructor() {
        this.description = {
            displayName: 'Bitly',
            name: 'bitly',
            icon: 'file:bitly.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Bitly API',
            defaults: {
                name: 'Bitly',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'bitlyApi',
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
                    name: 'bitlyOAuth2Api',
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
                            name: 'Link',
                            value: 'link',
                        },
                    ],
                    default: 'link',
                },
                ...LinkDescription_1.linkOperations,
                ...LinkDescription_1.linkFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const groups = yield GenericFunctions_1.bitlyApiRequestAllItems.call(this, 'groups', 'GET', '/groups');
                        for (const group of groups) {
                            const groupName = group.name;
                            const groupId = group.guid;
                            returnData.push({
                                name: groupName,
                                value: groupId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const groupId = this.getCurrentNodeParameter('group');
                        const returnData = [];
                        const tags = yield GenericFunctions_1.bitlyApiRequestAllItems.call(this, 'tags', 'GET', `groups/${groupId}/tags`);
                        for (const tag of tags) {
                            const tagName = tag;
                            const tagId = tag;
                            returnData.push({
                                name: tagName,
                                value: tagId,
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
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'link') {
                        if (operation === 'create') {
                            const longUrl = this.getNodeParameter('longUrl', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                long_url: longUrl,
                            };
                            if (additionalFields.title) {
                                body.title = additionalFields.title;
                            }
                            if (additionalFields.domain) {
                                body.domain = additionalFields.domain;
                            }
                            if (additionalFields.group) {
                                body.group = additionalFields.group;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags;
                            }
                            const deeplinks = this.getNodeParameter('deeplink', i).deeplinkUi;
                            if (deeplinks) {
                                for (const deeplink of deeplinks) {
                                    //@ts-ignore
                                    body.deeplinks.push({
                                        app_uri_path: deeplink.appUriPath,
                                        install_type: deeplink.installType,
                                        install_url: deeplink.installUrl,
                                        app_id: deeplink.appId,
                                    });
                                }
                            }
                            responseData = yield GenericFunctions_1.bitlyApiRequest.call(this, 'POST', '/bitlinks', body);
                        }
                        if (operation === 'update') {
                            const linkId = this.getNodeParameter('id', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.longUrl) {
                                body.long_url = updateFields.longUrl;
                            }
                            if (updateFields.title) {
                                body.title = updateFields.title;
                            }
                            if (updateFields.archived !== undefined) {
                                body.archived = updateFields.archived;
                            }
                            if (updateFields.group) {
                                body.group = updateFields.group;
                            }
                            if (updateFields.tags) {
                                body.tags = updateFields.tags;
                            }
                            const deeplinks = this.getNodeParameter('deeplink', i).deeplinkUi;
                            if (deeplinks) {
                                for (const deeplink of deeplinks) {
                                    //@ts-ignore
                                    body.deeplinks.push({
                                        app_uri_path: deeplink.appUriPath,
                                        install_type: deeplink.installType,
                                        install_url: deeplink.installUrl,
                                        app_id: deeplink.appId,
                                    });
                                }
                            }
                            responseData = yield GenericFunctions_1.bitlyApiRequest.call(this, 'PATCH', `/bitlinks/${linkId}`, body);
                        }
                        if (operation === 'get') {
                            const linkId = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.bitlyApiRequest.call(this, 'GET', `/bitlinks/${linkId}`);
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
exports.Bitly = Bitly;
