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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBooks = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
const lodash_1 = require("lodash");
class QuickBooks {
    constructor() {
        this.description = {
            displayName: 'QuickBooks Online',
            name: 'quickbooks',
            icon: 'file:quickbooks.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the QuickBooks Online API',
            defaults: {
                name: 'QuickBooks Online',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'quickBooksOAuth2Api',
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
                            name: 'Bill',
                            value: 'bill',
                        },
                        {
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Employee',
                            value: 'employee',
                        },
                        {
                            name: 'Estimate',
                            value: 'estimate',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Item',
                            value: 'item',
                        },
                        {
                            name: 'Payment',
                            value: 'payment',
                        },
                        {
                            name: 'Purchase',
                            value: 'purchase',
                        },
                        {
                            name: 'Transaction',
                            value: 'transaction',
                        },
                        {
                            name: 'Vendor',
                            value: 'vendor',
                        },
                    ],
                    default: 'customer',
                },
                ...descriptions_1.billOperations,
                ...descriptions_1.billFields,
                ...descriptions_1.customerOperations,
                ...descriptions_1.customerFields,
                ...descriptions_1.employeeOperations,
                ...descriptions_1.employeeFields,
                ...descriptions_1.estimateOperations,
                ...descriptions_1.estimateFields,
                ...descriptions_1.invoiceOperations,
                ...descriptions_1.invoiceFields,
                ...descriptions_1.itemOperations,
                ...descriptions_1.itemFields,
                ...descriptions_1.paymentOperations,
                ...descriptions_1.paymentFields,
                ...descriptions_1.purchaseOperations,
                ...descriptions_1.purchaseFields,
                ...descriptions_1.transactionOperations,
                ...descriptions_1.transactionFields,
                ...descriptions_1.vendorOperations,
                ...descriptions_1.vendorFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCustomers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'customer');
                    });
                },
                getCustomFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'preferences');
                    });
                },
                getDepartments() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'department');
                    });
                },
                getItems() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'item');
                    });
                },
                getMemos() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'CreditMemo');
                    });
                },
                getPurchases() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'purchase');
                    });
                },
                getTaxCodeRefs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'TaxCode');
                    });
                },
                getTerms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'Term');
                    });
                },
                getVendors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'vendor');
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
            const { oauthTokenData } = yield this.getCredentials('quickBooksOAuth2Api');
            const companyId = oauthTokenData.callbackQueryString.realmId;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'bill') {
                        // *********************************************************************
                        //                            bill
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/bill
                        if (operation === 'create') {
                            // ----------------------------------
                            //         bill: create
                            // ----------------------------------
                            const lines = this.getNodeParameter('Line', i);
                            if (!lines.length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one line for the ${resource}.`);
                            }
                            if (lines.some(line => line.DetailType === undefined || line.Amount === undefined || line.Description === undefined)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter detail type, amount and description for every line.');
                            }
                            lines.forEach(line => {
                                if (line.DetailType === 'AccountBasedExpenseLineDetail' && line.accountId === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter an account ID for the associated line.');
                                }
                                else if (line.DetailType === 'ItemBasedExpenseLineDetail' && line.itemId === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter an item ID for the associated line.');
                                }
                            });
                            let body = {
                                VendorRef: {
                                    value: this.getNodeParameter('VendorRef', i),
                                },
                            };
                            body.Line = GenericFunctions_1.processLines.call(this, body, lines, resource);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         bill: delete
                            // ----------------------------------
                            const qs = {
                                operation: 'delete',
                            };
                            const body = {
                                Id: this.getNodeParameter('billId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         bill: get
                            // ----------------------------------
                            const billId = this.getNodeParameter('billId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${billId}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         bill: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         bill: update
                            // ----------------------------------
                            const { ref, syncToken } = yield GenericFunctions_1.getRefAndSyncToken.call(this, i, companyId, resource, 'VendorRef');
                            let body = {
                                Id: this.getNodeParameter('billId', i),
                                SyncToken: syncToken,
                                sparse: true,
                                VendorRef: {
                                    name: ref.name,
                                    value: ref.value,
                                },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'customer') {
                        // *********************************************************************
                        //                            customer
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/customer
                        if (operation === 'create') {
                            // ----------------------------------
                            //         customer: create
                            // ----------------------------------
                            let body = {
                                DisplayName: this.getNodeParameter('displayName', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         customer: get
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${customerId}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         customer: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         customer: update
                            // ----------------------------------
                            let body = {
                                Id: this.getNodeParameter('customerId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                                sparse: true,
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'employee') {
                        // *********************************************************************
                        //                            employee
                        // *********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //         employee: create
                            // ----------------------------------
                            let body = {
                                FamilyName: this.getNodeParameter('FamilyName', i),
                                GivenName: this.getNodeParameter('GivenName', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         employee: get
                            // ----------------------------------
                            const employeeId = this.getNodeParameter('employeeId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${employeeId}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         employee: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         employee: update
                            // ----------------------------------
                            let body = {
                                Id: this.getNodeParameter('employeeId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                                sparse: true,
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'estimate') {
                        // *********************************************************************
                        //                            estimate
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/estimate
                        if (operation === 'create') {
                            // ----------------------------------
                            //         estimate: create
                            // ----------------------------------
                            const lines = this.getNodeParameter('Line', i);
                            if (!lines.length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one line for the ${resource}.`);
                            }
                            if (lines.some(line => line.DetailType === undefined || line.Amount === undefined || line.Description === undefined)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter detail type, amount and description for every line.');
                            }
                            lines.forEach(line => {
                                if (line.DetailType === 'SalesItemLineDetail' && line.itemId === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter an item ID for the associated line.');
                                }
                            });
                            let body = {
                                CustomerRef: {
                                    value: this.getNodeParameter('CustomerRef', i),
                                },
                            };
                            body.Line = GenericFunctions_1.processLines.call(this, body, lines, resource);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         estimate: delete
                            // ----------------------------------
                            const qs = {
                                operation: 'delete',
                            };
                            const body = {
                                Id: this.getNodeParameter('estimateId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         estimate: get
                            // ----------------------------------
                            const estimateId = this.getNodeParameter('estimateId', i);
                            const download = this.getNodeParameter('download', i);
                            if (download) {
                                responseData = yield GenericFunctions_1.handleBinaryData.call(this, items, i, companyId, resource, estimateId);
                            }
                            else {
                                const endpoint = `/v3/company/${companyId}/${resource}/${estimateId}`;
                                responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                                responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         estimate: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'send') {
                            // ----------------------------------
                            //         estimate: send
                            // ----------------------------------
                            const estimateId = this.getNodeParameter('estimateId', i);
                            const qs = {
                                sendTo: this.getNodeParameter('email', i),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}/${estimateId}/send`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         estimate: update
                            // ----------------------------------
                            const { ref, syncToken } = yield GenericFunctions_1.getRefAndSyncToken.call(this, i, companyId, resource, 'CustomerRef');
                            let body = {
                                Id: this.getNodeParameter('estimateId', i),
                                SyncToken: syncToken,
                                sparse: true,
                                CustomerRef: {
                                    name: ref.name,
                                    value: ref.value,
                                },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'invoice') {
                        // *********************************************************************
                        //                            invoice
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/invoice
                        if (operation === 'create') {
                            // ----------------------------------
                            //         invoice: create
                            // ----------------------------------
                            const lines = this.getNodeParameter('Line', i);
                            if (!lines.length) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one line for the ${resource}.`);
                            }
                            if (lines.some(line => line.DetailType === undefined || line.Amount === undefined || line.Description === undefined)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter detail type, amount and description for every line.');
                            }
                            lines.forEach(line => {
                                if (line.DetailType === 'SalesItemLineDetail' && line.itemId === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter an item ID for the associated line.');
                                }
                            });
                            let body = {
                                CustomerRef: {
                                    value: this.getNodeParameter('CustomerRef', i),
                                },
                            };
                            body.Line = GenericFunctions_1.processLines.call(this, body, lines, resource);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         invoice: delete
                            // ----------------------------------
                            const qs = {
                                operation: 'delete',
                            };
                            const body = {
                                Id: this.getNodeParameter('invoiceId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         invoice: get
                            // ----------------------------------
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            const download = this.getNodeParameter('download', i);
                            if (download) {
                                responseData = yield GenericFunctions_1.handleBinaryData.call(this, items, i, companyId, resource, invoiceId);
                            }
                            else {
                                const endpoint = `/v3/company/${companyId}/${resource}/${invoiceId}`;
                                responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                                responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         invoice: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'send') {
                            // ----------------------------------
                            //         invoice: send
                            // ----------------------------------
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            const qs = {
                                sendTo: this.getNodeParameter('email', i),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}/${invoiceId}/send`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         invoice: update
                            // ----------------------------------
                            const { ref, syncToken } = yield GenericFunctions_1.getRefAndSyncToken.call(this, i, companyId, resource, 'CustomerRef');
                            let body = {
                                Id: this.getNodeParameter('invoiceId', i),
                                SyncToken: syncToken,
                                sparse: true,
                                CustomerRef: {
                                    name: ref.name,
                                    value: ref.value,
                                },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'void') {
                            // ----------------------------------
                            //         invoice: void
                            // ----------------------------------
                            const qs = {
                                Id: this.getNodeParameter('invoiceId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                                operation: 'void',
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'item') {
                        // *********************************************************************
                        //                            item
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/item
                        if (operation === 'get') {
                            // ----------------------------------
                            //         item: get
                            // ----------------------------------
                            const item = this.getNodeParameter('itemId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${item}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         item: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                    }
                    else if (resource === 'payment') {
                        // *********************************************************************
                        //                            payment
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/payment
                        if (operation === 'create') {
                            // ----------------------------------
                            //         payment: create
                            // ----------------------------------
                            let body = {
                                CustomerRef: {
                                    value: this.getNodeParameter('CustomerRef', i),
                                },
                                TotalAmt: this.getNodeParameter('TotalAmt', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         payment: delete
                            // ----------------------------------
                            const qs = {
                                operation: 'delete',
                            };
                            const body = {
                                Id: this.getNodeParameter('paymentId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         payment: get
                            // ----------------------------------
                            const paymentId = this.getNodeParameter('paymentId', i);
                            const download = this.getNodeParameter('download', i);
                            if (download) {
                                responseData = yield GenericFunctions_1.handleBinaryData.call(this, items, i, companyId, resource, paymentId);
                            }
                            else {
                                const endpoint = `/v3/company/${companyId}/${resource}/${paymentId}`;
                                responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                                responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         payment: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'send') {
                            // ----------------------------------
                            //         payment: send
                            // ----------------------------------
                            const paymentId = this.getNodeParameter('paymentId', i);
                            const qs = {
                                sendTo: this.getNodeParameter('email', i),
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}/${paymentId}/send`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         payment: update
                            // ----------------------------------
                            const { ref, syncToken } = yield GenericFunctions_1.getRefAndSyncToken.call(this, i, companyId, resource, 'CustomerRef');
                            let body = {
                                Id: this.getNodeParameter('paymentId', i),
                                SyncToken: syncToken,
                                sparse: true,
                                CustomerRef: {
                                    name: ref.name,
                                    value: ref.value,
                                },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'void') {
                            // ----------------------------------
                            //         payment: void
                            // ----------------------------------
                            const qs = {
                                Id: this.getNodeParameter('paymentId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                                operation: 'void',
                            };
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                    else if (resource === 'purchase') {
                        // *********************************************************************
                        //                            purchase
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase
                        if (operation === 'get') {
                            // ----------------------------------
                            //         purchase: get
                            // ----------------------------------
                            const purchaseId = this.getNodeParameter('purchaseId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${purchaseId}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         purchase: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                    }
                    else if (resource === 'transaction') {
                        // *********************************************************************
                        //                            transaction
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlist
                        if (operation === 'getReport') {
                            // ----------------------------------
                            //        transaction: getReport
                            // ----------------------------------
                            const _a = this.getNodeParameter('filters', i), { columns, memo, term, customer, vendor } = _a, rest = __rest(_a, ["columns", "memo", "term", "customer", "vendor"]);
                            let qs = Object.assign({}, rest);
                            if (columns === null || columns === void 0 ? void 0 : columns.length) {
                                qs.columns = columns.join(',');
                            }
                            if (memo === null || memo === void 0 ? void 0 : memo.length) {
                                qs.memo = memo.join(',');
                            }
                            if (term === null || term === void 0 ? void 0 : term.length) {
                                qs.term = term.join(',');
                            }
                            if (customer === null || customer === void 0 ? void 0 : customer.length) {
                                qs.customer = customer.join(',');
                            }
                            if (vendor === null || vendor === void 0 ? void 0 : vendor.length) {
                                qs.vendor = vendor.join(',');
                            }
                            qs = (0, GenericFunctions_1.adjustTransactionDates)(qs);
                            const endpoint = `/v3/company/${companyId}/reports/TransactionList`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, qs, {});
                            const simplifyResponse = this.getNodeParameter('simple', i, true);
                            if (!Object.keys(responseData === null || responseData === void 0 ? void 0 : responseData.Rows).length) {
                                responseData = [];
                            }
                            if (simplifyResponse && !Array.isArray(responseData)) {
                                responseData = (0, GenericFunctions_1.simplifyTransactionReport)(responseData);
                            }
                        }
                    }
                    else if (resource === 'vendor') {
                        // *********************************************************************
                        //                            vendor
                        // *********************************************************************
                        // https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/vendor
                        if (operation === 'create') {
                            // ----------------------------------
                            //         vendor: create
                            // ----------------------------------
                            let body = {
                                DisplayName: this.getNodeParameter('displayName', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            body = GenericFunctions_1.populateFields.call(this, body, additionalFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         vendor: get
                            // ----------------------------------
                            const vendorId = this.getNodeParameter('vendorId', i);
                            const endpoint = `/v3/company/${companyId}/${resource}/${vendorId}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         vendor: getAll
                            // ----------------------------------
                            const endpoint = `/v3/company/${companyId}/query`;
                            responseData = yield GenericFunctions_1.handleListing.call(this, i, endpoint, resource);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         vendor: update
                            // ----------------------------------
                            let body = {
                                Id: this.getNodeParameter('vendorId', i),
                                SyncToken: yield GenericFunctions_1.getSyncToken.call(this, i, companyId, resource),
                                sparse: true,
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            body = GenericFunctions_1.populateFields.call(this, body, updateFields, resource);
                            const endpoint = `/v3/company/${companyId}/${resource}`;
                            responseData = yield GenericFunctions_1.quickBooksApiRequest.call(this, 'POST', endpoint, {}, body);
                            responseData = responseData[(0, change_case_1.capitalCase)(resource)];
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        const download = this.getNodeParameter('download', 0, false);
                        if (['invoice', 'estimate', 'payment'].includes(resource) && ['get'].includes(operation) && download) {
                            // in this case responseDate? === items
                            if (!responseData) {
                                items[i].json = { error: error.message };
                                responseData = items;
                            }
                            else {
                                responseData[i].json = { error: error.message };
                            }
                        }
                        else {
                            returnData.push({ error: error.message });
                        }
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            const download = this.getNodeParameter('download', 0, false);
            if (['invoice', 'estimate', 'payment'].includes(resource) && ['get'].includes(operation) && download) {
                return this.prepareOutputData(responseData);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.QuickBooks = QuickBooks;
