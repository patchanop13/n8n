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
exports.Misp = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class Misp {
    constructor() {
        this.description = {
            displayName: 'MISP',
            name: 'misp',
            icon: 'file:misp.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the MISP API',
            defaults: {
                name: 'MISP',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mispApi',
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
                            name: 'Attribute',
                            value: 'attribute',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Event Tag',
                            value: 'eventTag',
                        },
                        {
                            name: 'Feed',
                            value: 'feed',
                        },
                        {
                            name: 'Galaxy',
                            value: 'galaxy',
                        },
                        {
                            name: 'Noticelist',
                            value: 'noticelist',
                        },
                        {
                            name: 'Organisation',
                            value: 'organisation',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                        {
                            name: 'Warninglist',
                            value: 'warninglist',
                        },
                    ],
                    default: 'attribute',
                },
                ...descriptions_1.attributeOperations,
                ...descriptions_1.attributeFields,
                ...descriptions_1.eventOperations,
                ...descriptions_1.eventFields,
                ...descriptions_1.eventTagOperations,
                ...descriptions_1.eventTagFields,
                ...descriptions_1.feedOperations,
                ...descriptions_1.feedFields,
                ...descriptions_1.galaxyOperations,
                ...descriptions_1.galaxyFields,
                ...descriptions_1.noticelistOperations,
                ...descriptions_1.noticelistFields,
                ...descriptions_1.organisationOperations,
                ...descriptions_1.organisationFields,
                ...descriptions_1.tagOperations,
                ...descriptions_1.tagFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
                ...descriptions_1.warninglistOperations,
                ...descriptions_1.warninglistFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getOrgs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/organisations');
                        return responseData.map((i) => ({ name: i.Organisation.name, value: i.Organisation.id }));
                    });
                },
                getSharingGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/sharing_groups');
                        return responseData.response.map((i) => ({ name: i.SharingGroup.name, value: i.SharingGroup.id }));
                    });
                },
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/tags');
                        return responseData.Tag.map((i) => ({ name: i.name, value: i.id }));
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/admin/users');
                        return responseData.map((i) => ({ name: i.User.email, value: i.User.id }));
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'attribute') {
                        // **********************************************************************
                        //                               attribute
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            attribute: create
                            // ----------------------------------------
                            const body = {
                                type: this.getNodeParameter('type', i),
                                value: this.getNodeParameter('value', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            GenericFunctions_1.throwOnMissingSharingGroup.call(this, additionalFields);
                            if (Object.keys(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/attributes/add/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint, body);
                            responseData = responseData.Attribute;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            attribute: delete
                            // ----------------------------------------
                            const attributeId = this.getNodeParameter('attributeId', i);
                            const endpoint = `/attributes/delete/${attributeId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              attribute: get
                            // ----------------------------------------
                            const attributeId = this.getNodeParameter('attributeId', i);
                            const endpoint = `/attributes/view/${attributeId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Attribute;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            attribute: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/attributes');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            attribute: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            GenericFunctions_1.throwOnMissingSharingGroup.call(this, updateFields);
                            Object.assign(body, updateFields);
                            const attributeId = this.getNodeParameter('attributeId', i);
                            const endpoint = `/attributes/edit/${attributeId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.Attribute;
                        }
                    }
                    else if (resource === 'event') {
                        // **********************************************************************
                        //                                 event
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              event: create
                            // ----------------------------------------
                            const body = {
                                org_id: this.getNodeParameter('org_id', i),
                                info: this.getNodeParameter('information', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            GenericFunctions_1.throwOnMissingSharingGroup.call(this, additionalFields);
                            if (Object.keys(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', '/events', body);
                            responseData = responseData.Event;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              event: delete
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/delete/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                event: get
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/view/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Event;
                            delete responseData.Attribute; // prevent excessive payload size
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              event: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/events');
                        }
                        else if (operation === 'publish') {
                            // ----------------------------------------
                            //              event: publish
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/publish/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint);
                        }
                        else if (operation === 'unpublish') {
                            // ----------------------------------------
                            //             event: unpublish
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/unpublish/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              event: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            GenericFunctions_1.throwOnMissingSharingGroup.call(this, updateFields);
                            Object.assign(body, updateFields);
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/edit/${eventId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.Event;
                            delete responseData.Attribute; // prevent excessive payload size
                        }
                    }
                    else if (resource === 'eventTag') {
                        if (operation === 'add') {
                            // ----------------------------------------
                            //             eventTag: add
                            // ----------------------------------------
                            const body = {
                                event: this.getNodeParameter('eventId', i),
                                tag: this.getNodeParameter('tagId', i),
                            };
                            const endpoint = `/events/addTag`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint, body);
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------------
                            //             eventTag: remove
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const tagId = this.getNodeParameter('tagId', i);
                            const endpoint = `/events/removeTag/${eventId}/${tagId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint);
                        }
                    }
                    else if (resource === 'feed') {
                        // **********************************************************************
                        //                                  feed
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               feed: create
                            // ----------------------------------------
                            const url = this.getNodeParameter('url', i);
                            GenericFunctions_1.throwOnInvalidUrl.call(this, url);
                            const body = {
                                name: this.getNodeParameter('name', i),
                                provider: this.getNodeParameter('provider', i),
                                url,
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', '/feeds/add', body);
                            responseData = responseData.Feed;
                        }
                        else if (operation === 'disable') {
                            // ----------------------------------------
                            //              feed: disable
                            // ----------------------------------------
                            const feedId = this.getNodeParameter('feedId', i);
                            const endpoint = `/feeds/disable/${feedId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint);
                        }
                        else if (operation === 'enable') {
                            // ----------------------------------------
                            //               feed: enable
                            // ----------------------------------------
                            const feedId = this.getNodeParameter('feedId', i);
                            const endpoint = `/feeds/enable/${feedId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                feed: get
                            // ----------------------------------------
                            const feedId = this.getNodeParameter('feedId', i);
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', `/feeds/view/${feedId}`);
                            responseData = responseData.Feed;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               feed: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/feeds'));
                            responseData = responseData.map(i => i.Feed);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               feed: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            if (updateFields.url) {
                                GenericFunctions_1.throwOnInvalidUrl.call(this, updateFields.url);
                            }
                            Object.assign(body, updateFields);
                            const feedId = this.getNodeParameter('feedId', i);
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'PUT', `/feeds/edit/${feedId}`, body);
                            responseData = responseData.Feed;
                        }
                    }
                    else if (resource === 'galaxy') {
                        // **********************************************************************
                        //                                 galaxy
                        // **********************************************************************
                        if (operation === 'delete') {
                            // ----------------------------------------
                            //              galaxy: delete
                            // ----------------------------------------
                            const galaxyId = this.getNodeParameter('galaxyId', i);
                            const endpoint = `/galaxies/delete/${galaxyId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               galaxy: get
                            // ----------------------------------------
                            const galaxyId = this.getNodeParameter('galaxyId', i);
                            const endpoint = `/galaxies/view/${galaxyId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Galaxy;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              galaxy: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/galaxies'));
                            responseData = responseData.map(i => i.Galaxy);
                        }
                    }
                    else if (resource === 'noticelist') {
                        // **********************************************************************
                        //                               noticelist
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             noticelist: get
                            // ----------------------------------------
                            const noticelistId = this.getNodeParameter('noticelistId', i);
                            const endpoint = `/noticelists/view/${noticelistId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Noticelist;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            noticelist: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/noticelists'));
                            responseData = responseData.map(i => i.Noticelist);
                        }
                    }
                    else if (resource === 'organisation') {
                        // **********************************************************************
                        //                              organisation
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //           organisation: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            const endpoint = '/admin/organisations/add';
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', endpoint, body);
                            responseData = responseData.Organisation;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //           organisation: delete
                            // ----------------------------------------
                            const organisationId = this.getNodeParameter('organisationId', i);
                            const endpoint = `/admin/organisations/delete/${organisationId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //            organisation: get
                            // ----------------------------------------
                            const organisationId = this.getNodeParameter('organisationId', i);
                            const endpoint = `/organisations/view/${organisationId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Organisation;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           organisation: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/organisations'));
                            responseData = responseData.map(i => i.Organisation);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //           organisation: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            Object.assign(body, updateFields);
                            const organisationId = this.getNodeParameter('organisationId', i);
                            const endpoint = `/admin/organisations/edit/${organisationId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.Organisation;
                        }
                    }
                    else if (resource === 'tag') {
                        // **********************************************************************
                        //                                  tag
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               tag: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const { colour } = this.getNodeParameter('additionalFields', i);
                            if (colour) {
                                Object.assign(body, {
                                    colour: !colour.startsWith('#') ? `#${colour}` : colour,
                                });
                            }
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', '/tags/add', body);
                            responseData = responseData.Tag;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               tag: delete
                            // ----------------------------------------
                            const tagId = this.getNodeParameter('tagId', i);
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', `/tags/delete/${tagId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               tag: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/tags'));
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.Tag.slice(0, limit);
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               tag: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            Object.assign(body, updateFields);
                            const { colour, name } = updateFields;
                            Object.assign(body, Object.assign(Object.assign({}, name && { name }), colour && { colour: !colour.startsWith('#') ? `#${colour}` : colour }));
                            const tagId = this.getNodeParameter('tagId', i);
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', `/tags/edit/${tagId}`, body);
                            responseData = responseData.Tag;
                        }
                    }
                    else if (resource === 'user') {
                        // **********************************************************************
                        //                                  user
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               user: create
                            // ----------------------------------------
                            const body = {
                                email: this.getNodeParameter('email', i),
                                role_id: this.getNodeParameter('role_id', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields)) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'POST', '/admin/users/add', body);
                            responseData = responseData.User;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               user: delete
                            // ----------------------------------------
                            const userId = this.getNodeParameter('userId', i);
                            const endpoint = `/admin/users/delete/${userId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                user: get
                            // ----------------------------------------
                            const userId = this.getNodeParameter('userId', i);
                            const endpoint = `/admin/users/view/${userId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.User;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               user: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequestAllItems.call(this, '/admin/users'));
                            responseData = responseData.map(i => i.User);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               user: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource, updateFields);
                            Object.assign(body, updateFields);
                            const userId = this.getNodeParameter('userId', i);
                            const endpoint = `/admin/users/edit/${userId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.User;
                        }
                    }
                    else if (resource === 'warninglist') {
                        // **********************************************************************
                        //                              warninglist
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             warninglist: get
                            // ----------------------------------------
                            const warninglistId = this.getNodeParameter('warninglistId', i);
                            const endpoint = `/warninglists/view/${warninglistId}`;
                            responseData = yield GenericFunctions_1.mispApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.Warninglist;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           warninglist: getAll
                            // ----------------------------------------
                            responseData = (yield GenericFunctions_1.mispApiRequest.call(this, 'GET', '/warninglists'));
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.Warninglists.slice(0, limit).map(i => i.Warninglist);
                            }
                            else {
                                responseData = responseData.Warninglists.map(i => i.Warninglist);
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
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Misp = Misp;
