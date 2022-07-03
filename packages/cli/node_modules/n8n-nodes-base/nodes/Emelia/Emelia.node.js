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
exports.Emelia = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CampaignDescription_1 = require("./CampaignDescription");
const ContactListDescription_1 = require("./ContactListDescription");
const lodash_1 = require("lodash");
class Emelia {
    constructor() {
        this.description = {
            displayName: 'Emelia',
            name: 'emelia',
            icon: 'file:emelia.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Emelia API',
            defaults: {
                name: 'Emelia',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'emeliaApi',
                    required: true,
                    testedBy: 'emeliaApiTest',
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
                            name: 'Campaign',
                            value: 'campaign',
                        },
                        {
                            name: 'Contact List',
                            value: 'contactList',
                        },
                    ],
                    default: 'campaign',
                    required: true,
                },
                ...CampaignDescription_1.campaignOperations,
                ...CampaignDescription_1.campaignFields,
                ...ContactListDescription_1.contactListOperations,
                ...ContactListDescription_1.contactListFields,
            ],
        };
        this.methods = {
            credentialTest: {
                emeliaApiTest: GenericFunctions_1.emeliaApiTest,
            },
            loadOptions: {
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.loadResource.call(this, 'campaign');
                    });
                },
                getContactLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.loadResource.call(this, 'contactList');
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
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'campaign') {
                        // **********************************
                        //            campaign
                        // **********************************
                        if (operation === 'addContact') {
                            // ----------------------------------
                            //       campaign: addContact
                            // ----------------------------------
                            const contact = {
                                email: this.getNodeParameter('contactEmail', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(contact, additionalFields);
                            }
                            if (additionalFields.customFieldsUi) {
                                const customFields = (additionalFields.customFieldsUi || {}).customFieldsValues || [];
                                const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldName}`]: value.value }), {});
                                Object.assign(contact, data);
                                //@ts-ignore
                                delete contact.customFieldsUi;
                            }
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									mutation AddContactToCampaignHook($id: ID!, $contact: JSON!) {
										addContactToCampaignHook(id: $id, contact: $contact)
								}`,
                                operationName: 'AddContactToCampaignHook',
                                variables: {
                                    id: this.getNodeParameter('campaignId', i),
                                    contact,
                                },
                            });
                            returnData.push({ contactId: responseData.data.addContactToCampaignHook });
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //        campaign: create
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                operationName: 'createCampaign',
                                query: `
									mutation createCampaign($name: String!) {
										createCampaign(name: $name) {
											_id
											name
											status
											createdAt
											provider
											startAt
											estimatedEnd
										}
									}`,
                                variables: {
                                    name: this.getNodeParameter('campaignName', i),
                                },
                            });
                            returnData.push(responseData.data.createCampaign);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //        campaign: get
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									query campaign($id: ID!){
										campaign(id: $id){
											_id
											name
											status
											createdAt
											schedule{
												dailyContact
												dailyLimit
												minInterval
												maxInterval
												trackLinks
												trackOpens
												timeZone
												days
												start
												end
												eventToStopMails
											}
											provider
											startAt
											recipients{
												total_count
											}
											estimatedEnd
										}
									}`,
                                operationName: 'campaign',
                                variables: {
                                    id: this.getNodeParameter('campaignId', i),
                                },
                            });
                            returnData.push(responseData.data.campaign);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        campaign: getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									query all_campaigns {
										all_campaigns {
											_id
											name
											status
											createdAt
											stats {
												mailsSent
												uniqueOpensPercent
												opens
												linkClickedPercent
												repliedPercent
												bouncedPercent
												unsubscribePercent
												progressPercent
											}
										}
									}`,
                                operationName: 'all_campaigns',
                            });
                            let campaigns = responseData.data.all_campaigns;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                campaigns = campaigns.slice(0, limit);
                            }
                            returnData.push(...campaigns);
                        }
                        else if (operation === 'pause') {
                            // ----------------------------------
                            //        campaign: pause
                            // ----------------------------------
                            yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									mutation pauseCampaign($id: ID!) {
										pauseCampaign(id: $id)
									}`,
                                operationName: 'pauseCampaign',
                                variables: {
                                    id: this.getNodeParameter('campaignId', i),
                                },
                            });
                            returnData.push({ success: true });
                        }
                        else if (operation === 'start') {
                            // ----------------------------------
                            //        campaign: start
                            // ----------------------------------
                            yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									mutation startCampaign($id: ID!) {
										startCampaign(id: $id)
									}`,
                                operationName: 'startCampaign',
                                variables: {
                                    id: this.getNodeParameter('campaignId', i),
                                },
                            });
                            returnData.push({ success: true });
                        }
                        else if (operation === 'duplicate') {
                            // ----------------------------------
                            //        campaign: duplicate
                            // ----------------------------------
                            const options = this.getNodeParameter('options', i);
                            const variables = Object.assign({ fromId: this.getNodeParameter('campaignId', i), name: this.getNodeParameter('campaignName', i), copySettings: true, copyMails: true, copyContacts: false, copyProvider: true }, options);
                            const { data: { duplicateCampaign } } = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									mutation duplicateCampaign(
										$fromId: ID!
										$name: String!
										$copySettings: Boolean!
										$copyMails: Boolean!
										$copyContacts: Boolean!
										$copyProvider: Boolean!
									) {
										duplicateCampaign(
											fromId: $fromId
											name: $name
											copySettings: $copySettings
											copyMails: $copyMails
											copyContacts: $copyContacts
											copyProvider: $copyProvider
										)
									}`,
                                operationName: 'duplicateCampaign',
                                variables,
                            });
                            returnData.push({ _id: duplicateCampaign });
                        }
                    }
                    else if (resource === 'contactList') {
                        // **********************************
                        //           ContactList
                        // **********************************
                        if (operation === 'add') {
                            // ----------------------------------
                            //      contactList: add
                            // ----------------------------------
                            const contact = {
                                email: this.getNodeParameter('contactEmail', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(contact, additionalFields);
                            }
                            if (additionalFields.customFieldsUi) {
                                const customFields = (additionalFields.customFieldsUi || {}).customFieldsValues || [];
                                const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldName}`]: value.value }), {});
                                Object.assign(contact, data);
                                //@ts-ignore
                                delete contact.customFieldsUi;
                            }
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									mutation AddContactsToListHook($id: ID!, $contact: JSON!) {
										addContactsToListHook(id: $id, contact: $contact)
									}`,
                                operationName: 'AddContactsToListHook',
                                variables: {
                                    id: this.getNodeParameter('contactListId', i),
                                    contact,
                                },
                            });
                            returnData.push({ contactId: responseData.data.addContactsToListHook });
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //       contactList: getAll
                            // ----------------------------------
                            const responseData = yield GenericFunctions_1.emeliaGraphqlRequest.call(this, {
                                query: `
									query contact_lists{
										contact_lists{
											_id
											name
											contactCount
											fields
											usedInCampaign
										}
									}`,
                                operationName: 'contact_lists',
                            });
                            let contactLists = responseData.data.contact_lists;
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                contactLists = contactLists.slice(0, limit);
                            }
                            returnData.push(...contactLists);
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
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Emelia = Emelia;
