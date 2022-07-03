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
exports.Keap = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
const ContactNoteDescription_1 = require("./ContactNoteDescription");
const ContactTagDescription_1 = require("./ContactTagDescription");
const EcommerceOrderDescripion_1 = require("./EcommerceOrderDescripion");
const EcommerceProductDescription_1 = require("./EcommerceProductDescription");
const EmailDescription_1 = require("./EmailDescription");
const FileDescription_1 = require("./FileDescription");
const CompanyDescription_1 = require("./CompanyDescription");
const change_case_1 = require("change-case");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Keap {
    constructor() {
        this.description = {
            displayName: 'Keap',
            name: 'keap',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:keap.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Keap API',
            defaults: {
                name: 'Keap',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'keapOAuth2Api',
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
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Contact Note',
                            value: 'contactNote',
                        },
                        {
                            name: 'Contact Tag',
                            value: 'contactTag',
                        },
                        {
                            name: 'Ecommerce Order',
                            value: 'ecommerceOrder',
                        },
                        {
                            name: 'Ecommerce Product',
                            value: 'ecommerceProduct',
                        },
                        {
                            name: 'Email',
                            value: 'email',
                        },
                        {
                            name: 'File',
                            value: 'file',
                        },
                    ],
                    default: 'company',
                },
                // COMPANY
                ...CompanyDescription_1.companyOperations,
                ...CompanyDescription_1.companyFields,
                // CONTACT
                ...ContactDescription_1.contactOperations,
                ...ContactDescription_1.contactFields,
                // CONTACT NOTE
                ...ContactNoteDescription_1.contactNoteOperations,
                ...ContactNoteDescription_1.contactNoteFields,
                // CONTACT TAG
                ...ContactTagDescription_1.contactTagOperations,
                ...ContactTagDescription_1.contactTagFields,
                // ECOMMERCE ORDER
                ...EcommerceOrderDescripion_1.ecommerceOrderOperations,
                ...EcommerceOrderDescripion_1.ecommerceOrderFields,
                // ECOMMERCE PRODUCT
                ...EcommerceProductDescription_1.ecommerceProductOperations,
                ...EcommerceProductDescription_1.ecommerceProductFields,
                // EMAIL
                ...EmailDescription_1.emailOperations,
                ...EmailDescription_1.emailFields,
                // FILE
                ...FileDescription_1.fileOperations,
                ...FileDescription_1.fileFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const tags = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'tags', 'GET', '/tags');
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = tag.id;
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the users to display them to user so that he can
                // select them easily
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'users', 'GET', '/users');
                        for (const user of users) {
                            const userName = user.given_name;
                            const userId = user.id;
                            returnData.push({
                                name: userName,
                                value: userId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the countries to display them to user so that he can
                // select them easily
                getCountries() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { countries } = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/locales/countries');
                        for (const key of Object.keys(countries)) {
                            const countryName = countries[key];
                            const countryId = key;
                            returnData.push({
                                name: countryName,
                                value: countryId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the provinces to display them to user so that he can
                // select them easily
                getProvinces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const countryCode = this.getCurrentNodeParameter('countryCode');
                        const returnData = [];
                        const { provinces } = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', `/locales/countries/${countryCode}/provinces`);
                        for (const key of Object.keys(provinces)) {
                            const provinceName = provinces[key];
                            const provinceId = key;
                            returnData.push({
                                name: provinceName,
                                value: provinceId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the contact types to display them to user so that he can
                // select them easily
                getContactTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const types = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/setting/contact/optionTypes');
                        for (const type of types.value.split(',')) {
                            const typeName = type;
                            const typeId = type;
                            returnData.push({
                                name: typeName,
                                value: typeId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the timezones to display them to user so that he can
                // select them easily
                getTimezones() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const timezone of moment_timezone_1.default.tz.names()) {
                            const timezoneName = timezone;
                            const timezoneId = timezone;
                            returnData.push({
                                name: timezoneName,
                                value: timezoneId,
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
                if (resource === 'company') {
                    //https://developer.keap.com/docs/rest/#!/Company/createCompanyUsingPOST
                    if (operation === 'create') {
                        const addresses = this.getNodeParameter('addressesUi', i).addressesValues;
                        const faxes = this.getNodeParameter('faxesUi', i).faxesValues;
                        const phones = this.getNodeParameter('phonesUi', i).phonesValues;
                        const companyName = this.getNodeParameter('companyName', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            company_name: companyName,
                        };
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        Object.assign(body, additionalFields);
                        if (addresses) {
                            body.address = (0, GenericFunctions_1.keysToSnakeCase)(addresses)[0];
                        }
                        if (faxes) {
                            body.fax_number = faxes[0];
                        }
                        if (phones) {
                            body.phone_number = phones[0];
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/companies', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Company/listCompaniesUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(options);
                        Object.assign(qs, options);
                        if (qs.fields) {
                            qs.optional_properties = qs.fields;
                            delete qs.fields;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'companies', 'GET', '/companies', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/companies', {}, qs);
                            responseData = responseData.companies;
                        }
                    }
                }
                if (resource === 'contact') {
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/createOrUpdateContactUsingPUT
                    if (operation === 'upsert') {
                        const duplicateOption = this.getNodeParameter('duplicateOption', i);
                        const addresses = this.getNodeParameter('addressesUi', i).addressesValues;
                        const emails = this.getNodeParameter('emailsUi', i).emailsValues;
                        const faxes = this.getNodeParameter('faxesUi', i).faxesValues;
                        const socialAccounts = this.getNodeParameter('socialAccountsUi', i).socialAccountsValues;
                        const phones = this.getNodeParameter('phonesUi', i).phonesValues;
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            duplicate_option: (0, change_case_1.pascalCase)(duplicateOption),
                        };
                        if (additionalFields.anniversary) {
                            body.anniversary = additionalFields.anniversary;
                        }
                        if (additionalFields.contactType) {
                            body.contact_type = additionalFields.contactType;
                        }
                        if (additionalFields.familyName) {
                            body.family_name = additionalFields.familyName;
                        }
                        if (additionalFields.givenName) {
                            body.given_name = additionalFields.givenName;
                        }
                        if (additionalFields.jobTitle) {
                            body.job_title = additionalFields.jobTitle;
                        }
                        if (additionalFields.leadSourceId) {
                            body.lead_source_id = additionalFields.leadSourceId;
                        }
                        if (additionalFields.middleName) {
                            body.middle_name = additionalFields.middleName;
                        }
                        if (additionalFields.middleName) {
                            body.middle_name = additionalFields.middleName;
                        }
                        if (additionalFields.OptInReason) {
                            body.opt_in_reason = additionalFields.OptInReason;
                        }
                        if (additionalFields.ownerId) {
                            body.owner_id = additionalFields.ownerId;
                        }
                        if (additionalFields.preferredLocale) {
                            body.preferred_locale = additionalFields.preferredLocale;
                        }
                        if (additionalFields.preferredName) {
                            body.preferred_name = additionalFields.preferredName;
                        }
                        if (additionalFields.sourceType) {
                            body.source_type = additionalFields.sourceType;
                        }
                        if (additionalFields.spouseName) {
                            body.spouse_name = additionalFields.spouseName;
                        }
                        if (additionalFields.timezone) {
                            body.time_zone = additionalFields.timezone;
                        }
                        if (additionalFields.website) {
                            body.website = additionalFields.website;
                        }
                        if (additionalFields.ipAddress) {
                            body.origin = { ip_address: additionalFields.ipAddress };
                        }
                        if (additionalFields.companyId) {
                            body.company = { id: additionalFields.companyId };
                        }
                        if (additionalFields.optInReason) {
                            body.opt_in_reason = additionalFields.optInReason;
                        }
                        if (addresses) {
                            body.addresses = (0, GenericFunctions_1.keysToSnakeCase)(addresses);
                        }
                        if (emails) {
                            body.email_addresses = emails;
                        }
                        if (faxes) {
                            body.fax_numbers = faxes;
                        }
                        if (socialAccounts) {
                            body.social_accounts = socialAccounts;
                        }
                        if (phones) {
                            body.phone_numbers = phones;
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'PUT', '/contacts', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/deleteContactUsingDELETE
                    if (operation === 'delete') {
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/getContactUsingGET
                    if (operation === 'get') {
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        const options = this.getNodeParameter('options', i);
                        if (options.fields) {
                            qs.optional_properties = options.fields;
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', `/contacts/${contactId}`, {}, qs);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/listContactsUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        if (options.email) {
                            qs.email = options.email;
                        }
                        if (options.givenName) {
                            qs.given_name = options.givenName;
                        }
                        if (options.familyName) {
                            qs.family_name = options.familyName;
                        }
                        if (options.order) {
                            qs.order = options.order;
                        }
                        if (options.orderDirection) {
                            qs.order_direction = options.orderDirection;
                        }
                        if (options.since) {
                            qs.since = options.since;
                        }
                        if (options.until) {
                            qs.until = options.until;
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'contacts', 'GET', '/contacts', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/contacts', {}, qs);
                            responseData = responseData.contacts;
                        }
                    }
                }
                if (resource === 'contactNote') {
                    //https://developer.infusionsoft.com/docs/rest/#!/Note/createNoteUsingPOST
                    if (operation === 'create') {
                        const userId = this.getNodeParameter('userId', i);
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            user_id: userId,
                            contact_id: contactId,
                        };
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        if (additionalFields.type) {
                            additionalFields.type = (0, change_case_1.pascalCase)(additionalFields.type);
                        }
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/notes', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Note/deleteNoteUsingDELETE
                    if (operation === 'delete') {
                        const noteId = this.getNodeParameter('noteId', i);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/notes/${noteId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Note/getNoteUsingGET
                    if (operation === 'get') {
                        const noteId = this.getNodeParameter('noteId', i);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', `/notes/${noteId}`);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Note/listNotesUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(filters);
                        Object.assign(qs, filters);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'notes', 'GET', '/notes', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/notes', {}, qs);
                            responseData = responseData.notes;
                        }
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Note/updatePropertiesOnNoteUsingPATCH
                    if (operation === 'update') {
                        const noteId = this.getNodeParameter('noteId', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {};
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        if (additionalFields.type) {
                            additionalFields.type = (0, change_case_1.pascalCase)(additionalFields.type);
                        }
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'PATCH', `/notes/${noteId}`, body);
                    }
                }
                if (resource === 'contactTag') {
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/applyTagsToContactIdUsingPOST
                    if (operation === 'create') {
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        const tagIds = this.getNodeParameter('tagIds', i);
                        const body = {
                            tagIds,
                        };
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', `/contacts/${contactId}/tags`, body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/removeTagsFromContactUsingDELETE_1
                    if (operation === 'delete') {
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        const tagIds = this.getNodeParameter('tagIds', i);
                        qs.ids = tagIds;
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/contacts/${contactId}/tags`, {}, qs);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Contact/listAppliedTagsUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'tags', 'GET', `/contacts/${contactId}/tags`, {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', `/contacts/${contactId}/tags`, {}, qs);
                            responseData = responseData.tags;
                        }
                    }
                }
                if (resource === 'ecommerceOrder') {
                    //https://developer.infusionsoft.com/docs/rest/#!/E-Commerce/createOrderUsingPOST
                    if (operation === 'create') {
                        const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                        const orderDate = this.getNodeParameter('orderDate', i);
                        const orderTitle = this.getNodeParameter('orderTitle', i);
                        const orderType = this.getNodeParameter('orderType', i);
                        const orderItems = this.getNodeParameter('orderItemsUi', i).orderItemsValues;
                        const shippingAddress = this.getNodeParameter('addressUi', i).addressValues;
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            contact_id: contactId,
                            order_date: orderDate,
                            order_title: orderTitle,
                            order_type: (0, change_case_1.pascalCase)(orderType),
                        };
                        if (additionalFields.promoCodes) {
                            additionalFields.promoCodes = additionalFields.promoCodes.split(',');
                        }
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        Object.assign(body, additionalFields);
                        body.order_items = (0, GenericFunctions_1.keysToSnakeCase)(orderItems);
                        if (shippingAddress) {
                            body.shipping_address = (0, GenericFunctions_1.keysToSnakeCase)(shippingAddress)[0];
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/orders', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/E-Commerce/deleteOrderUsingDELETE
                    if (operation === 'delete') {
                        const orderId = parseInt(this.getNodeParameter('orderId', i), 10);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/orders/${orderId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/E-Commerce/getOrderUsingGET
                    if (operation === 'get') {
                        const orderId = parseInt(this.getNodeParameter('orderId', i), 10);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'get', `/orders/${orderId}`);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/E-Commerce/listOrdersUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(options);
                        Object.assign(qs, options);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'orders', 'GET', '/orders', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/orders', {}, qs);
                            responseData = responseData.orders;
                        }
                    }
                }
                if (resource === 'ecommerceProduct') {
                    //https://developer.infusionsoft.com/docs/rest/#!/Product/createProductUsingPOST
                    if (operation === 'create') {
                        const productName = this.getNodeParameter('productName', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            product_name: productName,
                        };
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/products', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Product/deleteProductUsingDELETE
                    if (operation === 'delete') {
                        const productId = this.getNodeParameter('productId', i);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/products/${productId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Product/retrieveProductUsingGET
                    if (operation === 'get') {
                        const productId = this.getNodeParameter('productId', i);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'get', `/products/${productId}`);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Product/listProductsUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(filters);
                        Object.assign(qs, filters);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'products', 'GET', '/products', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/products', {}, qs);
                            responseData = responseData.products;
                        }
                    }
                }
                if (resource === 'email') {
                    //https://developer.infusionsoft.com/docs/rest/#!/Email/createEmailUsingPOST
                    if (operation === 'createRecord') {
                        const sentFromAddress = this.getNodeParameter('sentFromAddress', i);
                        const sendToAddress = this.getNodeParameter('sentToAddress', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            sent_to_address: sendToAddress,
                            sent_from_address: sentFromAddress,
                        };
                        Object.assign(body, additionalFields);
                        (0, GenericFunctions_1.keysToSnakeCase)(body);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/emails', body);
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Email/deleteEmailUsingDELETE
                    if (operation === 'deleteRecord') {
                        const emailRecordId = parseInt(this.getNodeParameter('emailRecordId', i), 10);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/emails/${emailRecordId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Email/listEmailsUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(filters);
                        Object.assign(qs, filters);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'emails', 'GET', '/emails', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/emails', {}, qs);
                            responseData = responseData.emails;
                        }
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/Email/deleteEmailUsingDELETE
                    if (operation === 'send') {
                        const userId = this.getNodeParameter('userId', i);
                        const contactIds = this.getNodeParameter('contactIds', i).split(',').map((e) => (parseInt(e, 10)));
                        const subject = this.getNodeParameter('subject', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            user_id: userId,
                            contacts: contactIds,
                            subject,
                        };
                        (0, GenericFunctions_1.keysToSnakeCase)(additionalFields);
                        Object.assign(body, additionalFields);
                        const attachmentsUi = this.getNodeParameter('attachmentsUi', i);
                        let attachments = [];
                        if (attachmentsUi) {
                            if (attachmentsUi.attachmentsValues) {
                                (0, GenericFunctions_1.keysToSnakeCase)(attachmentsUi.attachmentsValues);
                                attachments = attachmentsUi.attachmentsValues;
                            }
                            if (attachmentsUi.attachmentsBinary
                                && attachmentsUi.attachmentsBinary.length) {
                                if (items[i].binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                for (const { property } of attachmentsUi.attachmentsBinary) {
                                    const item = items[i].binary;
                                    if (item[property] === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Binary data property "${property}" does not exists on item!`);
                                    }
                                    attachments.push({
                                        file_data: item[property].data,
                                        file_name: item[property].fileName,
                                    });
                                }
                            }
                            body.attachments = attachments;
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/emails/queue', body);
                        responseData = { success: true };
                    }
                }
                if (resource === 'file') {
                    //https://developer.infusionsoft.com/docs/rest/#!/File/deleteFileUsingDELETE
                    if (operation === 'delete') {
                        const fileId = parseInt(this.getNodeParameter('fileId', i), 10);
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'DELETE', `/files/${fileId}`);
                        responseData = { success: true };
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/File/listFilesUsingGET
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        (0, GenericFunctions_1.keysToSnakeCase)(filters);
                        Object.assign(qs, filters);
                        if (qs.permission) {
                            qs.permission = qs.permission.toUpperCase();
                        }
                        if (qs.type) {
                            qs.type = (0, change_case_1.capitalCase)(qs.type);
                        }
                        if (qs.viewable) {
                            qs.viewable = qs.viewable.toUpperCase();
                        }
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.keapApiRequestAllItems.call(this, 'files', 'GET', '/files', {}, qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'GET', '/files', {}, qs);
                            responseData = responseData.files;
                        }
                    }
                    //https://developer.infusionsoft.com/docs/rest/#!/File/createFileUsingPOST
                    if (operation === 'upload') {
                        const binaryData = this.getNodeParameter('binaryData', i);
                        const fileAssociation = this.getNodeParameter('fileAssociation', i);
                        const isPublic = this.getNodeParameter('isPublic', i);
                        const body = {
                            is_public: isPublic,
                            file_association: fileAssociation.toUpperCase(),
                        };
                        if (fileAssociation === 'contact') {
                            const contactId = parseInt(this.getNodeParameter('contactId', i), 10);
                            body.contact_id = contactId;
                        }
                        if (binaryData) {
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            if (items[i].binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            const item = items[i].binary;
                            if (item[binaryPropertyName] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                            }
                            body.file_data = item[binaryPropertyName].data;
                            body.file_name = item[binaryPropertyName].fileName;
                        }
                        else {
                            const fileName = this.getNodeParameter('fileName', i);
                            const fileData = this.getNodeParameter('fileData', i);
                            body.file_name = fileName;
                            body.file_data = fileData;
                        }
                        responseData = yield GenericFunctions_1.keapApiRequest.call(this, 'POST', '/files', body);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else if (responseData !== undefined) {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Keap = Keap;
