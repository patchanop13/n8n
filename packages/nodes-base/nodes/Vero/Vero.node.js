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
exports.Vero = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const UserDescription_1 = require("./UserDescription");
const EventDescripion_1 = require("./EventDescripion");
class Vero {
    constructor() {
        this.description = {
            displayName: 'Vero',
            name: 'vero',
            icon: 'file:vero.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Vero API',
            defaults: {
                name: 'Vero',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'veroApi',
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
                            name: 'User',
                            value: 'user',
                            description: 'Create, update and manage the subscription status of your users',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                            description: 'Track events based on actions your customers take in real time',
                        },
                    ],
                    default: 'user',
                },
                ...UserDescription_1.userOperations,
                ...EventDescripion_1.eventOperations,
                ...UserDescription_1.userFields,
                ...EventDescripion_1.eventFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            for (let i = 0; i < length; i++) {
                try {
                    const resource = this.getNodeParameter('resource', 0);
                    const operation = this.getNodeParameter('operation', 0);
                    //https://developers.getvero.com/?bash#users
                    if (resource === 'user') {
                        //https://developers.getvero.com/?bash#users-identify
                        if (operation === 'create') {
                            const id = this.getNodeParameter('id', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const body = {
                                id,
                            };
                            if (additionalFields.email) {
                                // @ts-ignore
                                body.email = additionalFields.email;
                            }
                            if (!jsonActive) {
                                const dataAttributesValues = this.getNodeParameter('dataAttributesUi', i).dataAttributesValues;
                                if (dataAttributesValues) {
                                    const dataAttributes = {};
                                    for (let i = 0; i < dataAttributesValues.length; i++) {
                                        // @ts-ignore
                                        dataAttributes[dataAttributesValues[i].key] = dataAttributesValues[i].value;
                                        // @ts-ignore
                                        body.data = dataAttributes;
                                    }
                                }
                            }
                            else {
                                const dataAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('dataAttributesJson', i));
                                if (dataAttributesJson) {
                                    // @ts-ignore
                                    body.data = dataAttributesJson;
                                }
                            }
                            try {
                                responseData = yield GenericFunctions_1.veroApiRequest.call(this, 'POST', '/users/track', body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        //https://developers.getvero.com/?bash#users-alias
                        if (operation === 'alias') {
                            const id = this.getNodeParameter('id', i);
                            const newId = this.getNodeParameter('newId', i);
                            const body = {
                                id,
                                new_id: newId,
                            };
                            try {
                                responseData = yield GenericFunctions_1.veroApiRequest.call(this, 'PUT', '/users/reidentify', body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        //https://developers.getvero.com/?bash#users-unsubscribe
                        //https://developers.getvero.com/?bash#users-resubscribe
                        //https://developers.getvero.com/?bash#users-delete
                        if (operation === 'unsubscribe' ||
                            operation === 'resubscribe' ||
                            operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            const body = {
                                id,
                            };
                            try {
                                responseData = yield GenericFunctions_1.veroApiRequest.call(this, 'POST', `/users/${operation}`, body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        //https://developers.getvero.com/?bash#tags-add
                        //https://developers.getvero.com/?bash#tags-remove
                        if (operation === 'addTags' ||
                            operation === 'removeTags') {
                            const id = this.getNodeParameter('id', i);
                            const tags = this.getNodeParameter('tags', i).split(',');
                            const body = {
                                id,
                            };
                            if (operation === 'addTags') {
                                // @ts-ignore
                                body.add = JSON.stringify(tags);
                            }
                            if (operation === 'removeTags') {
                                // @ts-ignore
                                body.remove = JSON.stringify(tags);
                            }
                            try {
                                responseData = yield GenericFunctions_1.veroApiRequest.call(this, 'PUT', '/users/tags/edit', body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                    }
                    //https://developers.getvero.com/?bash#events
                    if (resource === 'event') {
                        //https://developers.getvero.com/?bash#events-track
                        if (operation === 'track') {
                            const id = this.getNodeParameter('id', i);
                            const email = this.getNodeParameter('email', i);
                            const eventName = this.getNodeParameter('eventName', i);
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const body = {
                                identity: { id, email },
                                event_name: eventName,
                                email,
                            };
                            if (!jsonActive) {
                                const dataAttributesValues = this.getNodeParameter('dataAttributesUi', i).dataAttributesValues;
                                if (dataAttributesValues) {
                                    const dataAttributes = {};
                                    for (let i = 0; i < dataAttributesValues.length; i++) {
                                        // @ts-ignore
                                        dataAttributes[dataAttributesValues[i].key] = dataAttributesValues[i].value;
                                        // @ts-ignore
                                        body.data = JSON.stringify(dataAttributes);
                                    }
                                }
                                const extraAttributesValues = this.getNodeParameter('extraAttributesUi', i).extraAttributesValues;
                                if (extraAttributesValues) {
                                    const extraAttributes = {};
                                    for (let i = 0; i < extraAttributesValues.length; i++) {
                                        // @ts-ignore
                                        extraAttributes[extraAttributesValues[i].key] = extraAttributesValues[i].value;
                                        // @ts-ignore
                                        body.extras = JSON.stringify(extraAttributes);
                                    }
                                }
                            }
                            else {
                                const dataAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('dataAttributesJson', i));
                                if (dataAttributesJson) {
                                    // @ts-ignore
                                    body.data = JSON.stringify(dataAttributesJson);
                                }
                                const extraAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('extraAttributesJson', i));
                                if (extraAttributesJson) {
                                    // @ts-ignore
                                    body.extras = JSON.stringify(extraAttributesJson);
                                }
                            }
                            try {
                                responseData = yield GenericFunctions_1.veroApiRequest.call(this, 'POST', '/events/track', body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
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
exports.Vero = Vero;
