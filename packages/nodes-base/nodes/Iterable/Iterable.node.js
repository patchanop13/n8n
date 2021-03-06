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
exports.Iterable = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const EventDescription_1 = require("./EventDescription");
const UserDescription_1 = require("./UserDescription");
const UserListDescription_1 = require("./UserListDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Iterable {
    constructor() {
        this.description = {
            displayName: 'Iterable',
            name: 'iterable',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:iterable.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Iterable API',
            defaults: {
                name: 'Iterable',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'iterableApi',
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
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                        {
                            name: 'User List',
                            value: 'userList',
                        },
                    ],
                    default: 'user',
                },
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
                ...UserListDescription_1.userListOperations,
                ...UserListDescription_1.userListFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the lists available channels
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { lists } = yield GenericFunctions_1.iterableApiRequest.call(this, 'GET', '/lists');
                        const returnData = [];
                        for (const list of lists) {
                            returnData.push({
                                name: list.name,
                                value: list.id,
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
            const timezone = this.getTimezone();
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'event') {
                if (operation === 'track') {
                    // https://api.iterable.com/api/docs#events_trackBulk
                    const events = [];
                    for (let i = 0; i < length; i++) {
                        const name = this.getNodeParameter('name', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (!additionalFields.email && !additionalFields.id) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Either email or userId must be passed in to identify the user. Please add one of both via "Additional Fields". If both are passed in, email takes precedence.');
                        }
                        const body = {
                            eventName: name,
                        };
                        Object.assign(body, additionalFields);
                        if (body.dataFieldsUi) {
                            const dataFields = body.dataFieldsUi.dataFieldValues;
                            const data = {};
                            for (const dataField of dataFields) {
                                data[dataField.key] = dataField.value;
                            }
                            body.dataFields = data;
                            delete body.dataFieldsUi;
                        }
                        if (body.createdAt) {
                            body.createdAt = moment_timezone_1.default.tz(body.createdAt, timezone).unix();
                        }
                        events.push(body);
                    }
                    responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'POST', '/events/trackBulk', { events });
                    returnData.push(responseData);
                }
            }
            if (resource === 'user') {
                if (operation === 'upsert') {
                    // https://api.iterable.com/api/docs#users_updateUser
                    for (let i = 0; i < length; i++) {
                        const identifier = this.getNodeParameter('identifier', i);
                        const value = this.getNodeParameter('value', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {};
                        if (identifier === 'email') {
                            body.email = value;
                        }
                        else {
                            body.preferUserId = this.getNodeParameter('preferUserId', i);
                            body.userId = value;
                        }
                        Object.assign(body, additionalFields);
                        if (body.dataFieldsUi) {
                            const dataFields = body.dataFieldsUi.dataFieldValues;
                            const data = {};
                            for (const dataField of dataFields) {
                                data[dataField.key] = dataField.value;
                            }
                            body.dataFields = data;
                            delete body.dataFieldsUi;
                        }
                        responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'POST', '/users/update', body);
                        if (this.continueOnFail() === false) {
                            if (responseData.code !== 'Success') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Iterable error response [400]: ${responseData.msg}`);
                            }
                        }
                        returnData.push(responseData);
                    }
                }
                if (operation === 'delete') {
                    // https://api.iterable.com/api/docs#users_delete
                    // https://api.iterable.com/api/docs#users_delete_0
                    for (let i = 0; i < length; i++) {
                        const by = this.getNodeParameter('by', i);
                        let endpoint;
                        if (by === 'email') {
                            const email = this.getNodeParameter('email', i);
                            endpoint = `/users/${email}`;
                        }
                        else {
                            const userId = this.getNodeParameter('userId', i);
                            endpoint = `/users/byUserId/${userId}`;
                        }
                        responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'DELETE', endpoint);
                        if (this.continueOnFail() === false) {
                            if (responseData.code !== 'Success') {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
                            }
                        }
                        returnData.push(responseData);
                    }
                }
                if (operation === 'get') {
                    // https://api.iterable.com/api/docs#users_getUser
                    // https://api.iterable.com/api/docs#users_getUserById
                    for (let i = 0; i < length; i++) {
                        const by = this.getNodeParameter('by', i);
                        let endpoint;
                        if (by === 'email') {
                            const email = this.getNodeParameter('email', i);
                            endpoint = `/users/getByEmail`;
                            qs.email = email;
                        }
                        else {
                            const userId = this.getNodeParameter('userId', i);
                            endpoint = `/users/byUserId/${userId}`;
                        }
                        responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'GET', endpoint, {}, qs);
                        if (this.continueOnFail() === false) {
                            if (Object.keys(responseData).length === 0) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { message: `User not found`, httpCode: '404' });
                            }
                        }
                        responseData = responseData.user || {};
                        returnData.push(responseData);
                    }
                }
            }
            if (resource === 'userList') {
                if (operation === 'add') {
                    //https://api.iterable.com/api/docs#lists_subscribe
                    const listId = this.getNodeParameter('listId', 0);
                    const identifier = this.getNodeParameter('identifier', 0);
                    const body = {
                        listId: parseInt(listId, 10),
                        subscribers: [],
                    };
                    const subscribers = [];
                    for (let i = 0; i < length; i++) {
                        const value = this.getNodeParameter('value', i);
                        if (identifier === 'email') {
                            subscribers.push({ email: value });
                        }
                        else {
                            subscribers.push({ userId: value });
                        }
                    }
                    body.subscribers = subscribers;
                    responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'POST', '/lists/subscribe', body);
                    returnData.push(responseData);
                }
                if (operation === 'remove') {
                    //https://api.iterable.com/api/docs#lists_unsubscribe
                    const listId = this.getNodeParameter('listId', 0);
                    const identifier = this.getNodeParameter('identifier', 0);
                    const additionalFields = this.getNodeParameter('additionalFields', 0);
                    const body = {
                        listId: parseInt(listId, 10),
                        subscribers: [],
                        campaignId: additionalFields.campaignId,
                        channelUnsubscribe: additionalFields.channelUnsubscribe,
                    };
                    const subscribers = [];
                    for (let i = 0; i < length; i++) {
                        const value = this.getNodeParameter('value', i);
                        if (identifier === 'email') {
                            subscribers.push({ email: value });
                        }
                        else {
                            subscribers.push({ userId: value });
                        }
                    }
                    body.subscribers = subscribers;
                    responseData = yield GenericFunctions_1.iterableApiRequest.call(this, 'POST', '/lists/unsubscribe', body);
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Iterable = Iterable;
