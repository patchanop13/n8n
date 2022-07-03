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
exports.GetResponse = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class GetResponse {
    constructor() {
        this.description = {
            displayName: 'GetResponse',
            name: 'getResponse',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:getResponse.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume GetResponse API',
            defaults: {
                name: 'GetResponse',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'getResponseApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiKey',
                            ],
                        },
                    },
                },
                {
                    name: 'getResponseOAuth2Api',
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
                            name: 'API Key',
                            value: 'apiKey',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiKey',
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
        this.methods = {
            loadOptions: {
                // Get all the campaigns to display them to user so that he can
                // select them easily
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const campaigns = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', `/campaigns`);
                        for (const campaign of campaigns) {
                            returnData.push({
                                name: campaign.name,
                                value: campaign.campaignId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the tagd to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', `/tags`);
                        for (const tag of tags) {
                            returnData.push({
                                name: tag.name,
                                value: tag.tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the custom fields to display them to user so that he can
                // select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const customFields = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', `/custom-fields`);
                        for (const customField of customFields) {
                            returnData.push({
                                name: customField.name,
                                value: customField.customFieldId,
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
                        //https://apireference.getresponse.com/#operation/createContact
                        if (operation === 'create') {
                            const email = this.getNodeParameter('email', i);
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                                campaign: {
                                    campaignId,
                                },
                            };
                            Object.assign(body, additionalFields);
                            if (additionalFields.customFieldsUi) {
                                const customFieldValues = additionalFields.customFieldsUi.customFieldValues;
                                if (customFieldValues) {
                                    body.customFieldValues = customFieldValues;
                                    for (let i = 0; i < customFieldValues.length; i++) {
                                        if (!Array.isArray(customFieldValues[i].value)) {
                                            customFieldValues[i].value = [customFieldValues[i].value];
                                        }
                                    }
                                    delete body.customFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.getresponseApiRequest.call(this, 'POST', '/contacts', body);
                            responseData = { success: true };
                        }
                        //https://apireference.getresponse.com/?_ga=2.160836350.2102802044.1604719933-1897033509.1604598019#operation/deleteContact
                        if (operation === 'delete') {
                            const contactId = this.getNodeParameter('contactId', i);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.getresponseApiRequest.call(this, 'DELETE', `/contacts/${contactId}`, {}, qs);
                            responseData = { success: true };
                        }
                        //https://apireference.getresponse.com/?_ga=2.160836350.2102802044.1604719933-1897033509.1604598019#operation/getContactById
                        if (operation === 'get') {
                            const contactId = this.getNodeParameter('contactId', i);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', `/contacts/${contactId}`, {}, qs);
                        }
                        //https://apireference.getresponse.com/?_ga=2.160836350.2102802044.1604719933-1897033509.1604598019#operation/getContactList
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const timezone = this.getTimezone();
                            Object.assign(qs, options);
                            const isNotQuery = [
                                'sortBy',
                                'sortOrder',
                                'additionalFlags',
                                'fields',
                                'exactMatch',
                            ];
                            const isDate = [
                                'createdOnFrom',
                                'createdOnTo',
                                'changeOnFrom',
                                'changeOnTo',
                            ];
                            const dateMapToKey = {
                                'createdOnFrom': '[createdOn][from]',
                                'createdOnTo': '[createdOn][to]',
                                'changeOnFrom': '[changeOn][from]',
                                'changeOnTo': '[changeOn][to]',
                            };
                            for (const key of Object.keys(qs)) {
                                if (!isNotQuery.includes(key)) {
                                    if (isDate.includes(key)) {
                                        qs[`query${dateMapToKey[key]}`] = moment_timezone_1.default.tz(qs[key], timezone).format('YYYY-MM-DDTHH:mm:ssZZ');
                                    }
                                    else {
                                        qs[`query[${key}]`] = qs[key];
                                    }
                                    delete qs[key];
                                }
                            }
                            if (qs.sortBy) {
                                qs[`sort[${qs.sortBy}]`] = qs.sortOrder || 'ASC';
                            }
                            if (qs.exactMatch === true) {
                                qs['additionalFlags'] = 'exactMatch';
                                delete qs.exactMatch;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.getResponseApiRequestAllItems.call(this, 'GET', `/contacts`, {}, qs);
                            }
                            else {
                                qs.perPage = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.getresponseApiRequest.call(this, 'GET', `/contacts`, {}, qs);
                            }
                        }
                        //https://apireference.getresponse.com/?_ga=2.160836350.2102802044.1604719933-1897033509.1604598019#operation/updateContact
                        if (operation === 'update') {
                            const contactId = this.getNodeParameter('contactId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {};
                            Object.assign(body, updateFields);
                            if (updateFields.customFieldsUi) {
                                const customFieldValues = updateFields.customFieldsUi.customFieldValues;
                                if (customFieldValues) {
                                    body.customFieldValues = customFieldValues;
                                    delete body.customFieldsUi;
                                }
                            }
                            responseData = yield GenericFunctions_1.getresponseApiRequest.call(this, 'POST', `/contacts/${contactId}`, body);
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
exports.GetResponse = GetResponse;
