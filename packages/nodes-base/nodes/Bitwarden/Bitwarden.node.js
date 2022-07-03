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
exports.Bitwarden = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const CollectionDescription_1 = require("./descriptions/CollectionDescription");
const EventDescription_1 = require("./descriptions/EventDescription");
const GroupDescription_1 = require("./descriptions/GroupDescription");
const MemberDescription_1 = require("./descriptions/MemberDescription");
const lodash_1 = require("lodash");
class Bitwarden {
    constructor() {
        this.description = {
            displayName: 'Bitwarden',
            name: 'bitwarden',
            icon: 'file:bitwarden.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Bitwarden API',
            defaults: {
                name: 'Bitwarden',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'bitwardenApi',
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
                            name: 'Collection',
                            value: 'collection',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'Member',
                            value: 'member',
                        },
                    ],
                    default: 'collection',
                },
                ...CollectionDescription_1.collectionOperations,
                ...CollectionDescription_1.collectionFields,
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                ...GroupDescription_1.groupOperations,
                ...GroupDescription_1.groupFields,
                ...MemberDescription_1.memberOperations,
                ...MemberDescription_1.memberFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'groups');
                    });
                },
                getCollections() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'collections');
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
            const token = yield GenericFunctions_1.getAccessToken.call(this);
            const bitwardenApiRequest = (0, lodash_1.partialRight)(GenericFunctions_1.bitwardenApiRequest, token);
            const handleGetAll = (0, lodash_1.partialRight)(GenericFunctions_1.handleGetAll, token);
            for (let i = 0; i < items.length; i++) {
                if (resource === 'collection') {
                    // *********************************************************************
                    //       collection
                    // *********************************************************************
                    if (operation === 'delete') {
                        // ----------------------------------
                        //       collection: delete
                        // ----------------------------------
                        const id = this.getNodeParameter('collectionId', i);
                        const endpoint = `/public/collections/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //        collection: get
                        // ----------------------------------
                        const id = this.getNodeParameter('collectionId', i);
                        const endpoint = `/public/collections/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //       collection: getAll
                        // ----------------------------------
                        const endpoint = '/public/collections';
                        responseData = yield handleGetAll.call(this, i, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //       collection: update
                        // ----------------------------------
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if ((0, lodash_1.isEmpty)(updateFields)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                        }
                        const { groups, externalId } = updateFields;
                        const body = {};
                        if (groups) {
                            body.groups = groups.map((groupId) => ({
                                id: groupId,
                                ReadOnly: false,
                            }));
                        }
                        if (externalId) {
                            body.externalId = externalId;
                        }
                        const id = this.getNodeParameter('collectionId', i);
                        const endpoint = `/public/collections/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'PUT', endpoint, {}, body);
                    }
                }
                else if (resource === 'event') {
                    // *********************************************************************
                    //       event
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //         event: getAll
                        // ----------------------------------
                        const filters = this.getNodeParameter('filters', i);
                        const qs = (0, lodash_1.isEmpty)(filters) ? {} : filters;
                        const endpoint = '/public/events';
                        responseData = yield handleGetAll.call(this, i, 'GET', endpoint, qs, {});
                    }
                }
                else if (resource === 'group') {
                    // *********************************************************************
                    //       group
                    // *********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //       group: create
                        // ----------------------------------
                        const body = {
                            name: this.getNodeParameter('name', i),
                            AccessAll: this.getNodeParameter('accessAll', i),
                        };
                        const { collections, externalId, } = this.getNodeParameter('additionalFields', i);
                        if (collections) {
                            body.collections = collections.map((collectionId) => ({
                                id: collectionId,
                                ReadOnly: false,
                            }));
                        }
                        if (externalId) {
                            body.externalId = externalId;
                        }
                        const endpoint = '/public/groups';
                        responseData = yield bitwardenApiRequest.call(this, 'POST', endpoint, {}, body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //       group: delete
                        // ----------------------------------
                        const id = this.getNodeParameter('groupId', i);
                        const endpoint = `/public/groups/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //        group: get
                        // ----------------------------------
                        const id = this.getNodeParameter('groupId', i);
                        const endpoint = `/public/groups/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //       group: getAll
                        // ----------------------------------
                        const endpoint = '/public/groups';
                        responseData = yield handleGetAll.call(this, i, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'getMembers') {
                        // ----------------------------------
                        //       group: getMembers
                        // ----------------------------------
                        const id = this.getNodeParameter('groupId', i);
                        const endpoint = `/public/groups/${id}/member-ids`;
                        responseData = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {});
                        responseData = responseData.map((memberId) => ({ memberId }));
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //       group: update
                        // ----------------------------------
                        const groupId = this.getNodeParameter('groupId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if ((0, lodash_1.isEmpty)(updateFields)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                        }
                        // set defaults for `name` and `accessAll`, required by Bitwarden but optional in n8n
                        let { name, accessAll } = updateFields;
                        if (name === undefined) {
                            responseData = (yield bitwardenApiRequest.call(this, 'GET', `/public/groups/${groupId}`, {}, {}));
                            name = responseData.name;
                        }
                        if (accessAll === undefined) {
                            accessAll = false;
                        }
                        const body = {
                            name,
                            AccessAll: accessAll,
                        };
                        const { collections, externalId } = updateFields;
                        if (collections) {
                            body.collections = collections.map((collectionId) => ({
                                id: collectionId,
                                ReadOnly: false,
                            }));
                        }
                        if (externalId) {
                            body.externalId = externalId;
                        }
                        const endpoint = `/public/groups/${groupId}`;
                        responseData = yield bitwardenApiRequest.call(this, 'PUT', endpoint, {}, body);
                    }
                    else if (operation === 'updateMembers') {
                        // ----------------------------------
                        //       group: updateMembers
                        // ----------------------------------
                        const memberIds = this.getNodeParameter('memberIds', i);
                        const body = {
                            memberIds: memberIds.includes(',') ? memberIds.split(',') : [memberIds],
                        };
                        const groupId = this.getNodeParameter('groupId', i);
                        const endpoint = `/public/groups/${groupId}/member-ids`;
                        responseData = yield bitwardenApiRequest.call(this, 'PUT', endpoint, {}, body);
                        responseData = { success: true };
                    }
                }
                else if (resource === 'member') {
                    // *********************************************************************
                    //       member
                    // *********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //       member: create
                        // ----------------------------------
                        const body = {
                            email: this.getNodeParameter('email', i),
                            type: this.getNodeParameter('type', i),
                            AccessAll: this.getNodeParameter('accessAll', i),
                        };
                        const { collections, externalId, } = this.getNodeParameter('additionalFields', i);
                        if (collections) {
                            body.collections = collections.map((collectionId) => ({
                                id: collectionId,
                                ReadOnly: false,
                            }));
                        }
                        if (externalId) {
                            body.externalId = externalId;
                        }
                        const endpoint = '/public/members/';
                        responseData = yield bitwardenApiRequest.call(this, 'POST', endpoint, {}, body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //       member: delete
                        // ----------------------------------
                        const id = this.getNodeParameter('memberId', i);
                        const endpoint = `/public/members/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //        member: get
                        // ----------------------------------
                        const id = this.getNodeParameter('memberId', i);
                        const endpoint = `/public/members/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //       member: getAll
                        // ----------------------------------
                        const endpoint = '/public/members';
                        responseData = yield handleGetAll.call(this, i, 'GET', endpoint, {}, {});
                    }
                    else if (operation === 'getGroups') {
                        // ----------------------------------
                        //       member: getGroups
                        // ----------------------------------
                        const id = this.getNodeParameter('memberId', i);
                        const endpoint = `/public/members/${id}/group-ids`;
                        responseData = yield bitwardenApiRequest.call(this, 'GET', endpoint, {}, {});
                        responseData = responseData.map((groupId) => ({ groupId }));
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //       member: update
                        // ----------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if ((0, lodash_1.isEmpty)(updateFields)) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                        }
                        const { accessAll, collections, externalId, type } = updateFields;
                        if (accessAll !== undefined) {
                            body.AccessAll = accessAll;
                        }
                        if (collections) {
                            body.collections = collections.map((collectionId) => ({
                                id: collectionId,
                                ReadOnly: false,
                            }));
                        }
                        if (externalId) {
                            body.externalId = externalId;
                        }
                        if (type !== undefined) {
                            body.Type = type;
                        }
                        const id = this.getNodeParameter('memberId', i);
                        const endpoint = `/public/members/${id}`;
                        responseData = yield bitwardenApiRequest.call(this, 'PUT', endpoint, {}, body);
                    }
                    else if (operation === 'updateGroups') {
                        // ----------------------------------
                        //       member: updateGroups
                        // ----------------------------------
                        const groupIds = this.getNodeParameter('groupIds', i);
                        const body = {
                            groupIds: groupIds.includes(',') ? groupIds.split(',') : [groupIds],
                        };
                        const memberId = this.getNodeParameter('memberId', i);
                        const endpoint = `/public/members/${memberId}/group-ids`;
                        responseData = yield bitwardenApiRequest.call(this, 'PUT', endpoint, {}, body);
                        responseData = { success: true };
                    }
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Bitwarden = Bitwarden;
