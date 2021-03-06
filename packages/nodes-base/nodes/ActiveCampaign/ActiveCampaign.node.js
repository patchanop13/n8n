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
exports.ActiveCampaign = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ContactDescription_1 = require("./ContactDescription");
const DealDescription_1 = require("./DealDescription");
const EcomOrderDescription_1 = require("./EcomOrderDescription");
const EcomCustomerDescription_1 = require("./EcomCustomerDescription");
const EcomOrderProductsDescription_1 = require("./EcomOrderProductsDescription");
const ConnectionDescription_1 = require("./ConnectionDescription");
const AccountDescription_1 = require("./AccountDescription");
const TagDescription_1 = require("./TagDescription");
const AccountContactDescription_1 = require("./AccountContactDescription");
const ContactListDescription_1 = require("./ContactListDescription");
const ContactTagDescription_1 = require("./ContactTagDescription");
const ListDescription_1 = require("./ListDescription");
/**
 * Add the additional fields to the body
 *
 * @param {IDataObject} body The body object to add fields to
 * @param {IDataObject} additionalFields The fields to add
 */
function addAdditionalFields(body, additionalFields) {
    for (const key of Object.keys(additionalFields)) {
        if (key === 'customProperties' && additionalFields.customProperties.property !== undefined) {
            for (const customProperty of additionalFields.customProperties.property) {
                body[customProperty.name] = customProperty.value;
            }
        }
        else if (key === 'fieldValues' && additionalFields.fieldValues.property !== undefined) {
            body.fieldValues = additionalFields.fieldValues.property;
        }
        else if (key === 'fields' && additionalFields.fields.property !== undefined) {
            body.fields = additionalFields.fields.property;
        }
        else {
            body[key] = additionalFields[key];
        }
    }
}
class ActiveCampaign {
    constructor() {
        this.description = {
            displayName: 'ActiveCampaign',
            name: 'activeCampaign',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:activeCampaign.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Create and edit data in ActiveCampaign',
            defaults: {
                name: 'ActiveCampaign',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'activeCampaignApi',
                    required: true,
                },
            ],
            properties: [
                // ----------------------------------
                //         resources
                // ----------------------------------
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Account Contact',
                            value: 'accountContact',
                        },
                        {
                            name: 'Connection',
                            value: 'connection',
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Contact List',
                            value: 'contactList',
                        },
                        {
                            name: 'Contact Tag',
                            value: 'contactTag',
                        },
                        {
                            name: 'Deal',
                            value: 'deal',
                        },
                        {
                            name: 'E-Commerce Customer',
                            value: 'ecommerceCustomer',
                        },
                        {
                            name: 'E-Commerce Order',
                            value: 'ecommerceOrder',
                        },
                        {
                            name: 'E-Commerce Order Product',
                            value: 'ecommerceOrderProducts',
                        },
                        {
                            name: 'List',
                            value: 'list',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                    ],
                    default: 'contact',
                },
                // ----------------------------------
                //         operations
                // ----------------------------------
                ...AccountDescription_1.accountOperations,
                ...ContactDescription_1.contactOperations,
                ...AccountContactDescription_1.accountContactOperations,
                ...ContactListDescription_1.contactListOperations,
                ...ContactTagDescription_1.contactTagOperations,
                ...ListDescription_1.listOperations,
                ...TagDescription_1.tagOperations,
                ...DealDescription_1.dealOperations,
                ...ConnectionDescription_1.connectionOperations,
                ...EcomOrderDescription_1.ecomOrderOperations,
                ...EcomCustomerDescription_1.ecomCustomerOperations,
                ...EcomOrderProductsDescription_1.ecomOrderProductsOperations,
                // ----------------------------------
                //         fields
                // ----------------------------------
                // ----------------------------------
                //         tag
                // ----------------------------------
                ...TagDescription_1.tagFields,
                // ----------------------------------
                //         list
                // ----------------------------------
                ...ListDescription_1.listFields,
                // ----------------------------------
                // ----------------------------------
                //         tag
                // ----------------------------------
                ...ContactTagDescription_1.contactTagFields,
                // ----------------------------------
                //         Contact List
                // ----------------------------------
                ...ContactListDescription_1.contactListFields,
                // ----------------------------------
                //         account
                // ----------------------------------
                ...AccountDescription_1.accountFields,
                // ----------------------------------
                //         account
                // ----------------------------------
                ...AccountContactDescription_1.accountContactFields,
                // ----------------------------------
                //         contact
                // ----------------------------------
                ...ContactDescription_1.contactFields,
                // ----------------------------------
                //         deal
                // ----------------------------------
                ...DealDescription_1.dealFields,
                // ----------------------------------
                //         connection
                // ----------------------------------
                ...ConnectionDescription_1.connectionFields,
                // ----------------------------------
                //         ecommerceOrder
                // ----------------------------------
                ...EcomOrderDescription_1.ecomOrderFields,
                // ----------------------------------
                //         ecommerceCustomer
                // ----------------------------------
                ...EcomCustomerDescription_1.ecomCustomerFields,
                // ----------------------------------
                //         ecommerceOrderProducts
                // ----------------------------------
                ...EcomOrderProductsDescription_1.ecomOrderProductsFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available custom fields to display them to user so that he can
                // select them easily
                getContactCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { fields } = yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'GET', '/api/3/fields', {}, { limit: 100 });
                        for (const field of fields) {
                            const fieldName = field.title;
                            const fieldId = field.id;
                            returnData.push({
                                name: fieldName,
                                value: fieldId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available custom fields to display them to user so that he can
                // select them easily
                getAccountCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { accountCustomFieldMeta: fields } = yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'GET', '/api/3/accountCustomFieldMeta', {}, { limit: 100 });
                        for (const field of fields) {
                            const fieldName = field.fieldLabel;
                            const fieldId = field.id;
                            returnData.push({
                                name: fieldName,
                                value: fieldId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { tags } = yield GenericFunctions_1.activeCampaignApiRequest.call(this, 'GET', '/api/3/tags', {}, { limit: 100 });
                        for (const tag of tags) {
                            returnData.push({
                                name: tag.tag,
                                value: tag.id,
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
            let resource;
            let operation;
            // For Post
            let body;
            // For Query string
            let qs;
            let requestMethod;
            let endpoint;
            let returnAll = false;
            let dataKey;
            for (let i = 0; i < items.length; i++) {
                try {
                    dataKey = undefined;
                    resource = this.getNodeParameter('resource', 0);
                    operation = this.getNodeParameter('operation', 0);
                    requestMethod = 'GET';
                    endpoint = '';
                    body = {};
                    qs = {};
                    if (resource === 'contact') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         contact:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const updateIfExists = this.getNodeParameter('updateIfExists', i);
                            if (updateIfExists === true) {
                                endpoint = '/api/3/contact/sync';
                            }
                            else {
                                endpoint = '/api/3/contacts';
                            }
                            dataKey = 'contact';
                            body.contact = {
                                email: this.getNodeParameter('email', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.contact, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         contact:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const contactId = this.getNodeParameter('contactId', i);
                            endpoint = `/api/3/contacts/${contactId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         contact:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const contactId = this.getNodeParameter('contactId', i);
                            endpoint = `/api/3/contacts/${contactId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         contacts:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            returnAll = this.getNodeParameter('returnAll', i);
                            const simple = this.getNodeParameter('simple', i, true);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            Object.assign(qs, additionalFields);
                            if (qs.orderBy) {
                                qs[qs.orderBy] = true;
                                delete qs.orderBy;
                            }
                            if (simple === true) {
                                dataKey = 'contacts';
                            }
                            endpoint = `/api/3/contacts`;
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         contact:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const contactId = this.getNodeParameter('contactId', i);
                            endpoint = `/api/3/contacts/${contactId}`;
                            dataKey = 'contact';
                            body.contact = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.contact, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'account') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         account:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/accounts';
                            dataKey = 'account';
                            body.account = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.account, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         account:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const accountId = this.getNodeParameter('accountId', i);
                            endpoint = `/api/3/accounts/${accountId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         account:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const accountId = this.getNodeParameter('accountId', i);
                            endpoint = `/api/3/accounts/${accountId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         account:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'accounts';
                            }
                            endpoint = `/api/3/accounts`;
                            const filters = this.getNodeParameter('filters', i);
                            Object.assign(qs, filters);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         account:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const accountId = this.getNodeParameter('accountId', i);
                            endpoint = `/api/3/accounts/${accountId}`;
                            dataKey = 'account';
                            body.account = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.account, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'accountContact') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         account:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/accountContacts';
                            dataKey = 'accountContact';
                            body.accountContact = {
                                contact: this.getNodeParameter('contact', i),
                                account: this.getNodeParameter('account', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.account, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         accountContact:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const accountContactId = this.getNodeParameter('accountContactId', i);
                            endpoint = `/api/3/accountContacts/${accountContactId}`;
                            dataKey = 'accountContact';
                            body.accountContact = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.accountContact, updateFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         accountContact:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const accountContactId = this.getNodeParameter('accountContactId', i);
                            endpoint = `/api/3/accountContacts/${accountContactId}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'contactTag') {
                        if (operation === 'add') {
                            // ----------------------------------
                            //         contactTag:add
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/contactTags';
                            dataKey = 'contactTag';
                            body.contactTag = {
                                contact: this.getNodeParameter('contactId', i),
                                tag: this.getNodeParameter('tagId', i),
                            };
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------
                            //         contactTag:remove
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const contactTagId = this.getNodeParameter('contactTagId', i);
                            endpoint = `/api/3/contactTags/${contactTagId}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'contactList') {
                        if (operation === 'add') {
                            // ----------------------------------
                            //         contactList:add
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/contactLists';
                            dataKey = 'contactTag';
                            body.contactList = {
                                list: this.getNodeParameter('listId', i),
                                contact: this.getNodeParameter('contactId', i),
                                status: 1,
                            };
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------
                            //         contactList:remove
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/contactLists';
                            body.contactList = {
                                list: this.getNodeParameter('listId', i),
                                contact: this.getNodeParameter('contactId', i),
                                status: 2,
                            };
                            dataKey = 'contacts';
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'list') {
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //         list:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            returnAll = this.getNodeParameter('returnAll', i);
                            const simple = this.getNodeParameter('simple', i, true);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'lists';
                            }
                            endpoint = `/api/3/lists`;
                        }
                    }
                    else if (resource === 'tag') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         tag:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/tags';
                            dataKey = 'tag';
                            body.tag = {
                                tag: this.getNodeParameter('name', i),
                                tagType: this.getNodeParameter('tagType', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.tag, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         tag:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const tagId = this.getNodeParameter('tagId', i);
                            endpoint = `/api/3/tags/${tagId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         tag:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const tagId = this.getNodeParameter('tagId', i);
                            endpoint = `/api/3/tags/${tagId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         tags:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'tags';
                            }
                            endpoint = `/api/3/tags`;
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         tags:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const tagId = this.getNodeParameter('tagId', i);
                            endpoint = `/api/3/tags/${tagId}`;
                            dataKey = 'tag';
                            body.tag = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.tag, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'deal') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         deal:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/deals';
                            body.deal = {
                                title: this.getNodeParameter('title', i),
                                contact: this.getNodeParameter('contact', i),
                                value: this.getNodeParameter('value', i),
                                currency: this.getNodeParameter('currency', i),
                            };
                            const group = this.getNodeParameter('group', i);
                            if (group !== '') {
                                addAdditionalFields(body.deal, { group });
                            }
                            const owner = this.getNodeParameter('owner', i);
                            if (owner !== '') {
                                addAdditionalFields(body.deal, { owner });
                            }
                            const stage = this.getNodeParameter('stage', i);
                            if (stage !== '') {
                                addAdditionalFields(body.deal, { stage });
                            }
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.deal, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         deal:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const dealId = this.getNodeParameter('dealId', i);
                            endpoint = `/api/3/deals/${dealId}`;
                            body.deal = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.deal, updateFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         deal:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const dealId = this.getNodeParameter('dealId', i);
                            endpoint = `/api/3/deals/${dealId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         deal:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const dealId = this.getNodeParameter('dealId', i);
                            endpoint = `/api/3/deals/${dealId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         deals:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'deals';
                            }
                            endpoint = `/api/3/deals`;
                        }
                        else if (operation === 'createNote') {
                            // ----------------------------------
                            //         deal:createNote
                            // ----------------------------------
                            requestMethod = 'POST';
                            body.note = {
                                note: this.getNodeParameter('dealNote', i),
                            };
                            const dealId = this.getNodeParameter('dealId', i);
                            endpoint = `/api/3/deals/${dealId}/notes`;
                        }
                        else if (operation === 'updateNote') {
                            // ----------------------------------
                            //         deal:updateNote
                            // ----------------------------------
                            requestMethod = 'PUT';
                            body.note = {
                                note: this.getNodeParameter('dealNote', i),
                            };
                            const dealId = this.getNodeParameter('dealId', i);
                            const dealNoteId = this.getNodeParameter('dealNoteId', i);
                            endpoint = `/api/3/deals/${dealId}/notes/${dealNoteId}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'connection') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         connection:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/connections';
                            body.connection = {
                                service: this.getNodeParameter('service', i),
                                externalid: this.getNodeParameter('externalid', i),
                                name: this.getNodeParameter('name', i),
                                logoUrl: this.getNodeParameter('logoUrl', i),
                                linkUrl: this.getNodeParameter('linkUrl', i),
                            };
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         connection:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const connectionId = this.getNodeParameter('connectionId', i);
                            endpoint = `/api/3/connections/${connectionId}`;
                            body.connection = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.connection, updateFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         connection:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const connectionId = this.getNodeParameter('connectionId', i);
                            endpoint = `/api/3/connections/${connectionId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         connection:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const connectionId = this.getNodeParameter('connectionId', i);
                            endpoint = `/api/3/connections/${connectionId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         connections:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'connections';
                            }
                            endpoint = `/api/3/connections`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'ecommerceOrder') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         ecommerceOrder:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/ecomOrders';
                            body.ecomOrder = {
                                source: this.getNodeParameter('source', i),
                                email: this.getNodeParameter('email', i),
                                totalPrice: this.getNodeParameter('totalPrice', i),
                                currency: this.getNodeParameter('currency', i).toString().toUpperCase(),
                                externalCreatedDate: this.getNodeParameter('externalCreatedDate', i),
                                connectionid: this.getNodeParameter('connectionid', i),
                                customerid: this.getNodeParameter('customerid', i),
                            };
                            const externalid = this.getNodeParameter('externalid', i);
                            if (externalid !== '') {
                                addAdditionalFields(body.ecomOrder, { externalid });
                            }
                            const externalcheckoutid = this.getNodeParameter('externalcheckoutid', i);
                            if (externalcheckoutid !== '') {
                                addAdditionalFields(body.ecomOrder, { externalcheckoutid });
                            }
                            const abandonedDate = this.getNodeParameter('abandonedDate', i);
                            if (abandonedDate !== '') {
                                addAdditionalFields(body.ecomOrder, { abandonedDate });
                            }
                            const orderProducts = this.getNodeParameter('orderProducts', i);
                            addAdditionalFields(body.ecomOrder, { orderProducts });
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            addAdditionalFields(body.ecomOrder, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         ecommerceOrder:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const orderId = this.getNodeParameter('orderId', i);
                            endpoint = `/api/3/ecomOrders/${orderId}`;
                            body.ecomOrder = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            addAdditionalFields(body.ecomOrder, updateFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         ecommerceOrder:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const orderId = this.getNodeParameter('orderId', i);
                            endpoint = `/api/3/ecomOrders/${orderId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         ecommerceOrder:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const orderId = this.getNodeParameter('orderId', i);
                            endpoint = `/api/3/ecomOrders/${orderId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         ecommerceOrders:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'ecomOrders';
                            }
                            endpoint = `/api/3/ecomOrders`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'ecommerceCustomer') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         ecommerceCustomer:create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = '/api/3/ecomCustomers';
                            body.ecomCustomer = {
                                connectionid: this.getNodeParameter('connectionid', i),
                                externalid: this.getNodeParameter('externalid', i),
                                email: this.getNodeParameter('email', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.acceptsMarketing !== undefined) {
                                if (additionalFields.acceptsMarketing === true) {
                                    additionalFields.acceptsMarketing = '1';
                                }
                                else {
                                    additionalFields.acceptsMarketing = '0';
                                }
                            }
                            addAdditionalFields(body.ecomCustomer, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         ecommerceCustomer:update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const ecommerceCustomerId = this.getNodeParameter('ecommerceCustomerId', i);
                            endpoint = `/api/3/ecomCustomers/${ecommerceCustomerId}`;
                            body.ecomCustomer = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.acceptsMarketing !== undefined) {
                                if (updateFields.acceptsMarketing === true) {
                                    updateFields.acceptsMarketing = '1';
                                }
                                else {
                                    updateFields.acceptsMarketing = '0';
                                }
                            }
                            addAdditionalFields(body.ecomCustomer, updateFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         ecommerceCustomer:delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const ecommerceCustomerId = this.getNodeParameter('ecommerceCustomerId', i);
                            endpoint = `/api/3/ecomCustomers/${ecommerceCustomerId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         ecommerceCustomer:get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const ecommerceCustomerId = this.getNodeParameter('ecommerceCustomerId', i);
                            endpoint = `/api/3/ecomCustomers/${ecommerceCustomerId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         ecommerceCustomers:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'ecomCustomers';
                            }
                            endpoint = `/api/3/ecomCustomers`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else if (resource === 'ecommerceOrderProducts') {
                        if (operation === 'getByProductId') {
                            // ----------------------------------
                            //         ecommerceOrderProducts:getByProductId
                            // ----------------------------------
                            requestMethod = 'GET';
                            const procuctId = this.getNodeParameter('procuctId', i);
                            endpoint = `/api/3/ecomOrderProducts/${procuctId}`;
                        }
                        else if (operation === 'getByOrderId') {
                            // ----------------------------------
                            //         ecommerceOrderProducts:getByOrderId
                            // ----------------------------------
                            requestMethod = 'GET';
                            //dataKey = 'ecomOrderProducts';
                            const orderId = this.getNodeParameter('orderId', i);
                            endpoint = `/api/3/ecomOrders/${orderId}/orderProducts`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         ecommerceOrderProductss:getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const simple = this.getNodeParameter('simple', i, true);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            if (simple === true) {
                                dataKey = 'ecomOrderProducts';
                            }
                            endpoint = `/api/3/ecomOrderProducts`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known`);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                    }
                    let responseData;
                    if (returnAll === true) {
                        responseData = yield GenericFunctions_1.activeCampaignApiRequestAllItems.call(this, requestMethod, endpoint, body, qs, dataKey);
                    }
                    else {
                        responseData = yield GenericFunctions_1.activeCampaignApiRequest.call(this, requestMethod, endpoint, body, qs, dataKey);
                    }
                    if (resource === 'contactList' && operation === 'add' && responseData === undefined) {
                        responseData = { success: true };
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
exports.ActiveCampaign = ActiveCampaign;
