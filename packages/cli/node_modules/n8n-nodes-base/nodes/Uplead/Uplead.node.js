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
exports.Uplead = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CompanyDesciption_1 = require("./CompanyDesciption");
const PersonDescription_1 = require("./PersonDescription");
class Uplead {
    constructor() {
        this.description = {
            displayName: 'Uplead',
            name: 'uplead',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:uplead.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume Uplead API',
            defaults: {
                name: 'Uplead',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'upleadApi',
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
                            description: 'Company API lets you lookup company data via a domain name or company name',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                            description: 'Person API lets you lookup a person based on an email address OR based on a domain name + first name + last name',
                        },
                    ],
                    default: 'company',
                },
                ...CompanyDesciption_1.companyOperations,
                ...CompanyDesciption_1.companyFields,
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
                            const firstname = this.getNodeParameter('firstname', i);
                            const lastname = this.getNodeParameter('lastname', i);
                            const domain = this.getNodeParameter('domain', i);
                            if (email) {
                                qs.email = email;
                            }
                            if (firstname) {
                                qs.first_name = firstname;
                            }
                            if (lastname) {
                                qs.last_name = lastname;
                            }
                            if (domain) {
                                qs.domain = domain;
                            }
                            responseData = yield GenericFunctions_1.upleadApiRequest.call(this, 'GET', '/person-search', {}, qs);
                        }
                    }
                    if (resource === 'company') {
                        if (operation === 'enrich') {
                            const domain = this.getNodeParameter('domain', i);
                            const company = this.getNodeParameter('company', i);
                            if (domain) {
                                qs.domain = domain;
                            }
                            if (company) {
                                qs.company = company;
                            }
                            responseData = yield GenericFunctions_1.upleadApiRequest.call(this, 'GET', '/company-search', {}, qs);
                        }
                    }
                    if (Array.isArray(responseData.data)) {
                        returnData.push.apply(returnData, responseData.data);
                    }
                    else {
                        if (responseData.data !== null) {
                            returnData.push(responseData.data);
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
exports.Uplead = Uplead;
