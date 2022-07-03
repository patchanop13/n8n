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
exports.Drift = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
class Drift {
    constructor() {
        this.description = {
            displayName: 'Drift',
            name: 'drift',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:drift.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Drift API',
            defaults: {
                name: 'Drift',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'driftApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'driftOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
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
                    ],
                    default: 'contact',
                },
                ...ContactDescription_1.contactOperations,
                ...ContactDescription_1.contactFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'contact') {
                        //https://devdocs.drift.com/docs/creating-a-contact
                        if (operation === 'create') {
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                            };
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            if (additionalFields.phone) {
                                body.phone = additionalFields.phone;
                            }
                            responseData = yield GenericFunctions_1.driftApiRequest.call(this, 'POST', '/contacts', { attributes: body });
                            responseData = responseData.data;
                        }
                        //https://devdocs.drift.com/docs/updating-a-contact
                        if (operation === 'update') {
                            const contactId = this.getNodeParameter('contactId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            if (updateFields.name) {
                                body.name = updateFields.name;
                            }
                            if (updateFields.phone) {
                                body.phone = updateFields.phone;
                            }
                            if (updateFields.email) {
                                body.email = updateFields.email;
                            }
                            responseData = yield GenericFunctions_1.driftApiRequest.call(this, 'PATCH', `/contacts/${contactId}`, { attributes: body });
                            responseData = responseData.data;
                        }
                        //https://devdocs.drift.com/docs/retrieving-contact
                        if (operation === 'get') {
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.driftApiRequest.call(this, 'GET', `/contacts/${contactId}`);
                            responseData = responseData.data;
                        }
                        //https://devdocs.drift.com/docs/listing-custom-attributes
                        if (operation === 'getCustomAttributes') {
                            responseData = yield GenericFunctions_1.driftApiRequest.call(this, 'GET', '/contacts/attributes');
                            responseData = responseData.data.properties;
                        }
                        //https://devdocs.drift.com/docs/removing-a-contact
                        if (operation === 'delete') {
                            const contactId = this.getNodeParameter('contactId', i);
                            responseData = yield GenericFunctions_1.driftApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
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
exports.Drift = Drift;
