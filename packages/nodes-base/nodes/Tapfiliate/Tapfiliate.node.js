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
exports.Tapfiliate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AffiliateDescription_1 = require("./AffiliateDescription");
const AffiliateMetadataDescription_1 = require("./AffiliateMetadataDescription");
const ProgramAffiliateDescription_1 = require("./ProgramAffiliateDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class Tapfiliate {
    constructor() {
        this.description = {
            displayName: 'Tapfiliate',
            name: 'tapfiliate',
            icon: 'file:tapfiliate.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume Tapfiliate API',
            defaults: {
                name: 'Tapfiliate',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'tapfiliateApi',
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
                            name: 'Affiliate',
                            value: 'affiliate',
                        },
                        {
                            name: 'Affiliate Metadata',
                            value: 'affiliateMetadata',
                        },
                        {
                            name: 'Program Affiliate',
                            value: 'programAffiliate',
                        },
                    ],
                    default: 'affiliate',
                    required: true,
                },
                ...AffiliateDescription_1.affiliateOperations,
                ...AffiliateDescription_1.affiliateFields,
                ...AffiliateMetadataDescription_1.affiliateMetadataOperations,
                ...AffiliateMetadataDescription_1.affiliateMetadataFields,
                ...ProgramAffiliateDescription_1.programAffiliateOperations,
                ...ProgramAffiliateDescription_1.programAffiliateFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get custom fields to display to user so that they can select them easily
                getPrograms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const programs = yield GenericFunctions_1.tapfiliateApiRequestAllItems.call(this, 'GET', '/programs/');
                        for (const program of programs) {
                            returnData.push({
                                name: program.title,
                                value: program.id,
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
            const length = items.length;
            const qs = {};
            let responseData;
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'affiliate') {
                        if (operation === 'create') {
                            //https://tapfiliate.com/docs/rest/#affiliates-affiliates-collection-post
                            const firstname = this.getNodeParameter('firstname', i);
                            const lastname = this.getNodeParameter('lastname', i);
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                firstname,
                                lastname,
                                email,
                            };
                            Object.assign(body, additionalFields);
                            if (body.addressUi) {
                                body.address = body.addressUi.addressValues;
                                delete body.addressUi;
                                if (body.address.country) {
                                    body.address.country = {
                                        code: body.address.country,
                                    };
                                }
                            }
                            if (body.companyName) {
                                body.company = {
                                    name: body.companyName,
                                };
                                delete body.companyName;
                            }
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'POST', '/affiliates/', body);
                            returnData.push(responseData);
                        }
                        if (operation === 'delete') {
                            //https://tapfiliate.com/docs/rest/#affiliates-affiliate-delete
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'DELETE', `/affiliates/${affiliateId}/`);
                            returnData.push({ success: true });
                        }
                        if (operation === 'get') {
                            //https://tapfiliate.com/docs/rest/#affiliates-affiliate-get
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'GET', `/affiliates/${affiliateId}/`);
                            returnData.push(responseData);
                        }
                        if (operation === 'getAll') {
                            //https://tapfiliate.com/docs/rest/#affiliates-affiliates-collection-get
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.tapfiliateApiRequestAllItems.call(this, 'GET', `/affiliates/`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'GET', `/affiliates/`, {}, qs);
                                responseData = responseData.splice(0, limit);
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                    }
                    if (resource === 'affiliateMetadata') {
                        if (operation === 'add') {
                            //https://tapfiliate.com/docs/rest/#affiliates-meta-data-key-put
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            const metadata = (this.getNodeParameter('metadataUi', i) || {}).metadataValues || [];
                            if (metadata.length === 0) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Metadata cannot be empty.');
                            }
                            for (const { key, value } of metadata) {
                                yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'PUT', `/affiliates/${affiliateId}/meta-data/${key}/`, { value });
                            }
                            returnData.push({ success: true });
                        }
                        if (operation === 'remove') {
                            //https://tapfiliate.com/docs/rest/#affiliates-meta-data-key-delete
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            const key = this.getNodeParameter('key', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'DELETE', `/affiliates/${affiliateId}/meta-data/${key}/`);
                            returnData.push({ success: true });
                        }
                        if (operation === 'update') {
                            //https://tapfiliate.com/docs/rest/#affiliates-notes-collection-get
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            const key = this.getNodeParameter('key', i);
                            const value = this.getNodeParameter('value', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'PUT', `/affiliates/${affiliateId}/meta-data/`, { [key]: value });
                            returnData.push(responseData);
                        }
                    }
                    if (resource === 'programAffiliate') {
                        if (operation === 'add') {
                            //https://tapfiliate.com/docs/rest/#programs-program-affiliates-collection-post
                            const programId = this.getNodeParameter('programId', i);
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                affiliate: {
                                    id: affiliateId,
                                },
                            };
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'POST', `/programs/${programId}/affiliates/`, body);
                            returnData.push(responseData);
                        }
                        if (operation === 'approve') {
                            //https://tapfiliate.com/docs/rest/#programs-approve-an-affiliate-for-a-program-put
                            const programId = this.getNodeParameter('programId', i);
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'PUT', `/programs/${programId}/affiliates/${affiliateId}/approved/`);
                            returnData.push(responseData);
                        }
                        if (operation === 'disapprove') {
                            //https://tapfiliate.com/docs/rest/#programs-approve-an-affiliate-for-a-program-delete
                            const programId = this.getNodeParameter('programId', i);
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'DELETE', `/programs/${programId}/affiliates/${affiliateId}/approved/`);
                            returnData.push(responseData);
                        }
                        if (operation === 'get') {
                            //https://tapfiliate.com/docs/rest/#programs-affiliate-in-program-get
                            const programId = this.getNodeParameter('programId', i);
                            const affiliateId = this.getNodeParameter('affiliateId', i);
                            responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'GET', `/programs/${programId}/affiliates/${affiliateId}/`);
                            returnData.push(responseData);
                        }
                        if (operation === 'getAll') {
                            //https://tapfiliate.com/docs/rest/#programs-program-affiliates-collection-get
                            const programId = this.getNodeParameter('programId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.tapfiliateApiRequestAllItems.call(this, 'GET', `/programs/${programId}/affiliates/`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.tapfiliateApiRequest.call(this, 'GET', `/programs/${programId}/affiliates/`, {}, qs);
                                responseData = responseData.splice(0, limit);
                            }
                            returnData.push.apply(returnData, responseData);
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
exports.Tapfiliate = Tapfiliate;
