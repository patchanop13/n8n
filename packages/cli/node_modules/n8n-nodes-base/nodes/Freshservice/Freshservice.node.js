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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Freshservice = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
const moment_timezone_1 = require("moment-timezone");
class Freshservice {
    constructor() {
        this.description = {
            displayName: 'Freshservice',
            name: 'freshservice',
            icon: 'file:freshservice.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Freshservice API',
            defaults: {
                name: 'Freshservice',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'freshserviceApi',
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
                            name: 'Agent',
                            value: 'agent',
                        },
                        {
                            name: 'Agent Group',
                            value: 'agentGroup',
                        },
                        {
                            name: 'Agent Role',
                            value: 'agentRole',
                        },
                        {
                            name: 'Announcement',
                            value: 'announcement',
                        },
                        // {
                        // 	name: 'Asset',
                        // 	value: 'asset',
                        // },
                        {
                            name: 'Asset Type',
                            value: 'assetType',
                        },
                        {
                            name: 'Change',
                            value: 'change',
                        },
                        {
                            name: 'Department',
                            value: 'department',
                        },
                        {
                            name: 'Location',
                            value: 'location',
                        },
                        {
                            name: 'Problem',
                            value: 'problem',
                        },
                        {
                            name: 'Product',
                            value: 'product',
                        },
                        {
                            name: 'Release',
                            value: 'release',
                        },
                        {
                            name: 'Requester',
                            value: 'requester',
                        },
                        {
                            name: 'Requester Group',
                            value: 'requesterGroup',
                        },
                        {
                            name: 'Software',
                            value: 'software',
                        },
                        {
                            name: 'Ticket',
                            value: 'ticket',
                        },
                    ],
                    default: 'agent',
                },
                ...descriptions_1.agentOperations,
                ...descriptions_1.agentFields,
                ...descriptions_1.agentGroupOperations,
                ...descriptions_1.agentGroupFields,
                ...descriptions_1.agentRoleOperations,
                ...descriptions_1.agentRoleFields,
                ...descriptions_1.announcementOperations,
                ...descriptions_1.announcementFields,
                // ...assetOperations,
                // ...assetFields,
                ...descriptions_1.assetTypeOperations,
                ...descriptions_1.assetTypeFields,
                ...descriptions_1.changeOperations,
                ...descriptions_1.changeFields,
                ...descriptions_1.departmentOperations,
                ...descriptions_1.departmentFields,
                ...descriptions_1.locationOperations,
                ...descriptions_1.locationFields,
                ...descriptions_1.problemOperations,
                ...descriptions_1.problemFields,
                ...descriptions_1.productOperations,
                ...descriptions_1.productFields,
                ...descriptions_1.releaseOperations,
                ...descriptions_1.releaseFields,
                ...descriptions_1.requesterOperations,
                ...descriptions_1.requesterFields,
                ...descriptions_1.requesterGroupOperations,
                ...descriptions_1.requesterGroupFields,
                ...descriptions_1.softwareOperations,
                ...descriptions_1.softwareFields,
                ...descriptions_1.ticketOperations,
                ...descriptions_1.ticketFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getAgents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { agents } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/agents');
                        return (0, GenericFunctions_1.toUserOptions)(agents.filter((agent) => agent.active));
                    });
                },
                getAgentGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { groups } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/groups');
                        return (0, GenericFunctions_1.toOptions)(groups);
                    });
                },
                getAgentRoles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { roles } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/roles');
                        return (0, GenericFunctions_1.toOptions)(roles);
                    });
                },
                getAssetTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { asset_types } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/asset_types');
                        return (0, GenericFunctions_1.toOptions)(asset_types);
                    });
                },
                getAssetTypeFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const assetType = this.getCurrentNodeParameter('assetTypeId');
                        const { asset_type_fields } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/asset_types/${assetType}/fields`);
                        // tslint:disable-next-line: no-any
                        let fields = [];
                        fields = fields.concat(...asset_type_fields.map((data) => data.fields)).map(data => ({ name: data.label, id: data.name }));
                        return (0, GenericFunctions_1.toOptions)(fields);
                    });
                },
                getDepartments() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { departments } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/departments');
                        return (0, GenericFunctions_1.toOptions)(departments);
                    });
                },
                getLocations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { locations } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/locations');
                        return (0, GenericFunctions_1.toOptions)(locations);
                    });
                },
                getRequesters() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { requesters } = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', '/requesters');
                        return (0, GenericFunctions_1.toUserOptions)(requesters);
                    });
                },
            },
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const defaultTimezone = this.getTimezone();
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'agent') {
                        // **********************************************************************
                        //                                 agent
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              agent: create
                            // ----------------------------------------
                            const body = {
                                email: this.getNodeParameter('email', i),
                                first_name: this.getNodeParameter('firstName', i),
                            };
                            const roles = this.getNodeParameter('roles', i);
                            GenericFunctions_1.validateAssignmentScopeGroup.call(this, roles);
                            GenericFunctions_1.sanitizeAssignmentScopeGroup.call(this, roles);
                            Object.assign(body, (0, GenericFunctions_1.adjustAgentRoles)(roles));
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/agents', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              agent: delete
                            // ----------------------------------------
                            const agentId = this.getNodeParameter('agentId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', `/agents/${agentId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                agent: get
                            // ----------------------------------------
                            const agentId = this.getNodeParameter('agentId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/agents/${agentId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              agent: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/agents', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              agent: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const agentId = this.getNodeParameter('agentId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', `/agents/${agentId}`, body);
                        }
                    }
                    else if (resource === 'agentGroup') {
                        // **********************************************************************
                        //                               agentGroup
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            agentGroup: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/groups', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            agentGroup: delete
                            // ----------------------------------------
                            const agentGroupId = this.getNodeParameter('agentGroupId', i);
                            const endpoint = `/groups/${agentGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             agentGroup: get
                            // ----------------------------------------
                            const agentGroupId = this.getNodeParameter('agentGroupId', i);
                            const endpoint = `/groups/${agentGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            agentGroup: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/groups');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            agentGroup: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const agentGroupId = this.getNodeParameter('agentGroupId', i);
                            const endpoint = `/groups/${agentGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'agentRole') {
                        // **********************************************************************
                        //                               agentRole
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //              agentRole: get
                            // ----------------------------------------
                            const agentRoleId = this.getNodeParameter('agentRoleId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/roles/${agentRoleId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            agentRole: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/roles');
                        }
                    }
                    else if (resource === 'announcement') {
                        // **********************************************************************
                        //                              announcement
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //           announcement: create
                            // ----------------------------------------
                            const visibleFrom = this.getNodeParameter('visibleFrom', i);
                            const body = {
                                title: this.getNodeParameter('title', i),
                                body_html: this.getNodeParameter('bodyHtml', i),
                                visibility: this.getNodeParameter('visibility', i),
                                visible_from: (0, moment_timezone_1.tz)(visibleFrom, defaultTimezone),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                const { visible_till, additional_emails } = additionalFields, rest = __rest(additionalFields, ["visible_till", "additional_emails"]);
                                Object.assign(body, Object.assign(Object.assign(Object.assign({}, (additional_emails && { additional_emails: (0, GenericFunctions_1.toArray)(additional_emails) })), (visible_till && { visible_till: (0, moment_timezone_1.tz)(visible_till, defaultTimezone) })), rest));
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/announcements', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //           announcement: delete
                            // ----------------------------------------
                            const announcementId = this.getNodeParameter('announcementId', i);
                            const endpoint = `/announcements/${announcementId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //            announcement: get
                            // ----------------------------------------
                            const announcementId = this.getNodeParameter('announcementId', i);
                            const endpoint = `/announcements/${announcementId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           announcement: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/announcements');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //           announcement: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            const { visible_till, additional_emails } = updateFields, rest = __rest(updateFields, ["visible_till", "additional_emails"]);
                            Object.assign(body, Object.assign(Object.assign(Object.assign({}, (additional_emails && { additional_emails: (0, GenericFunctions_1.toArray)(additional_emails) })), (visible_till && { visible_till: (0, moment_timezone_1.tz)(visible_till, defaultTimezone) })), rest));
                            const announcementId = this.getNodeParameter('announcementId', i);
                            const endpoint = `/announcements/${announcementId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'asset') {
                        // **********************************************************************
                        //                                 asset
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              asset: create
                            // ----------------------------------------
                            const body = {
                                asset_type_id: this.getNodeParameter('assetTypeId', i),
                                name: this.getNodeParameter('name', i),
                            };
                            const assetFields = this.getNodeParameter('assetFieldsUi.assetFieldValue', i, []);
                            Object.assign(body, { type_fields: assetFields.reduce((obj, value) => Object.assign(obj, { [`${value.name}`]: value.value }), {}) });
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/assets', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              asset: delete
                            // ----------------------------------------
                            const assetDisplayId = this.getNodeParameter('assetDisplayId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', `/assets/${assetDisplayId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                asset: get
                            // ----------------------------------------
                            const assetDisplayId = this.getNodeParameter('assetDisplayId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/assets/${assetDisplayId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              asset: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/assets', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              asset: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const assetDisplayId = this.getNodeParameter('assetDisplayId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', `/assets/${assetDisplayId}`, body);
                        }
                    }
                    else if (resource === 'assetType') {
                        // **********************************************************************
                        //                               assetType
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            assetType: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/asset_types', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            assetType: delete
                            // ----------------------------------------
                            const assetTypeId = this.getNodeParameter('assetTypeId', i);
                            const endpoint = `/asset_types/${assetTypeId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              assetType: get
                            // ----------------------------------------
                            const assetTypeId = this.getNodeParameter('assetTypeId', i);
                            const endpoint = `/asset_types/${assetTypeId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            assetType: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/asset_types');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            assetType: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const assetTypeId = this.getNodeParameter('assetTypeId', i);
                            const endpoint = `/asset_types/${assetTypeId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'change') {
                        // **********************************************************************
                        //                                 change
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              change: create
                            // ----------------------------------------
                            const body = {
                                requester_id: this.getNodeParameter('requesterId', i),
                                subject: this.getNodeParameter('subject', i),
                                planned_start_date: this.getNodeParameter('plannedStartDate', i),
                                planned_end_date: this.getNodeParameter('plannedEndDate', i),
                                status: 1,
                                priority: 1,
                                impact: 1,
                                risk: 1,
                                change_type: 1,
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/changes', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              change: delete
                            // ----------------------------------------
                            const changeId = this.getNodeParameter('changeId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', `/changes/${changeId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               change: get
                            // ----------------------------------------
                            const changeId = this.getNodeParameter('changeId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/changes/${changeId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              change: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/changes', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              change: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const changeId = this.getNodeParameter('changeId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', `/changes/${changeId}`, body);
                        }
                    }
                    else if (resource === 'department') {
                        // **********************************************************************
                        //                               department
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            department: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                const { domains } = additionalFields, rest = __rest(additionalFields, ["domains"]);
                                Object.assign(body, Object.assign(Object.assign({}, (domains && { domains: (0, GenericFunctions_1.toArray)(domains) })), rest));
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/departments', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            department: delete
                            // ----------------------------------------
                            const departmentId = this.getNodeParameter('departmentId', i);
                            const endpoint = `/departments/${departmentId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             department: get
                            // ----------------------------------------
                            const departmentId = this.getNodeParameter('departmentId', i);
                            const endpoint = `/departments/${departmentId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            department: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/departments', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            department: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            const { domains } = updateFields, rest = __rest(updateFields, ["domains"]);
                            Object.assign(body, Object.assign(Object.assign({}, (domains && { domains: (0, GenericFunctions_1.toArray)(domains) })), rest));
                            const departmentId = this.getNodeParameter('departmentId', i);
                            const endpoint = `/departments/${departmentId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'location') {
                        // **********************************************************************
                        //                                location
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             location: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAddress)(additionalFields));
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/locations', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             location: delete
                            // ----------------------------------------
                            const locationId = this.getNodeParameter('locationId', i);
                            const endpoint = `/locations/${locationId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              location: get
                            // ----------------------------------------
                            const locationId = this.getNodeParameter('locationId', i);
                            const endpoint = `/locations/${locationId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             location: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/locations');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             location: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, (0, GenericFunctions_1.adjustAddress)(updateFields));
                            const locationId = this.getNodeParameter('locationId', i);
                            const endpoint = `/locations/${locationId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'problem') {
                        // **********************************************************************
                        //                                problem
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             problem: create
                            // ----------------------------------------
                            const body = {
                                subject: this.getNodeParameter('subject', i),
                                requester_id: this.getNodeParameter('requesterId', i),
                                due_by: this.getNodeParameter('dueBy', i),
                                status: 1,
                                priority: 1,
                                impact: 1,
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/problems', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             problem: delete
                            // ----------------------------------------
                            const problemId = this.getNodeParameter('problemId', i);
                            const endpoint = `/problems/${problemId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               problem: get
                            // ----------------------------------------
                            const problemId = this.getNodeParameter('problemId', i);
                            const endpoint = `/problems/${problemId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             problem: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/problems');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             problem: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const problemId = this.getNodeParameter('problemId', i);
                            const endpoint = `/problems/${problemId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'product') {
                        // **********************************************************************
                        //                                product
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             product: create
                            // ----------------------------------------
                            const body = {
                                asset_type_id: this.getNodeParameter('assetTypeId', i),
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/products', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             product: delete
                            // ----------------------------------------
                            const productId = this.getNodeParameter('productId', i);
                            const endpoint = `/products/${productId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               product: get
                            // ----------------------------------------
                            const productId = this.getNodeParameter('productId', i);
                            const endpoint = `/products/${productId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             product: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/products');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             product: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                            const productId = this.getNodeParameter('productId', i);
                            const endpoint = `/products/${productId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'release') {
                        // **********************************************************************
                        //                                release
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             release: create
                            // ----------------------------------------
                            const body = {
                                subject: this.getNodeParameter('subject', i),
                                release_type: this.getNodeParameter('releaseType', i),
                                status: this.getNodeParameter('status', i),
                                priority: this.getNodeParameter('priority', i),
                                planned_start_date: this.getNodeParameter('plannedStartDate', i),
                                planned_end_date: this.getNodeParameter('plannedEndDate', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/releases', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             release: delete
                            // ----------------------------------------
                            const releaseId = this.getNodeParameter('releaseId', i);
                            const endpoint = `/releases/${releaseId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               release: get
                            // ----------------------------------------
                            const releaseId = this.getNodeParameter('releaseId', i);
                            const endpoint = `/releases/${releaseId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             release: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/releases');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             release: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                            const releaseId = this.getNodeParameter('releaseId', i);
                            const endpoint = `/releases/${releaseId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'requester') {
                        // **********************************************************************
                        //                               requester
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            requester: create
                            // ----------------------------------------
                            const body = {
                                first_name: this.getNodeParameter('firstName', i),
                                primary_email: this.getNodeParameter('primaryEmail', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                const { secondary_emails } = additionalFields, rest = __rest(additionalFields, ["secondary_emails"]);
                                Object.assign(body, Object.assign(Object.assign({}, (secondary_emails && { secondary_emails: (0, GenericFunctions_1.toArray)(secondary_emails) })), rest));
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/requesters', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //            requester: delete
                            // ----------------------------------------
                            const requesterId = this.getNodeParameter('requesterId', i);
                            const endpoint = `/requesters/${requesterId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              requester: get
                            // ----------------------------------------
                            const requesterId = this.getNodeParameter('requesterId', i);
                            const endpoint = `/requesters/${requesterId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            requester: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/requesters', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            requester: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            const { secondary_emails } = updateFields, rest = __rest(updateFields, ["secondary_emails"]);
                            Object.assign(body, Object.assign(Object.assign({}, (secondary_emails && { secondary_emails: (0, GenericFunctions_1.toArray)(secondary_emails) })), rest));
                            const requesterId = this.getNodeParameter('requesterId', i);
                            const endpoint = `/requesters/${requesterId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'requesterGroup') {
                        // **********************************************************************
                        //                             requesterGroup
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //          requesterGroup: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/requester_groups', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //          requesterGroup: delete
                            // ----------------------------------------
                            const requesterGroupId = this.getNodeParameter('requesterGroupId', i);
                            const endpoint = `/requester_groups/${requesterGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //           requesterGroup: get
                            // ----------------------------------------
                            const requesterGroupId = this.getNodeParameter('requesterGroupId', i);
                            const endpoint = `/requester_groups/${requesterGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //          requesterGroup: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/requester_groups');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //          requesterGroup: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const requesterGroupId = this.getNodeParameter('requesterGroupId', i);
                            const endpoint = `/requester_groups/${requesterGroupId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'software') {
                        // **********************************************************************
                        //                                software
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             software: create
                            // ----------------------------------------
                            const body = {
                                application: {
                                    application_type: this.getNodeParameter('applicationType', i),
                                    name: this.getNodeParameter('name', i),
                                },
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body.application, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/applications', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             software: delete
                            // ----------------------------------------
                            const softwareId = this.getNodeParameter('softwareId', i);
                            const endpoint = `/applications/${softwareId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', endpoint);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              software: get
                            // ----------------------------------------
                            const softwareId = this.getNodeParameter('softwareId', i);
                            const endpoint = `/applications/${softwareId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             software: getAll
                            // ----------------------------------------
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/applications');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             software: update
                            // ----------------------------------------
                            const body = { application: {} };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body.application, updateFields);
                            const softwareId = this.getNodeParameter('softwareId', i);
                            const endpoint = `/applications/${softwareId}`;
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'ticket') {
                        // **********************************************************************
                        //                                 ticket
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              ticket: create
                            // ----------------------------------------
                            const body = {
                                email: this.getNodeParameter('email', i),
                                subject: this.getNodeParameter('subject', i),
                                description: this.getNodeParameter('description', i),
                                priority: this.getNodeParameter('priority', i),
                                status: this.getNodeParameter('status', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                const { cc_emails } = additionalFields, rest = __rest(additionalFields, ["cc_emails"]);
                                Object.assign(body, Object.assign(Object.assign({}, (cc_emails && { cc_emails: (0, GenericFunctions_1.toArray)(cc_emails) })), rest));
                            }
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'POST', '/tickets', body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //              ticket: delete
                            // ----------------------------------------
                            const ticketId = this.getNodeParameter('ticketId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'DELETE', `/tickets/${ticketId}`);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               ticket: get
                            // ----------------------------------------
                            const ticketId = this.getNodeParameter('ticketId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'GET', `/tickets/${ticketId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              ticket: getAll
                            // ----------------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            let endpoint = '';
                            if (Object.keys(filters).length) {
                                Object.assign(qs, (0, GenericFunctions_1.formatFilters)(filters));
                                endpoint = '/tickets/filter';
                            }
                            else {
                                endpoint = '/tickets';
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', endpoint, {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              ticket: update
                            // ----------------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            GenericFunctions_1.validateUpdateFields.call(this, updateFields, resource);
                            Object.assign(body, updateFields);
                            const ticketId = this.getNodeParameter('ticketId', i);
                            responseData = yield GenericFunctions_1.freshserviceApiRequest.call(this, 'PUT', `/tickets/${ticketId}`, body);
                        }
                    }
                    if (operation === 'delete' && !responseData) {
                        responseData = { success: true };
                    }
                    else if (operation !== 'getAll') {
                        const special = {
                            agentGroup: 'group',
                            agentRole: 'role',
                            assetType: 'asset_type',
                            requesterGroup: 'requester_group',
                            software: 'application',
                        };
                        responseData = (_a = responseData[special[resource]]) !== null && _a !== void 0 ? _a : responseData[resource];
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
exports.Freshservice = Freshservice;
