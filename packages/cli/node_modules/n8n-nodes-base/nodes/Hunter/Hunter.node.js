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
exports.Hunter = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Hunter {
    constructor() {
        this.description = {
            displayName: 'Hunter',
            name: 'hunter',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:hunter.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Consume Hunter API',
            defaults: {
                name: 'Hunter',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'hunterApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Domain Search',
                            value: 'domainSearch',
                            description: 'Get every email address found on the internet using a given domain name, with sources',
                        },
                        {
                            name: 'Email Finder',
                            value: 'emailFinder',
                            description: 'Generate or retrieve the most likely email address from a domain name, a first name and a last name',
                        },
                        {
                            name: 'Email Verifier',
                            value: 'emailVerifier',
                            description: 'Verify the deliverability of an email address',
                        },
                    ],
                    default: 'domainSearch',
                    description: 'Operation to consume',
                },
                {
                    displayName: 'Domain',
                    name: 'domain',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'domainSearch',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Domain name from which you want to find the email addresses. For example, "stripe.com".',
                },
                {
                    displayName: 'Only Emails',
                    name: 'onlyEmails',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'domainSearch',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return only the the found emails',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'domainSearch',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'domainSearch',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 100,
                    },
                    default: 100,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'domainSearch',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            default: '',
                            options: [
                                {
                                    name: 'Personal',
                                    value: 'personal',
                                },
                                {
                                    name: 'Generic',
                                    value: 'generic',
                                },
                            ],
                        },
                        {
                            displayName: 'Seniority',
                            name: 'seniority',
                            type: 'multiOptions',
                            default: [],
                            options: [
                                {
                                    name: 'Junior',
                                    value: 'junior',
                                },
                                {
                                    name: 'Senior',
                                    value: 'senior',
                                },
                                {
                                    name: 'Executive',
                                    value: 'executive',
                                },
                            ],
                        },
                        {
                            displayName: 'Department',
                            name: 'department',
                            type: 'multiOptions',
                            default: [],
                            options: [
                                {
                                    name: 'Communication',
                                    value: 'communication',
                                },
                                {
                                    name: 'Executive',
                                    value: 'executive',
                                },
                                {
                                    name: 'Finance',
                                    value: 'finance',
                                },
                                {
                                    name: 'HR',
                                    value: 'hr',
                                },
                                {
                                    name: 'IT',
                                    value: 'it',
                                },
                                {
                                    name: 'Legal',
                                    value: 'legal',
                                },
                                {
                                    name: 'Management',
                                    value: 'management',
                                },
                                {
                                    name: 'Marketing',
                                    value: 'marketing',
                                },
                                {
                                    name: 'Sales',
                                    value: 'sales',
                                },
                                {
                                    name: 'Support',
                                    value: 'support',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Domain',
                    name: 'domain',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: [
                                'emailFinder',
                            ],
                        },
                    },
                    required: true,
                    description: 'Domain name from which you want to find the email addresses. For example, "stripe.com".',
                },
                {
                    displayName: 'First Name',
                    name: 'firstname',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'emailFinder',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The person\'s first name. It doesn\'t need to be in lowercase.',
                },
                {
                    displayName: 'Last Name',
                    name: 'lastname',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'emailFinder',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The person\'s last name. It doesn\'t need to be in lowercase.',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            operation: [
                                'emailVerifier',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The email address you want to verify',
                },
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
            for (let i = 0; i < length; i++) {
                try {
                    const operation = this.getNodeParameter('operation', 0);
                    //https://hunter.io/api-documentation/v2#domain-search
                    if (operation === 'domainSearch') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        const domain = this.getNodeParameter('domain', i);
                        const onlyEmails = this.getNodeParameter('onlyEmails', i, false);
                        qs.domain = domain;
                        if (filters.type) {
                            qs.type = filters.type;
                        }
                        if (filters.seniority) {
                            qs.seniority = filters.seniority.join(',');
                        }
                        if (filters.department) {
                            qs.department = filters.department.join(',');
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.hunterApiRequestAllItems.call(this, 'data', 'GET', '/domain-search', {}, qs);
                            // Make sure that the company information is there only once and
                            // the emails are combined underneath it.
                            if (onlyEmails === false) {
                                let tempReturnData = {};
                                for (let i = 0; i < responseData.length; i++) {
                                    if (i === 0) {
                                        tempReturnData = responseData[i];
                                        continue;
                                    }
                                    tempReturnData.emails.push.apply(tempReturnData.emails, responseData[i].emails);
                                }
                                responseData = tempReturnData;
                            }
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.limit = limit;
                            responseData = yield GenericFunctions_1.hunterApiRequest.call(this, 'GET', '/domain-search', {}, qs);
                            responseData = responseData.data;
                        }
                        if (onlyEmails === true) {
                            let tempReturnData = [];
                            if (Array.isArray(responseData)) {
                                for (const data of responseData) {
                                    tempReturnData.push.apply(tempReturnData, data.emails);
                                }
                            }
                            else {
                                tempReturnData = responseData.emails;
                            }
                            responseData = tempReturnData;
                        }
                    }
                    //https://hunter.io/api-documentation/v2#email-finder
                    if (operation === 'emailFinder') {
                        const domain = this.getNodeParameter('domain', i);
                        const firstname = this.getNodeParameter('firstname', i);
                        const lastname = this.getNodeParameter('lastname', i);
                        qs.first_name = firstname;
                        qs.last_name = lastname;
                        qs.domain = domain;
                        responseData = yield GenericFunctions_1.hunterApiRequest.call(this, 'GET', '/email-finder', {}, qs);
                        responseData = responseData.data;
                    }
                    //https://hunter.io/api-documentation/v2#email-verifier
                    if (operation === 'emailVerifier') {
                        const email = this.getNodeParameter('email', i);
                        qs.email = email;
                        responseData = yield GenericFunctions_1.hunterApiRequest.call(this, 'GET', '/email-verifier', {}, qs);
                        responseData = responseData.data;
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
exports.Hunter = Hunter;
