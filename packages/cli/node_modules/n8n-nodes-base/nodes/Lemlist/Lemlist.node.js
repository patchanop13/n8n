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
exports.Lemlist = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const lodash_1 = require("lodash");
class Lemlist {
    constructor() {
        this.description = {
            displayName: 'Lemlist',
            name: 'lemlist',
            icon: 'file:lemlist.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Lemlist API',
            defaults: {
                name: 'Lemlist',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'lemlistApi',
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
                            name: 'Activity',
                            value: 'activity',
                        },
                        {
                            name: 'Campaign',
                            value: 'campaign',
                        },
                        {
                            name: 'Lead',
                            value: 'lead',
                        },
                        {
                            name: 'Team',
                            value: 'team',
                        },
                        {
                            name: 'Unsubscribe',
                            value: 'unsubscribe',
                        },
                    ],
                    default: 'activity',
                },
                ...descriptions_1.activityOperations,
                ...descriptions_1.activityFields,
                ...descriptions_1.campaignOperations,
                ...descriptions_1.campaignFields,
                ...descriptions_1.leadOperations,
                ...descriptions_1.leadFields,
                ...descriptions_1.teamOperations,
                ...descriptions_1.teamFields,
                ...descriptions_1.unsubscribeOperations,
                ...descriptions_1.unsubscribeFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const campaigns = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns');
                        return campaigns.map(({ _id, name }) => ({
                            name,
                            value: _id,
                        }));
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'activity') {
                        // *********************************************************************
                        //                             activity
                        // *********************************************************************
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //        activity: getAll
                            // ----------------------------------
                            // https://developer.lemlist.com/#activities
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (!(0, lodash_1.isEmpty)(filters)) {
                                Object.assign(qs, filters);
                            }
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/activities', {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', 0);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'campaign') {
                        // *********************************************************************
                        //                             campaign
                        // *********************************************************************
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //        campaign: getAll
                            // ----------------------------------
                            // https://developer.lemlist.com/#list-all-campaigns
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'lead') {
                        // *********************************************************************
                        //                             lead
                        // *********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //          lead: create
                            // ----------------------------------
                            // https://developer.lemlist.com/#add-a-lead-in-a-campaign
                            const qs = {};
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.deduplicate !== undefined) {
                                qs.deduplicate = additionalFields.deduplicate;
                            }
                            const body = {};
                            const remainingAdditionalFields = (0, lodash_1.omit)(additionalFields, 'deduplicate');
                            if (!(0, lodash_1.isEmpty)(remainingAdditionalFields)) {
                                Object.assign(body, remainingAdditionalFields);
                            }
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const email = this.getNodeParameter('email', i);
                            const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'POST', endpoint, body, qs);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         lead: delete
                            // ----------------------------------
                            // https://developer.lemlist.com/#delete-a-lead-from-a-campaign
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const email = this.getNodeParameter('email', i);
                            const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', endpoint, {}, { action: 'remove' });
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         lead: get
                            // ----------------------------------
                            // https://developer.lemlist.com/#get-a-specific-lead-by-email
                            const email = this.getNodeParameter('email', i);
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', `/leads/${email}`);
                        }
                        else if (operation === 'unsubscribe') {
                            // ----------------------------------
                            //         lead: unsubscribe
                            // ----------------------------------
                            // https://developer.lemlist.com/#unsubscribe-a-lead-from-a-campaign
                            const campaignId = this.getNodeParameter('campaignId', i);
                            const email = this.getNodeParameter('email', i);
                            const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', endpoint);
                        }
                    }
                    else if (resource === 'team') {
                        // *********************************************************************
                        //                             team
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //         team: get
                            // ----------------------------------
                            // https://developer.lemlist.com/#team
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/team');
                        }
                    }
                    else if (resource === 'unsubscribe') {
                        // *********************************************************************
                        //                             unsubscribe
                        // *********************************************************************
                        if (operation === 'add') {
                            // ----------------------------------
                            //        unsubscribe: Add
                            // ----------------------------------
                            // https://developer.lemlist.com/#add-an-email-address-in-the-unsubscribes
                            const email = this.getNodeParameter('email', i);
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'POST', `/unsubscribes/${email}`);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //        unsubscribe: delete
                            // ----------------------------------
                            // https://developer.lemlist.com/#delete-an-email-address-from-the-unsubscribes
                            const email = this.getNodeParameter('email', i);
                            responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', `/unsubscribes/${email}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        unsubscribe: getAll
                            // ----------------------------------
                            // https://developer.lemlist.com/#list-all-unsubscribes
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.lemlistApiRequestAllItems.call(this, 'GET', '/unsubscribes');
                            }
                            else {
                                const qs = {
                                    limit: this.getNodeParameter('limit', i),
                                };
                                responseData = yield GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/unsubscribes', {}, qs);
                            }
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.toString() });
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
exports.Lemlist = Lemlist;
