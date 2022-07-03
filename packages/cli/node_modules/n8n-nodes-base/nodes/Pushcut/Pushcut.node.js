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
exports.Pushcut = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Pushcut {
    constructor() {
        this.description = {
            displayName: 'Pushcut',
            name: 'pushcut',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:pushcut.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Pushcut API',
            defaults: {
                name: 'Pushcut',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'pushcutApi',
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
                            name: 'Notification',
                            value: 'notification',
                        },
                    ],
                    default: 'notification',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'notification',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Send a notification',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Notification Name or ID',
                    name: 'notificationName',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getNotifications',
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'notification',
                            ],
                            operation: [
                                'send',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    displayOptions: {
                        show: {
                            operation: [
                                'send',
                            ],
                            resource: [
                                'notification',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Device Names or IDs',
                            name: 'devices',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getDevices',
                            },
                            default: [],
                            description: 'List of devices this notification is sent to. (default is all devices). Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Input',
                            name: 'input',
                            type: 'string',
                            default: '',
                            description: 'Value that is passed as input to the notification action',
                        },
                        {
                            displayName: 'Text',
                            name: 'text',
                            type: 'string',
                            default: '',
                            description: 'Text that is used instead of the one defined in the app',
                        },
                        {
                            displayName: 'Title',
                            name: 'title',
                            type: 'string',
                            default: '',
                            description: 'Title that is used instead of the one defined in the app',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available devices to display them to user so that he can
                // select them easily
                getDevices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const devices = yield GenericFunctions_1.pushcutApiRequest.call(this, 'GET', '/devices');
                        for (const device of devices) {
                            returnData.push({
                                name: device.id,
                                value: device.id,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available notifications to display them to user so that he can
                // select them easily
                getNotifications() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const notifications = yield GenericFunctions_1.pushcutApiRequest.call(this, 'GET', '/notifications');
                        for (const notification of notifications) {
                            returnData.push({
                                name: notification.title,
                                value: notification.id,
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
                if (resource === 'notification') {
                    if (operation === 'send') {
                        const notificationName = this.getNodeParameter('notificationName', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {};
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.pushcutApiRequest.call(this, 'POST', `/notifications/${encodeURI(notificationName)}`, body);
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
exports.Pushcut = Pushcut;
