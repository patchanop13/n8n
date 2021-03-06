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
exports.SendGrid = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const ListDescription_1 = require("./ListDescription");
const ContactDescription_1 = require("./ContactDescription");
const MailDescription_1 = require("./MailDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class SendGrid {
    constructor() {
        this.description = {
            displayName: 'SendGrid',
            name: 'sendGrid',
            icon: 'file:sendGrid.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume SendGrid API',
            defaults: {
                name: 'SendGrid',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'sendGridApi',
                    required: true,
                },
            ],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
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
                        {
                            name: 'List',
                            value: 'list',
                        },
                        {
                            name: 'Mail',
                            value: 'mail',
                        },
                    ],
                    default: 'list',
                    required: true,
                },
                ...ListDescription_1.listOperations,
                ...ListDescription_1.listFields,
                ...ContactDescription_1.contactOperations,
                ...ContactDescription_1.contactFields,
                ...MailDescription_1.mailOperations,
                ...MailDescription_1.mailFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get custom fields to display to user so that they can select them easily
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { custom_fields } = yield GenericFunctions_1.sendGridApiRequest.call(this, '/marketing/field_definitions', 'GET', {}, {});
                        if (custom_fields !== undefined) {
                            for (const customField of custom_fields) {
                                returnData.push({
                                    name: customField.name,
                                    value: customField.id,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                // Get lists to display to user so that they can select them easily
                getListIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const lists = yield GenericFunctions_1.sendGridApiRequestAllItems.call(this, `/marketing/lists`, 'GET', 'result', {}, {});
                        for (const list of lists) {
                            returnData.push({
                                name: list.name,
                                value: list.id,
                            });
                        }
                        return returnData;
                    });
                },
                getTemplateIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, '/templates', 'GET', {}, { generations: 'dynamic' });
                        return responseData.templates.map(({ id, name }) => ({ name, value: id }));
                    });
                },
            },
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const qs = {};
            let responseData;
            const timezone = this.getTimezone();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            // https://sendgrid.com/docs/api-reference/
            if (resource === 'contact') {
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            let endpoint = '/marketing/contacts';
                            let method = 'GET';
                            const body = {};
                            if (filters.query && filters.query !== '') {
                                endpoint = '/marketing/contacts/search';
                                method = 'POST';
                                Object.assign(body, { query: filters.query });
                            }
                            responseData = yield GenericFunctions_1.sendGridApiRequestAllItems.call(this, endpoint, method, 'result', body, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'get') {
                    const by = this.getNodeParameter('by', 0);
                    let endpoint;
                    let method;
                    const body = {};
                    for (let i = 0; i < length; i++) {
                        try {
                            if (by === 'id') {
                                method = 'GET';
                                const contactId = this.getNodeParameter('contactId', i);
                                endpoint = `/marketing/contacts/${contactId}`;
                            }
                            else {
                                const email = this.getNodeParameter('email', i);
                                endpoint = '/marketing/contacts/search';
                                method = 'POST';
                                Object.assign(body, { query: `email LIKE '${email}' ` });
                            }
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, endpoint, method, body, qs);
                            responseData = responseData.result || responseData;
                            if (Array.isArray(responseData)) {
                                responseData = responseData[0];
                            }
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'upsert') {
                    try {
                        const contacts = [];
                        let lists;
                        for (let i = 0; i < length; i++) {
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const contact = {
                                email,
                            };
                            if (additionalFields.addressUi) {
                                const addressValues = additionalFields.addressUi.addressValues;
                                const addressLine1 = addressValues.address1;
                                const addressLine2 = addressValues.address2;
                                if (addressLine2) {
                                    Object.assign(contact, { address_line_2: addressLine2 });
                                }
                                Object.assign(contact, { address_line_1: addressLine1 });
                            }
                            if (additionalFields.city) {
                                const city = additionalFields.city;
                                Object.assign(contact, { city });
                            }
                            if (additionalFields.country) {
                                const country = additionalFields.country;
                                Object.assign(contact, { country });
                            }
                            if (additionalFields.firstName) {
                                const firstName = additionalFields.firstName;
                                Object.assign(contact, { first_name: firstName });
                            }
                            if (additionalFields.lastName) {
                                const lastName = additionalFields.lastName;
                                Object.assign(contact, { last_name: lastName });
                            }
                            if (additionalFields.postalCode) {
                                const postalCode = additionalFields.postalCode;
                                Object.assign(contact, { postal_code: postalCode });
                            }
                            if (additionalFields.stateProvinceRegion) {
                                const stateProvinceRegion = additionalFields.stateProvinceRegion;
                                Object.assign(contact, { state_province_region: stateProvinceRegion });
                            }
                            if (additionalFields.alternateEmails) {
                                const alternateEmails = additionalFields.alternateEmails.split(',').filter(email => !!email);
                                if (alternateEmails.length !== 0) {
                                    Object.assign(contact, { alternate_emails: alternateEmails });
                                }
                            }
                            if (additionalFields.listIdsUi) {
                                const listIdValues = additionalFields.listIdsUi.listIdValues;
                                const listIds = listIdValues.listIds;
                                lists = listIds;
                            }
                            if (additionalFields.customFieldsUi) {
                                const customFields = additionalFields.customFieldsUi.customFieldValues;
                                if (customFields) {
                                    const data = customFields.reduce((obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }), {});
                                    Object.assign(contact, { custom_fields: data });
                                }
                            }
                            contacts.push(contact);
                        }
                        responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, '/marketing/contacts', 'PUT', { list_ids: lists, contacts }, qs);
                        returnData.push(responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                        }
                        else {
                            throw error;
                        }
                    }
                }
                if (operation === 'delete') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const deleteAll = this.getNodeParameter('deleteAll', i);
                            if (deleteAll === true) {
                                qs.delete_all_contacts = 'true';
                            }
                            qs.ids = this.getNodeParameter('ids', i).replace(/\s/g, '');
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, `/marketing/contacts`, 'DELETE', {}, qs);
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
            }
            if (resource === 'list') {
                if (operation === 'getAll') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.sendGridApiRequestAllItems.call(this, `/marketing/lists`, 'GET', 'result', {}, qs);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'get') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const listId = this.getNodeParameter('listId', i);
                            qs.contact_sample = this.getNodeParameter('contactSample', i);
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, `/marketing/lists/${listId}`, 'GET', {}, qs);
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'create') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const name = this.getNodeParameter('name', i);
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, '/marketing/lists', 'POST', { name }, qs);
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'delete') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const listId = this.getNodeParameter('listId', i);
                            qs.delete_contacts = this.getNodeParameter('deleteContacts', i);
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, `/marketing/lists/${listId}`, 'DELETE', {}, qs);
                            responseData = { success: true };
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                if (operation === 'update') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const name = this.getNodeParameter('name', i);
                            const listId = this.getNodeParameter('listId', i);
                            responseData = yield GenericFunctions_1.sendGridApiRequest.call(this, `/marketing/lists/${listId}`, 'PATCH', { name }, qs);
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
            }
            if (resource === 'mail') {
                if (operation === 'send') {
                    for (let i = 0; i < length; i++) {
                        try {
                            const toEmail = this.getNodeParameter('toEmail', i);
                            const parsedToEmail = toEmail.includes(',')
                                ? toEmail.split(',').map((i) => ({ email: i.trim() }))
                                : [{ email: toEmail.trim() }];
                            const { bccEmail, ccEmail, enableSandbox, sendAt, headers, attachments, categories, ipPoolName, } = this.getNodeParameter('additionalFields', i);
                            const body = {
                                personalizations: [{
                                        to: parsedToEmail,
                                    }],
                                from: {
                                    email: this.getNodeParameter('fromEmail', i).trim(),
                                    name: this.getNodeParameter('fromName', i),
                                },
                                mail_settings: {
                                    sandbox_mode: {
                                        enable: enableSandbox || false,
                                    },
                                },
                            };
                            const dynamicTemplateEnabled = this.getNodeParameter('dynamicTemplate', i);
                            // dynamic template
                            if (dynamicTemplateEnabled) {
                                body.template_id = this.getNodeParameter('templateId', i);
                                const { fields } = this.getNodeParameter('dynamicTemplateFields', i);
                                if (fields) {
                                    body.personalizations[0].dynamic_template_data = {};
                                    fields.forEach(field => {
                                        body.personalizations[0].dynamic_template_data[field.key] = field.value;
                                    });
                                }
                                // message body
                            }
                            else {
                                body.personalizations[0].subject = this.getNodeParameter('subject', i);
                                body.content = [{
                                        type: this.getNodeParameter('contentType', i),
                                        value: this.getNodeParameter('contentValue', i),
                                    }];
                            }
                            if (attachments) {
                                const attachmentsToSend = [];
                                const binaryProperties = attachments.split(',').map((p) => p.trim());
                                for (const property of binaryProperties) {
                                    if (!((_a = items[i].binary) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(property))) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The binary property ${property} does not exist`);
                                    }
                                    const binaryProperty = items[i].binary[property];
                                    const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, property);
                                    attachmentsToSend.push({
                                        content: dataBuffer.toString('base64'),
                                        filename: binaryProperty.fileName || 'unknown',
                                        type: binaryProperty.mimeType,
                                    });
                                }
                                if (attachmentsToSend.length) {
                                    body.attachments = attachmentsToSend;
                                }
                            }
                            if (bccEmail) {
                                body.personalizations[0].bcc = bccEmail.split(',').map(i => ({ email: i.trim() }));
                            }
                            if (ccEmail) {
                                body.personalizations[0].cc = ccEmail.split(',').map(i => ({ email: i.trim() }));
                            }
                            if (headers === null || headers === void 0 ? void 0 : headers.details.length) {
                                const parsedHeaders = {};
                                headers.details.forEach(obj => parsedHeaders[obj['key']] = obj['value']);
                                body.headers = parsedHeaders;
                            }
                            if (categories) {
                                body.categories = categories.split(',');
                            }
                            if (ipPoolName) {
                                body.ip_pool_name = ipPoolName;
                            }
                            if (sendAt) {
                                body.personalizations[0].send_at = moment_timezone_1.default.tz(sendAt, timezone).unix();
                            }
                            const data = yield GenericFunctions_1.sendGridApiRequest.call(this, '/mail/send', 'POST', body, qs, { resolveWithFullResponse: true });
                            returnData.push({ messageId: data.headers['x-message-id'] });
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.SendGrid = SendGrid;
