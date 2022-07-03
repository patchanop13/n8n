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
exports.Clearbit = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CompanyDescription_1 = require("./CompanyDescription");
const PersonDescription_1 = require("./PersonDescription");
class Clearbit {
    constructor() {
        this.description = {
            displayName: 'Clearbit',
            name: 'clearbit',
            icon: 'file:clearbit.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume Clearbit API',
            defaults: {
                name: 'Clearbit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'clearbitApi',
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
                            name: 'Company',
                            value: 'company',
                            description: 'The Company API allows you to look up a company by their domain',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                            description: 'The Person API lets you retrieve social information associated with an email address, such as a person’s name, location and Twitter handle',
                        },
                    ],
                    default: 'company',
                },
                ...CompanyDescription_1.companyOperations,
                ...CompanyDescription_1.companyFields,
                ...PersonDescription_1.personOperations,
                ...PersonDescription_1.personFields,
            ],
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
                    if (resource === 'person') {
                        if (operation === 'enrich') {
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.email = email;
                            if (additionalFields.givenName) {
                                qs.given_name = additionalFields.givenName;
                            }
                            if (additionalFields.familyName) {
                                qs.family_name = additionalFields.familyName;
                            }
                            if (additionalFields.ipAddress) {
                                qs.ip_address = additionalFields.ipAddress;
                            }
                            if (additionalFields.location) {
                                qs.location = additionalFields.location;
                            }
                            if (additionalFields.company) {
                                qs.company = additionalFields.company;
                            }
                            if (additionalFields.companyDomain) {
                                qs.company_domain = additionalFields.companyDomain;
                            }
                            if (additionalFields.linkedIn) {
                                qs.linkedin = additionalFields.linkedIn;
                            }
                            if (additionalFields.twitter) {
                                qs.twitter = additionalFields.twitter;
                            }
                            if (additionalFields.facebook) {
                                qs.facebook = additionalFields.facebook;
                            }
                            responseData = yield GenericFunctions_1.clearbitApiRequest.call(this, 'GET', `${resource}-stream`, '/v2/people/find', {}, qs);
                        }
                    }
                    if (resource === 'company') {
                        if (operation === 'enrich') {
                            const domain = this.getNodeParameter('domain', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.domain = domain;
                            if (additionalFields.companyName) {
                                qs.company_name = additionalFields.companyName;
                            }
                            if (additionalFields.linkedin) {
                                qs.linkedin = additionalFields.linkedin;
                            }
                            if (additionalFields.twitter) {
                                qs.twitter = additionalFields.twitter;
                            }
                            if (additionalFields.facebook) {
                                qs.facebook = additionalFields.facebook;
                            }
                            responseData = yield GenericFunctions_1.clearbitApiRequest.call(this, 'GET', `${resource}-stream`, '/v2/companies/find', {}, qs);
                        }
                        if (operation === 'autocomplete') {
                            const name = this.getNodeParameter('name', i);
                            qs.query = name;
                            responseData = yield GenericFunctions_1.clearbitApiRequest.call(this, 'GET', 'autocomplete', '/v1/companies/suggest', {}, qs);
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
exports.Clearbit = Clearbit;
