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
exports.Egoi = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Egoi {
    constructor() {
        this.description = {
            displayName: 'E-goi',
            name: 'egoi',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:egoi.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume E-goi API',
            defaults: {
                name: 'E-goi',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'egoiApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    options: [
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                    ],
                    default: 'contact',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a member',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a member',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all members',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a member',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'List Name or ID',
                    name: 'list',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getLists',
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                                'create',
                                'update',
                                'get',
                            ],
                        },
                    },
                    default: '',
                    description: 'ID of list to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: '',
                    description: 'Email address for a subscriber',
                },
                {
                    displayName: 'Contact ID',
                    name: 'contactId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'contact',
                            ],
                            operation: [
                                'update',
                            ],
                        },
                    },
                    default: '',
                    description: 'Contact ID of the subscriber',
                },
                {
                    displayName: 'Resolve Data',
                    name: 'resolveData',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                                'update',
                            ],
                        },
                    },
                    default: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'By default the response just includes the contact ID. If this option gets activated, it will resolve the data automatically.',
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
                                'contact',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Birth Date',
                            name: 'birth_date',
                            type: 'dateTime',
                            default: '',
                            description: 'Birth date of a subscriber',
                        },
                        {
                            displayName: 'Cellphone',
                            name: 'cellphone',
                            type: 'string',
                            default: '',
                            description: 'Cellphone of a subscriber',
                        },
                        {
                            displayName: 'Extra Fields',
                            name: 'extraFieldsUi',
                            type: 'fixedCollection',
                            placeholder: 'Add Field',
                            default: {},
                            typeOptions: {
                                multipleValues: true,
                            },
                            options: [
                                {
                                    displayName: 'Extra Field',
                                    name: 'extraFieldValues',
                                    typeOptions: {
                                        multipleValueButtonText: 'Add Field',
                                    },
                                    values: [
                                        {
                                            displayName: 'Field Name or ID',
                                            name: 'field_id',
                                            type: 'options',
                                            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                            typeOptions: {
                                                loadOptionsMethod: 'getExtraFields',
                                                loadOptionsDependsOn: [
                                                    'list',
                                                ],
                                            },
                                            default: '',
                                        },
                                        {
                                            displayName: 'Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'First Name',
                            name: 'first_name',
                            type: 'string',
                            default: '',
                            description: 'Name of a subscriber',
                        },
                        {
                            displayName: 'Last Name',
                            name: 'last_name',
                            type: 'string',
                            default: '',
                            description: 'Name of a subscriber',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Unconfirmed',
                                    value: 'unconfirmed',
                                },
                                {
                                    name: 'Active',
                                    value: 'active',
                                },
                                {
                                    name: 'Inactive',
                                    value: 'inactive',
                                },
                                {
                                    name: 'Removed',
                                    value: 'removed',
                                },
                            ],
                            default: 'active',
                            description: 'Subscriber\'s current status',
                        },
                        {
                            displayName: 'Tag Names or IDs',
                            name: 'tagIds',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getListTags',
                            },
                            default: [],
                            description: 'List of tag IDs to be added. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                //--------------------
                //----UPDATE MEMBER---
                //--------------------
                {
                    displayName: 'Update Fields',
                    name: 'updateFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'update',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Birth Date',
                            name: 'birth_date',
                            type: 'dateTime',
                            default: '',
                            description: 'Birth date of subscriber',
                        },
                        {
                            displayName: 'Cellphone',
                            name: 'cellphone',
                            type: 'string',
                            default: '',
                            description: 'Cellphone of subscriber',
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            placeholder: 'name@email.com',
                            default: '',
                            description: 'Email address for subscriber',
                        },
                        {
                            displayName: 'Extra Fields',
                            name: 'extraFieldsUi',
                            type: 'fixedCollection',
                            placeholder: 'Add Field',
                            default: {},
                            typeOptions: {
                                multipleValues: true,
                            },
                            options: [
                                {
                                    displayName: 'Extra Field',
                                    name: 'extraFieldValues',
                                    typeOptions: {
                                        multipleValueButtonText: 'Add Field',
                                    },
                                    values: [
                                        {
                                            displayName: 'Field Name or ID',
                                            name: 'field_id',
                                            type: 'options',
                                            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                                            typeOptions: {
                                                loadOptionsMethod: 'getExtraFields',
                                                loadOptionsDependsOn: [
                                                    'list',
                                                ],
                                            },
                                            default: '',
                                        },
                                        {
                                            displayName: 'Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'First Name',
                            name: 'first_name',
                            type: 'string',
                            default: '',
                            description: 'Name of subscriber',
                        },
                        {
                            displayName: 'Last Name',
                            name: 'last_name',
                            type: 'string',
                            default: '',
                            description: 'Name of subscriber',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Unconfirmed',
                                    value: 'unconfirmed',
                                },
                                {
                                    name: 'Active',
                                    value: 'active',
                                },
                                {
                                    name: 'Inactive',
                                    value: 'inactive',
                                },
                                {
                                    name: 'Removed',
                                    value: 'removed',
                                },
                            ],
                            default: 'active',
                            description: 'Subscriber\'s current status',
                        },
                        {
                            displayName: 'Tag Names or IDs',
                            name: 'tagIds',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getListTags',
                            },
                            default: [],
                            description: 'List of tag IDs to be added. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                {
                    displayName: 'By',
                    name: 'by',
                    type: 'options',
                    options: [
                        {
                            name: 'Contact ID',
                            value: 'id',
                        },
                        {
                            name: 'Email',
                            value: 'email',
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'contact',
                            ],
                        },
                    },
                    default: 'id',
                    description: 'Search by',
                },
                {
                    displayName: 'Contact ID',
                    name: 'contactId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'contact',
                            ],
                            operation: [
                                'get',
                            ],
                            by: [
                                'id',
                            ],
                        },
                    },
                    default: '',
                    description: 'Contact ID of the subscriber',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            resource: [
                                'contact',
                            ],
                            operation: [
                                'get',
                            ],
                            by: [
                                'email',
                            ],
                        },
                    },
                    default: '',
                    description: 'Email address for subscriber',
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
                            resource: [
                                'contact',
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
                                'contact',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 500,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                                'getAll',
                            ],
                            resource: [
                                'contact',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const lists = yield GenericFunctions_1.egoiApiRequestAllItems.call(this, 'items', 'GET', '/lists');
                        for (const list of lists) {
                            const listName = list.internal_name;
                            const listId = list.list_id;
                            returnData.push({
                                name: listName,
                                value: listId,
                            });
                        }
                        return returnData;
                    });
                },
                getExtraFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const listId = this.getCurrentNodeParameter('list');
                        const extraFields = yield GenericFunctions_1.egoiApiRequest.call(this, 'GET', `/lists/${listId}/fields`);
                        for (const field of extraFields) {
                            if (field.type === 'extra') {
                                const fieldName = field.name;
                                const fieldId = field.field_id;
                                returnData.push({
                                    name: fieldName,
                                    value: fieldId,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                getListTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tagList = yield GenericFunctions_1.egoiApiRequestAllItems.call(this, 'items', 'GET', '/tags');
                        for (const tag of tagList) {
                            const tagName = tag.name;
                            const tagId = tag.tag_id;
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
            let responseData;
            const returnData = [];
            const items = this.getInputData();
            const length = items.length;
            const operation = this.getNodeParameter('operation', 0);
            const resource = this.getNodeParameter('resource', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'contact') {
                        if (operation === 'create') {
                            const listId = this.getNodeParameter('list', i);
                            const email = this.getNodeParameter('email', i);
                            const resolveData = this.getNodeParameter('resolveData', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                base: {
                                    email,
                                },
                                extra: [],
                            };
                            if (additionalFields.birth_date) {
                                additionalFields.birth_date = (0, moment_timezone_1.default)(additionalFields.birth_date).format('YYYY-MM-DD');
                            }
                            if (additionalFields.extraFieldsUi) {
                                const extraFields = additionalFields.extraFieldsUi.extraFieldValues;
                                if (extraFields) {
                                    body.extra = extraFields;
                                }
                            }
                            Object.assign(body.base, additionalFields);
                            responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'POST', `/lists/${listId}/contacts`, body);
                            const contactId = responseData.contact_id;
                            if (additionalFields.tagIds) {
                                const tags = additionalFields.tagIds;
                                for (const tag of tags) {
                                    yield GenericFunctions_1.egoiApiRequest.call(this, 'POST', `/lists/${listId}/contacts/actions/attach-tag`, { tag_id: tag, contacts: [contactId] });
                                }
                            }
                            if (resolveData) {
                                responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'GET', `/lists/${listId}/contacts/${contactId}`);
                            }
                        }
                        if (operation === 'get') {
                            const listId = this.getNodeParameter('list', i);
                            const simple = this.getNodeParameter('simple', i);
                            const by = this.getNodeParameter('by', 0);
                            let endpoint = '';
                            if (by === 'id') {
                                const contactId = this.getNodeParameter('contactId', i);
                                endpoint = `/lists/${listId}/contacts/${contactId}`;
                            }
                            else {
                                const email = this.getNodeParameter('email', i);
                                endpoint = `/lists/${listId}/contacts?email=${email}`;
                            }
                            responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'GET', endpoint, {});
                            if (responseData.items) {
                                responseData = responseData.items;
                            }
                            if (simple === true) {
                                const data = (yield GenericFunctions_1.simplify.call(this, [responseData], listId))[0];
                                responseData = Object.assign(Object.assign({}, data), { email_stats: responseData.email_stats, sms_stats: responseData.sms_stats, push_stats: responseData.push_stats, webpush_stats: responseData.webpush_stats, voice_stats: responseData.voice_stats });
                            }
                        }
                        if (operation === 'getAll') {
                            const listId = this.getNodeParameter('list', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const simple = this.getNodeParameter('simple', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.egoiApiRequestAllItems.call(this, 'items', 'GET', `/lists/${listId}/contacts`, {});
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'GET', `/lists/${listId}/contacts`, {}, { limit });
                                responseData = responseData.items;
                            }
                            if (simple === true) {
                                responseData = yield GenericFunctions_1.simplify.call(this, responseData, listId);
                            }
                        }
                        if (operation === 'update') {
                            const listId = this.getNodeParameter('list', i);
                            const contactId = this.getNodeParameter('contactId', i);
                            const resolveData = this.getNodeParameter('resolveData', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                base: {},
                                extra: [],
                            };
                            if (updateFields.birth_date) {
                                updateFields.birth_date = (0, moment_timezone_1.default)(updateFields.birth_date).format('YYYY-MM-DD');
                            }
                            if (updateFields.extraFieldsUi) {
                                const extraFields = updateFields.extraFieldsUi.extraFieldValues;
                                if (extraFields) {
                                    body.extra = extraFields;
                                }
                            }
                            Object.assign(body.base, updateFields);
                            responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'PATCH', `/lists/${listId}/contacts/${contactId}`, body);
                            if (updateFields.tagIds) {
                                const tags = updateFields.tagIds;
                                for (const tag of tags) {
                                    yield GenericFunctions_1.egoiApiRequest.call(this, 'POST', `/lists/${listId}/contacts/actions/attach-tag`, { tag_id: tag, contacts: [contactId] });
                                }
                            }
                            if (resolveData) {
                                responseData = yield GenericFunctions_1.egoiApiRequest.call(this, 'GET', `/lists/${listId}/contacts/${contactId}`);
                            }
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail() !== true) {
                        throw error;
                    }
                    else {
                        // Return the actual reason as error
                        returnData.push({
                            error: error.message,
                        });
                        continue;
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Egoi = Egoi;
