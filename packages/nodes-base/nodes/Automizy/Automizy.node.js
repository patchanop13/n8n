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
exports.Automizy = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
const ListDescription_1 = require("./ListDescription");
class Automizy {
    constructor() {
        this.description = {
            displayName: 'Automizy',
            name: 'automizy',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:automizy.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Automizy API',
            defaults: {
                name: 'Automizy',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'automizyApi',
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
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'List',
                            value: 'list',
                        },
                    ],
                    default: 'contact',
                },
                ...ContactDescription_1.contactOperations,
                ...ContactDescription_1.contactFields,
                ...ListDescription_1.listOperations,
                ...ListDescription_1.listFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the tags to display them to user so that he can
                // select them easily
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const lists = yield GenericFunctions_1.automizyApiRequestAllItems.call(this, 'smartLists', 'GET', `/smart-lists`);
                        for (const list of lists) {
                            returnData.push({
                                name: list.name,
                                value: list.id,
                            });
                        }
                        return returnData;
                    });
                },
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.automizyApiRequestAllItems.call(this, 'contactTags', 'GET', '/contacts/tag-manager');
                        for (const tag of tags) {
                            returnData.push({
                                name: tag.name,
                                value: tag.name,
                            });
                        }
                        return returnData;
                    });
                },
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const customFields = yield GenericFunctions_1.automizyApiRequestAllItems.call(this, 'customFields', 'GET', '/custom-fields');
                        for (const customField of customFields) {
                            returnData.push({
                                name: customField.name,
                                value: customField.id,
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
                if (resource === 'contact') {
                    if (operation === 'create') {
                        const listId = this.getNodeParameter('listId', i);
                        const email = this.getNodeParameter('email', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            email,
                        };
                        Object.assign(body, additionalFields);
                        if (body.customFieldsUi) {
                            const customFieldsValues = body.customFieldsUi.customFieldsValues;
                            body.customFields = {};
                            for (const customField of customFieldsValues) {
                                //@ts-ignore
                                body.customFields[customField.key] = customField.value;
                            }
                            delete body.customFieldsUi;
                        }
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'POST', `/smart-lists/${listId}/contacts`, body);
                    }
                    if (operation === 'delete') {
                        const contactId = this.getNodeParameter('contactId', i);
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
                        responseData = { success: true };
                    }
                    if (operation === 'get') {
                        const contactId = this.getNodeParameter('contactId', i);
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'GET', `/contacts/${contactId}`);
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const listId = this.getNodeParameter('listId', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.direction && additionalFields.sortBy) {
                            qs.order = `${additionalFields.sortBy}:${additionalFields.direction}`;
                        }
                        if (additionalFields.fields) {
                            qs.fields = additionalFields.fields;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.automizyApiRequestAllItems.call(this, 'contacts', 'GET', `/smart-lists/${listId}/contacts`, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'GET', `/smart-lists/${listId}/contacts`, {}, qs);
                            responseData = responseData.contacts;
                        }
                    }
                    if (operation === 'update') {
                        const email = this.getNodeParameter('email', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        Object.assign(body, updateFields);
                        if (body.customFieldsUi) {
                            const customFieldsValues = body.customFieldsUi.customFieldsValues;
                            body.customFields = {};
                            for (const customField of customFieldsValues) {
                                //@ts-ignore
                                body.customFields[customField.key] = customField.value;
                            }
                            delete body.customFieldsUi;
                        }
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'PATCH', `/contacts/${email}`, body);
                    }
                }
                if (resource === 'list') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i);
                        const body = {
                            name,
                        };
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'POST', `/smart-lists`, body);
                    }
                    if (operation === 'delete') {
                        const listId = this.getNodeParameter('listId', i);
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'DELETE', `/smart-lists/${listId}`);
                        responseData = { success: true };
                    }
                    if (operation === 'get') {
                        const listId = this.getNodeParameter('listId', i);
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'GET', `/smart-lists/${listId}`);
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.direction && additionalFields.sortBy) {
                            qs.order = `${additionalFields.sortBy}:${additionalFields.direction}`;
                        }
                        if (additionalFields.fields) {
                            qs.fields = additionalFields.fields;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.automizyApiRequestAllItems.call(this, 'smartLists', 'GET', `/smart-lists`, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'GET', `/smart-lists`, {}, qs);
                            responseData = responseData.smartLists;
                        }
                    }
                    if (operation === 'update') {
                        const listId = this.getNodeParameter('listId', i);
                        const name = this.getNodeParameter('name', i);
                        const body = {
                            name,
                        };
                        responseData = yield GenericFunctions_1.automizyApiRequest.call(this, 'PATCH', `/smart-lists/${listId}`, body);
                    }
                }
            }
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else if (responseData !== undefined) {
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Automizy = Automizy;
