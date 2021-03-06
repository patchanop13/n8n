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
exports.Intercom = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const LeadDescription_1 = require("./LeadDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const UserDescription_1 = require("./UserDescription");
const CompanyDescription_1 = require("./CompanyDescription");
class Intercom {
    constructor() {
        this.description = {
            displayName: 'Intercom',
            name: 'intercom',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:intercom.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Intercom API',
            defaults: {
                name: 'Intercom',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'intercomApi',
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
                            description: 'Companies allow you to represent commercial organizations using your product',
                        },
                        {
                            name: 'Lead',
                            value: 'lead',
                            description: 'Leads are useful for representing logged-out users of your application',
                        },
                        {
                            name: 'User',
                            value: 'user',
                            description: 'The Users resource is the primary way of interacting with Intercom',
                        },
                    ],
                    default: 'user',
                },
                ...LeadDescription_1.leadOpeations,
                ...UserDescription_1.userOpeations,
                ...CompanyDescription_1.companyOperations,
                ...UserDescription_1.userFields,
                ...LeadDescription_1.leadFields,
                ...CompanyDescription_1.companyFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available companies to display them to user so that he can
                // select them easily
                getCompanies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        let companies, response;
                        try {
                            response = yield GenericFunctions_1.intercomApiRequest.call(this, '/companies', 'GET');
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                        companies = response.companies;
                        for (const company of companies) {
                            const companyName = company.name;
                            const companyId = company.company_id;
                            returnData.push({
                                name: companyName,
                                value: companyId,
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
            let qs;
            let responseData;
            for (let i = 0; i < length; i++) {
                try {
                    qs = {};
                    const resource = this.getNodeParameter('resource', 0);
                    const operation = this.getNodeParameter('operation', 0);
                    //https://developers.intercom.com/intercom-api-reference/reference#leads
                    if (resource === 'lead') {
                        if (operation === 'create' || operation === 'update') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const body = {};
                            if (operation === 'create') {
                                body.email = this.getNodeParameter('email', i);
                            }
                            if (additionalFields.email) {
                                body.email = additionalFields.email;
                            }
                            if (additionalFields.phone) {
                                body.phone = additionalFields.phone;
                            }
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            if (additionalFields.unsubscribedFromEmails) {
                                body.unsubscribed_from_emails = additionalFields.unsubscribedFromEmails;
                            }
                            if (additionalFields.updateLastRequestAt) {
                                body.update_last_request_at = additionalFields.updateLastRequestAt;
                            }
                            if (additionalFields.utmSource) {
                                body.utm_source = additionalFields.utmSource;
                            }
                            if (additionalFields.utmMedium) {
                                body.utm_medium = additionalFields.utmMedium;
                            }
                            if (additionalFields.utmCampaign) {
                                body.utm_campaign = additionalFields.utmCampaign;
                            }
                            if (additionalFields.utmTerm) {
                                body.utm_term = additionalFields.utmTerm;
                            }
                            if (additionalFields.utmContent) {
                                body.utm_content = additionalFields.utmContent;
                            }
                            if (additionalFields.avatar) {
                                const avatar = {
                                    type: 'avatar',
                                    image_url: additionalFields.avatar,
                                };
                                body.avatar = avatar;
                            }
                            if (additionalFields.companies) {
                                const companies = [];
                                // @ts-ignore
                                additionalFields.companies.forEach(o => {
                                    const company = {};
                                    company.company_id = o;
                                    companies.push(company);
                                });
                                body.companies = companies;
                            }
                            if (!jsonActive) {
                                const customAttributesValues = this.getNodeParameter('customAttributesUi', i).customAttributesValues;
                                if (customAttributesValues) {
                                    const customAttributes = {};
                                    for (let i = 0; i < customAttributesValues.length; i++) {
                                        // @ts-ignore
                                        customAttributes[customAttributesValues[i].name] = customAttributesValues[i].value;
                                    }
                                    body.custom_attributes = customAttributes;
                                }
                            }
                            else {
                                const customAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('customAttributesJson', i));
                                if (customAttributesJson) {
                                    body.custom_attributes = customAttributesJson;
                                }
                            }
                            if (operation === 'update') {
                                const updateBy = this.getNodeParameter('updateBy', 0);
                                const value = this.getNodeParameter('value', i);
                                if (updateBy === 'userId') {
                                    body.user_id = value;
                                }
                                if (updateBy === 'id') {
                                    body.id = value;
                                }
                            }
                            try {
                                responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/contacts', 'POST', body);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'get') {
                            const selectBy = this.getNodeParameter('selectBy', 0);
                            const value = this.getNodeParameter('value', i);
                            if (selectBy === 'email') {
                                qs.email = value;
                            }
                            if (selectBy === 'userId') {
                                qs.user_id = value;
                            }
                            if (selectBy === 'phone') {
                                qs.phone = value;
                            }
                            try {
                                if (selectBy === 'id') {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/contacts/${value}`, 'GET');
                                }
                                else {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/contacts', 'GET', {}, qs);
                                    responseData = responseData.contacts;
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            try {
                                if (returnAll === true) {
                                    responseData = yield GenericFunctions_1.intercomApiRequestAllItems.call(this, 'contacts', '/contacts', 'GET', {}, qs);
                                }
                                else {
                                    qs.per_page = this.getNodeParameter('limit', i);
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/contacts', 'GET', {}, qs);
                                    responseData = responseData.contacts;
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'delete') {
                            const deleteBy = this.getNodeParameter('deleteBy', 0);
                            const value = this.getNodeParameter('value', i);
                            try {
                                if (deleteBy === 'id') {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/contacts/${value}`, 'DELETE');
                                }
                                else {
                                    qs.user_id = value;
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/contacts', 'DELETE', {}, qs);
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                    }
                    //https://developers.intercom.com/intercom-api-reference/reference#users
                    if (resource === 'user') {
                        if (operation === 'create' || operation === 'update') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const body = {};
                            if (operation === 'create') {
                                const identifierType = this.getNodeParameter('identifierType', i);
                                if (identifierType === 'email') {
                                    body.email = this.getNodeParameter('idValue', i);
                                }
                                else if (identifierType === 'userId') {
                                    body.user_id = this.getNodeParameter('idValue', i);
                                }
                            }
                            if (additionalFields.email) {
                                body.email = additionalFields.email;
                            }
                            if (additionalFields.userId) {
                                body.user_id = additionalFields.userId;
                            }
                            if (additionalFields.phone) {
                                body.phone = additionalFields.phone;
                            }
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            if (additionalFields.unsubscribedFromEmails) {
                                body.unsubscribed_from_emails = additionalFields.unsubscribedFromEmails;
                            }
                            if (additionalFields.updateLastRequestAt) {
                                body.update_last_request_at = additionalFields.updateLastRequestAt;
                            }
                            if (additionalFields.sessionCount) {
                                body.session_count = additionalFields.sessionCount;
                            }
                            if (additionalFields.avatar) {
                                const avatar = {
                                    type: 'avatar',
                                    image_url: additionalFields.avatar,
                                };
                                body.avatar = avatar;
                            }
                            if (additionalFields.utmSource) {
                                body.utm_source = additionalFields.utmSource;
                            }
                            if (additionalFields.utmMedium) {
                                body.utm_medium = additionalFields.utmMedium;
                            }
                            if (additionalFields.utmCampaign) {
                                body.utm_campaign = additionalFields.utmCampaign;
                            }
                            if (additionalFields.utmTerm) {
                                body.utm_term = additionalFields.utmTerm;
                            }
                            if (additionalFields.utmContent) {
                                body.utm_content = additionalFields.utmContent;
                            }
                            if (additionalFields.companies) {
                                const companies = [];
                                // @ts-ignore
                                additionalFields.companies.forEach(o => {
                                    const company = {};
                                    company.company_id = o;
                                    companies.push(company);
                                });
                                body.companies = companies;
                            }
                            if (additionalFields.sessionCount) {
                                body.session_count = additionalFields.sessionCount;
                            }
                            if (!jsonActive) {
                                const customAttributesValues = this.getNodeParameter('customAttributesUi', i).customAttributesValues;
                                if (customAttributesValues) {
                                    const customAttributes = {};
                                    for (let i = 0; i < customAttributesValues.length; i++) {
                                        // @ts-ignore
                                        customAttributes[customAttributesValues[i].name] = customAttributesValues[i].value;
                                    }
                                    body.custom_attributes = customAttributes;
                                }
                            }
                            else {
                                const customAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('customAttributesJson', i));
                                if (customAttributesJson) {
                                    body.custom_attributes = customAttributesJson;
                                }
                            }
                            if (operation === 'update') {
                                const updateBy = this.getNodeParameter('updateBy', 0);
                                const value = this.getNodeParameter('value', i);
                                if (updateBy === 'userId') {
                                    body.user_id = value;
                                }
                                if (updateBy === 'id') {
                                    body.id = value;
                                }
                                if (updateBy === 'email') {
                                    body.email = value;
                                }
                            }
                            try {
                                responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/users', 'POST', body, qs);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'get') {
                            const selectBy = this.getNodeParameter('selectBy', 0);
                            const value = this.getNodeParameter('value', i);
                            if (selectBy === 'userId') {
                                qs.user_id = value;
                            }
                            try {
                                if (selectBy === 'id') {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/users/${value}`, 'GET', {}, qs);
                                }
                                else {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/users', 'GET', {}, qs);
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            try {
                                if (returnAll === true) {
                                    responseData = yield GenericFunctions_1.intercomApiRequestAllItems.call(this, 'users', '/users', 'GET', {}, qs);
                                }
                                else {
                                    qs.per_page = this.getNodeParameter('limit', i);
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/users', 'GET', {}, qs);
                                    responseData = responseData.users;
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                        if (operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            try {
                                responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/users/${id}`, 'DELETE');
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Intercom Error: ${JSON.stringify(error)}`);
                            }
                        }
                    }
                    //https://developers.intercom.com/intercom-api-reference/reference#companies
                    if (resource === 'company') {
                        if (operation === 'create' || operation === 'update') {
                            const id = this.getNodeParameter('companyId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const jsonActive = this.getNodeParameter('jsonParameters', i);
                            const body = {
                                company_id: id,
                            };
                            if (additionalFields.monthlySpend) {
                                body.monthly_spend = additionalFields.monthlySpend;
                            }
                            if (additionalFields.name) {
                                body.name = additionalFields.name;
                            }
                            if (additionalFields.plan) {
                                body.plan = additionalFields.plan;
                            }
                            if (additionalFields.size) {
                                body.size = additionalFields.size;
                            }
                            if (additionalFields.website) {
                                body.website = additionalFields.website;
                            }
                            if (additionalFields.industry) {
                                body.industry = additionalFields.industry;
                            }
                            if (!jsonActive) {
                                const customAttributesValues = this.getNodeParameter('customAttributesUi', i).customAttributesValues;
                                if (customAttributesValues) {
                                    const customAttributes = {};
                                    for (let i = 0; i < customAttributesValues.length; i++) {
                                        // @ts-ignore
                                        customAttributes[customAttributesValues[i].name] = customAttributesValues[i].value;
                                    }
                                    body.custom_attributes = customAttributes;
                                }
                            }
                            else {
                                const customAttributesJson = (0, GenericFunctions_1.validateJSON)(this.getNodeParameter('customAttributesJson', i));
                                if (customAttributesJson) {
                                    body.custom_attributes = customAttributesJson;
                                }
                            }
                            try {
                                responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/companies', 'POST', body, qs);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Intercom Error: ${JSON.stringify(error)}`);
                            }
                        }
                        if (operation === 'get') {
                            const selectBy = this.getNodeParameter('selectBy', 0);
                            const value = this.getNodeParameter('value', i);
                            if (selectBy === 'companyId') {
                                qs.company_id = value;
                            }
                            if (selectBy === 'name') {
                                qs.name = value;
                            }
                            try {
                                if (selectBy === 'id') {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/companies/${value}`, 'GET', {}, qs);
                                }
                                else {
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/companies', 'GET', {}, qs);
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Intercom Error: ${JSON.stringify(error)}`);
                            }
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                            try {
                                if (returnAll === true) {
                                    responseData = yield GenericFunctions_1.intercomApiRequestAllItems.call(this, 'companies', '/companies', 'GET', {}, qs);
                                }
                                else {
                                    qs.per_page = this.getNodeParameter('limit', i);
                                    responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/companies', 'GET', {}, qs);
                                    responseData = responseData.companies;
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Intercom Error: ${JSON.stringify(error)}`);
                            }
                        }
                        if (operation === 'users') {
                            const listBy = this.getNodeParameter('listBy', 0);
                            const value = this.getNodeParameter('value', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (listBy === 'companyId') {
                                qs.company_id = value;
                            }
                            try {
                                if (listBy === 'id') {
                                    if (returnAll === true) {
                                        responseData = yield GenericFunctions_1.intercomApiRequestAllItems.call(this, 'users', `/companies/${value}/users`, 'GET', {}, qs);
                                    }
                                    else {
                                        qs.per_page = this.getNodeParameter('limit', i);
                                        responseData = yield GenericFunctions_1.intercomApiRequest.call(this, `/companies/${value}/users`, 'GET', {}, qs);
                                        responseData = responseData.users;
                                    }
                                }
                                else {
                                    qs.type = 'users';
                                    if (returnAll === true) {
                                        responseData = yield GenericFunctions_1.intercomApiRequestAllItems.call(this, 'users', '/companies', 'GET', {}, qs);
                                    }
                                    else {
                                        qs.per_page = this.getNodeParameter('limit', i);
                                        responseData = yield GenericFunctions_1.intercomApiRequest.call(this, '/companies', 'GET', {}, qs);
                                        responseData = responseData.users;
                                    }
                                }
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Intercom Error: ${JSON.stringify(error)}`);
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
exports.Intercom = Intercom;
