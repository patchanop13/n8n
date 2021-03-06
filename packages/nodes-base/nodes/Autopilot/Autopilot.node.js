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
exports.Autopilot = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
const ContactJourneyDescription_1 = require("./ContactJourneyDescription");
const ContactListDescription_1 = require("./ContactListDescription");
const ListDescription_1 = require("./ListDescription");
class Autopilot {
    constructor() {
        this.description = {
            displayName: 'Autopilot',
            name: 'autopilot',
            icon: 'file:autopilot.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Autopilot API',
            defaults: {
                name: 'Autopilot',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'autopilotApi',
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
                            name: 'Contact Journey',
                            value: 'contactJourney',
                        },
                        {
                            name: 'Contact List',
                            value: 'contactList',
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
                ...ContactJourneyDescription_1.contactJourneyOperations,
                ...ContactJourneyDescription_1.contactJourneyFields,
                ...ContactListDescription_1.contactListOperations,
                ...ContactListDescription_1.contactListFields,
                ...ListDescription_1.listOperations,
                ...ListDescription_1.listFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const customFields = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', '/contacts/custom_fields');
                        for (const customField of customFields) {
                            returnData.push({
                                name: customField.name,
                                value: `${customField.name}-${customField.fieldType}`,
                            });
                        }
                        return returnData;
                    });
                },
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { lists } = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', '/lists');
                        for (const list of lists) {
                            returnData.push({
                                name: list.title,
                                value: list.list_id,
                            });
                        }
                        return returnData;
                    });
                },
                getTriggers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { triggers } = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', '/triggers');
                        for (const trigger of triggers) {
                            returnData.push({
                                name: trigger.journey,
                                value: trigger.trigger_id,
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
                    if (resource === 'contact') {
                        if (operation === 'upsert') {
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                Email: email,
                            };
                            Object.assign(body, additionalFields);
                            if (body.customFieldsUi) {
                                const customFieldsValues = body.customFieldsUi.customFieldsValues;
                                body.custom = {};
                                for (const customField of customFieldsValues) {
                                    const [name, fieldType] = customField.key.split('-');
                                    const fieldName = name.replace(/\s/g, '--');
                                    //@ts-ignore
                                    body.custom[`${fieldType}--${fieldName}`] = customField.value;
                                }
                                delete body.customFieldsUi;
                            }
                            if (body.autopilotList) {
                                body._autopilot_list = body.autopilotList;
                                delete body.autopilotList;
                            }
                            if (body.autopilotSessionId) {
                                body._autopilot_session_id = body.autopilotSessionId;
                                delete body.autopilotSessionId;
                            }
                            if (body.newEmail) {
                                body._NewEmail = body.newEmail;
                                delete body.newEmail;
                            }
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'POST', `/contact`, { contact: body });
                        }
                        if (operation === 'delete') {
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'DELETE', `/contact/${contactId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', `/contact/${contactId}`);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.autopilotApiRequestAllItems.call(this, 'contacts', 'GET', `/contacts`, {}, qs);
                            if (returnAll === false) {
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (resource === 'contactJourney') {
                        if (operation === 'add') {
                            const triggerId = this.getNodeParameter('triggerId', i);
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'POST', `/trigger/${triggerId}/contact/${contactId}`);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'contactList') {
                        if (['add', 'remove', 'exist'].includes(operation)) {
                            const listId = this.getNodeParameter('listId', i);
                            const contactId = this.getNodeParameter('contactId', i);
                            const method = {
                                'add': 'POST',
                                'remove': 'DELETE',
                                'exist': 'GET',
                            };
                            const endpoint = `/list/${listId}/contact/${contactId}`;
                            if (operation === 'exist') {
                                try {
                                    yield GenericFunctions_1.autopilotApiRequest.call(this, method[operation], endpoint);
                                    responseData = { exist: true };
                                }
                                catch (error) {
                                    responseData = { exist: false };
                                }
                            }
                            else if (operation === 'add' || operation === 'remove') {
                                responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, method[operation], endpoint);
                                responseData['success'] = true;
                            }
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const listId = this.getNodeParameter('listId', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.autopilotApiRequestAllItems.call(this, 'contacts', 'GET', `/list/${listId}/contacts`, {}, qs);
                            if (returnAll === false) {
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (resource === 'list') {
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                name,
                            };
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'POST', `/list`, body);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.autopilotApiRequest.call(this, 'GET', '/lists');
                            responseData = responseData.lists;
                            if (returnAll === false) {
                                responseData = responseData.splice(0, qs.limit);
                            }
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Autopilot = Autopilot;
