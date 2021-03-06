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
exports.Orbit = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ActivityDescription_1 = require("./ActivityDescription");
const MemberDescription_1 = require("./MemberDescription");
const NoteDescription_1 = require("./NoteDescription");
const PostDescription_1 = require("./PostDescription");
const moment_1 = __importDefault(require("moment"));
class Orbit {
    constructor() {
        this.description = {
            displayName: 'Orbit',
            name: 'orbit',
            icon: 'file:orbit.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Orbit API',
            defaults: {
                name: 'Orbit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'orbitApi',
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
                            name: 'Activity',
                            value: 'activity',
                        },
                        {
                            name: 'Member',
                            value: 'member',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                        {
                            name: 'Post',
                            value: 'post',
                        },
                    ],
                    default: 'member',
                },
                // ACTIVITY
                ...ActivityDescription_1.activityOperations,
                ...ActivityDescription_1.activityFields,
                // MEMBER
                ...MemberDescription_1.memberOperations,
                ...MemberDescription_1.memberFields,
                // NOTE
                ...NoteDescription_1.noteOperations,
                ...NoteDescription_1.noteFields,
                // POST
                ...PostDescription_1.postOperations,
                ...PostDescription_1.postFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const workspaces = yield GenericFunctions_1.orbitApiRequest.call(this, 'GET', '/workspaces');
                        for (const workspace of workspaces.data) {
                            returnData.push({
                                name: workspace.attributes.name,
                                value: workspace.attributes.slug,
                            });
                        }
                        return returnData;
                    });
                },
                getActivityTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { data } = yield GenericFunctions_1.orbitApiRequest.call(this, 'GET', '/activity_types');
                        for (const activityType of data) {
                            returnData.push({
                                name: activityType.attributes.short_name,
                                value: activityType.id,
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
                    if (resource === 'activity') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const title = this.getNodeParameter('title', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                title,
                            };
                            if (additionalFields.description) {
                                body.description = additionalFields.description;
                            }
                            if (additionalFields.link) {
                                body.link = additionalFields.link;
                            }
                            if (additionalFields.linkText) {
                                body.link_text = additionalFields.linkText;
                            }
                            if (additionalFields.activityType) {
                                body.activity_type = additionalFields.activityType;
                            }
                            if (additionalFields.key) {
                                body.key = additionalFields.key;
                            }
                            if (additionalFields.occurredAt) {
                                body.occurred_at = additionalFields.occurredAt;
                            }
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'POST', `/${workspaceId}/members/${memberId}/activities`, body);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            let endpoint = `/${workspaceId}/activities`;
                            if (filters.memberId) {
                                endpoint = `/${workspaceId}/members/${filters.memberId}/activities`;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (resource === 'member') {
                        if (operation === 'upsert') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const member = {};
                            const identity = {};
                            if (additionalFields.bio) {
                                member.bio = additionalFields.bio;
                            }
                            if (additionalFields.birthday) {
                                member.birthday = (0, moment_1.default)(additionalFields.birthday).format('MM-DD-YYYY');
                            }
                            if (additionalFields.company) {
                                member.company = additionalFields.company;
                            }
                            if (additionalFields.location) {
                                member.location = additionalFields.location;
                            }
                            if (additionalFields.name) {
                                member.name = additionalFields.name;
                            }
                            if (additionalFields.bio) {
                                member.bio = additionalFields.bio;
                            }
                            if (additionalFields.pronouns) {
                                member.pronouns = additionalFields.pronouns;
                            }
                            if (additionalFields.shippingAddress) {
                                member.shipping_address = additionalFields.shippingAddress;
                            }
                            if (additionalFields.slug) {
                                member.slug = additionalFields.slug;
                            }
                            if (additionalFields.tagsToAdd) {
                                member.tags_to_add = additionalFields.tagsToAdd;
                            }
                            if (additionalFields.tagList) {
                                member.tag_list = additionalFields.tagList;
                            }
                            if (additionalFields.tshirt) {
                                member.tshirt = additionalFields.tshirt;
                            }
                            if (additionalFields.hasOwnProperty('teammate')) {
                                member.teammate = additionalFields.teammate;
                            }
                            if (additionalFields.url) {
                                member.url = additionalFields.url;
                            }
                            const data = this.getNodeParameter('identityUi', i).identityValue;
                            if (data) {
                                if (['github', 'twitter', 'discourse'].includes(data.source)) {
                                    identity.source = data.source;
                                    const searchBy = data.searchBy;
                                    if (searchBy === 'id') {
                                        identity.uid = data.id;
                                    }
                                    else {
                                        identity.username = data.username;
                                    }
                                    if (data.source === 'discourse') {
                                        identity.source_host = data.host;
                                    }
                                }
                                else {
                                    //it's email
                                    identity.email = data.email;
                                }
                            }
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'POST', `/${workspaceId}/members`, { member, identity });
                            responseData = responseData.data;
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'DELETE', `/${workspaceId}/members/${memberId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const resolve = this.getNodeParameter('resolveIdentities', 0);
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'GET', `/${workspaceId}/members/${memberId}`);
                            if (resolve === true) {
                                (0, GenericFunctions_1.resolveIdentities)(responseData);
                            }
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            qs.resolveIdentities = this.getNodeParameter('resolveIdentities', 0);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', `/${workspaceId}/members`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', `/${workspaceId}/members`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'lookup') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const source = this.getNodeParameter('source', i);
                            if (['github', 'twitter', 'discourse'].includes(source)) {
                                qs.source = this.getNodeParameter('source', i);
                                const searchBy = this.getNodeParameter('searchBy', i);
                                if (searchBy === 'id') {
                                    qs.uid = this.getNodeParameter('id', i);
                                }
                                else {
                                    qs.username = this.getNodeParameter('username', i);
                                }
                                if (source === 'discourse') {
                                    qs.source_host = this.getNodeParameter('host', i);
                                }
                            }
                            else {
                                //it's email
                                qs.email = this.getNodeParameter('email', i);
                            }
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'GET', `/${workspaceId}/members/find`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.bio) {
                                body.bio = updateFields.bio;
                            }
                            if (updateFields.birthday) {
                                body.birthday = (0, moment_1.default)(updateFields.birthday).format('MM-DD-YYYY');
                            }
                            if (updateFields.company) {
                                body.company = updateFields.company;
                            }
                            if (updateFields.location) {
                                body.location = updateFields.location;
                            }
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.bio) {
                                body.bio = updateFields.bio;
                            }
                            if (updateFields.pronouns) {
                                body.pronouns = updateFields.pronouns;
                            }
                            if (updateFields.shippingAddress) {
                                body.shipping_address = updateFields.shippingAddress;
                            }
                            if (updateFields.slug) {
                                body.slug = updateFields.slug;
                            }
                            if (updateFields.tagsToAdd) {
                                body.tags_to_add = updateFields.tagsToAdd;
                            }
                            if (updateFields.tagList) {
                                body.tag_list = updateFields.tagList;
                            }
                            if (updateFields.tshirt) {
                                body.tshirt = updateFields.tshirt;
                            }
                            if (updateFields.hasOwnProperty('teammate')) {
                                body.teammate = updateFields.teammate;
                            }
                            if (updateFields.url) {
                                body.url = updateFields.url;
                            }
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'PUT', `/${workspaceId}/members/${memberId}`, body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'note') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const note = this.getNodeParameter('note', i);
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'POST', `/${workspaceId}/members/${memberId}/notes`, { body: note });
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            qs.resolveMember = this.getNodeParameter('resolveMember', 0);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', `/${workspaceId}/members/${memberId}/notes`, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', `/${workspaceId}/members/${memberId}/notes`, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'update') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const noteId = this.getNodeParameter('noteId', i);
                            const note = this.getNodeParameter('note', i);
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'PUT', `/${workspaceId}/members/${memberId}/notes/${noteId}`, { body: note });
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'post') {
                        if (operation === 'create') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const url = this.getNodeParameter('url', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                type: 'post',
                                activity_type: 'post',
                                url,
                            };
                            if (additionalFields.publishedAt) {
                                body.occurred_at = additionalFields.publishedAt;
                                delete body.publishedAt;
                            }
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'POST', `/${workspaceId}/members/${memberId}/activities/`, body);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            let endpoint = `/${workspaceId}/activities`;
                            qs.type = 'content';
                            if (filters.memberId) {
                                endpoint = `/${workspaceId}/members/${filters.memberId}/activities`;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.orbitApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                        if (operation === 'delete') {
                            const workspaceId = this.getNodeParameter('workspaceId', i);
                            const memberId = this.getNodeParameter('memberId', i);
                            const postId = this.getNodeParameter('postId', i);
                            responseData = yield GenericFunctions_1.orbitApiRequest.call(this, 'DELETE', `/${workspaceId}/members/${memberId}/activities/${postId}`);
                            responseData = { success: true };
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
exports.Orbit = Orbit;
