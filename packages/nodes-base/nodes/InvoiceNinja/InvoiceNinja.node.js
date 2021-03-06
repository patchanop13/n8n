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
exports.InvoiceNinja = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ClientDescription_1 = require("./ClientDescription");
const InvoiceDescription_1 = require("./InvoiceDescription");
const ISOCountryCodes_1 = require("./ISOCountryCodes");
const TaskDescription_1 = require("./TaskDescription");
const PaymentDescription_1 = require("./PaymentDescription");
const ExpenseDescription_1 = require("./ExpenseDescription");
const QuoteDescription_1 = require("./QuoteDescription");
class InvoiceNinja {
    constructor() {
        this.description = {
            displayName: 'Invoice Ninja',
            name: 'invoiceNinja',
            icon: 'file:invoiceNinja.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Invoice Ninja API',
            defaults: {
                name: 'Invoice Ninja',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'invoiceNinjaApi',
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
                            name: 'Client',
                            value: 'client',
                        },
                        {
                            name: 'Expense',
                            value: 'expense',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Payment',
                            value: 'payment',
                        },
                        {
                            name: 'Quote',
                            value: 'quote',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    default: 'client',
                },
                ...ClientDescription_1.clientOperations,
                ...ClientDescription_1.clientFields,
                ...InvoiceDescription_1.invoiceOperations,
                ...InvoiceDescription_1.invoiceFields,
                ...TaskDescription_1.taskOperations,
                ...TaskDescription_1.taskFields,
                ...PaymentDescription_1.paymentOperations,
                ...PaymentDescription_1.paymentFields,
                ...ExpenseDescription_1.expenseOperations,
                ...ExpenseDescription_1.expenseFields,
                ...QuoteDescription_1.quoteOperations,
                ...QuoteDescription_1.quoteFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available clients to display them to user so that he can
                // select them easily
                getClients() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const clients = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/clients');
                        for (const client of clients) {
                            const clientName = client.display_name;
                            const clientId = client.id;
                            returnData.push({
                                name: clientName,
                                value: clientId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available projects to display them to user so that he can
                // select them easily
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const projects = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/projects');
                        for (const project of projects) {
                            const projectName = project.name;
                            const projectId = project.id;
                            returnData.push({
                                name: projectName,
                                value: projectId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available invoices to display them to user so that he can
                // select them easily
                getInvoices() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const invoices = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/invoices');
                        for (const invoice of invoices) {
                            const invoiceName = invoice.invoice_number;
                            const invoiceId = invoice.id;
                            returnData.push({
                                name: invoiceName,
                                value: invoiceId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available country codes to display them to user so that he can
                // select them easily
                getCountryCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (let i = 0; i < ISOCountryCodes_1.countryCodes.length; i++) {
                            const countryName = ISOCountryCodes_1.countryCodes[i].name;
                            const countryId = ISOCountryCodes_1.countryCodes[i].numeric;
                            returnData.push({
                                name: countryName,
                                value: countryId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available vendors to display them to user so that he can
                // select them easily
                getVendors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const vendors = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/vendors');
                        for (const vendor of vendors) {
                            const vendorName = vendor.name;
                            const vendorId = vendor.id;
                            returnData.push({
                                name: vendorName,
                                value: vendorId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available expense categories to display them to user so that he can
                // select them easily
                getExpenseCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const categories = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/expense_categories');
                        for (const category of categories) {
                            const categoryName = category.name;
                            const categoryId = category.id;
                            returnData.push({
                                name: categoryName,
                                value: categoryId,
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
            let responseData;
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                //Routes: https://github.com/invoiceninja/invoiceninja/blob/ff455c8ed9fd0c0326956175ecd509efa8bad263/routes/api.php
                try {
                    if (resource === 'client') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.clientName) {
                                body.name = additionalFields.clientName;
                            }
                            if (additionalFields.clientName) {
                                body.name = additionalFields.clientName;
                            }
                            if (additionalFields.idNumber) {
                                body.id_number = additionalFields.idNumber;
                            }
                            if (additionalFields.idNumber) {
                                body.id_number = additionalFields.idNumber;
                            }
                            if (additionalFields.privateNotes) {
                                body.private_notes = additionalFields.privateNotes;
                            }
                            if (additionalFields.vatNumber) {
                                body.vat_number = additionalFields.vatNumber;
                            }
                            if (additionalFields.workPhone) {
                                body.work_phone = additionalFields.workPhone;
                            }
                            if (additionalFields.website) {
                                body.website = additionalFields.website;
                            }
                            const contactsValues = this.getNodeParameter('contactsUi', i).contacstValues;
                            if (contactsValues) {
                                const contacts = [];
                                for (const contactValue of contactsValues) {
                                    const contact = {
                                        first_name: contactValue.firstName,
                                        last_name: contactValue.lastName,
                                        email: contactValue.email,
                                        phone: contactValue.phone,
                                    };
                                    contacts.push(contact);
                                }
                                body.contacts = contacts;
                            }
                            const shippingAddressValue = this.getNodeParameter('shippingAddressUi', i).shippingAddressValue;
                            if (shippingAddressValue) {
                                body.shipping_address1 = shippingAddressValue.streetAddress;
                                body.shipping_address2 = shippingAddressValue.aptSuite;
                                body.shipping_city = shippingAddressValue.city;
                                body.shipping_state = shippingAddressValue.state;
                                body.shipping_postal_code = shippingAddressValue.postalCode;
                                body.shipping_country_id = parseInt(shippingAddressValue.countryCode, 10);
                            }
                            const billingAddressValue = this.getNodeParameter('billingAddressUi', i).billingAddressValue;
                            if (billingAddressValue) {
                                body.address1 = billingAddressValue.streetAddress;
                                body.address2 = billingAddressValue.aptSuite;
                                body.city = billingAddressValue.city;
                                body.state = billingAddressValue.state;
                                body.postal_code = billingAddressValue.postalCode;
                                body.country_id = parseInt(billingAddressValue.countryCode, 10);
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/clients', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'get') {
                            const clientId = this.getNodeParameter('clientId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/clients/${clientId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/clients', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/clients', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const clientId = this.getNodeParameter('clientId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/clients/${clientId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'invoice') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.email) {
                                body.email = additionalFields.email;
                            }
                            if (additionalFields.client) {
                                body.client_id = additionalFields.client;
                            }
                            if (additionalFields.autoBill) {
                                body.auto_bill = additionalFields.autoBill;
                            }
                            if (additionalFields.customValue1) {
                                body.custom_value1 = additionalFields.customValue1;
                            }
                            if (additionalFields.customValue2) {
                                body.custom_value2 = additionalFields.customValue2;
                            }
                            if (additionalFields.dueDate) {
                                body.due_date = additionalFields.dueDate;
                            }
                            if (additionalFields.invoiceDate) {
                                body.invoice_date = additionalFields.invoiceDate;
                            }
                            if (additionalFields.invoiceNumber) {
                                body.invoice_number = additionalFields.invoiceNumber;
                            }
                            if (additionalFields.invoiceStatus) {
                                body.invoice_status_id = additionalFields.invoiceStatus;
                            }
                            if (additionalFields.isAmountDiscount) {
                                body.is_amount_discount = additionalFields.isAmountDiscount;
                            }
                            if (additionalFields.partial) {
                                body.partial = additionalFields.partial;
                            }
                            if (additionalFields.partialDueDate) {
                                body.partial_due_date = additionalFields.partialDueDate;
                            }
                            if (additionalFields.poNumber) {
                                body.po_number = additionalFields.poNumber;
                            }
                            if (additionalFields.privateNotes) {
                                body.private_notes = additionalFields.privateNotes;
                            }
                            if (additionalFields.publicNotes) {
                                body.public_notes = additionalFields.publicNotes;
                            }
                            if (additionalFields.taxName1) {
                                body.tax_name1 = additionalFields.taxName1;
                            }
                            if (additionalFields.taxName2) {
                                body.tax_name2 = additionalFields.taxName2;
                            }
                            if (additionalFields.taxtRate1) {
                                body.tax_rate1 = additionalFields.taxtRate1;
                            }
                            if (additionalFields.taxtRate2) {
                                body.tax_rate2 = additionalFields.taxtRate2;
                            }
                            if (additionalFields.discount) {
                                body.discount = additionalFields.discount;
                            }
                            if (additionalFields.paid) {
                                body.paid = additionalFields.paid;
                            }
                            if (additionalFields.emailInvoice) {
                                body.email_invoice = additionalFields.emailInvoice;
                            }
                            const invoceItemsValues = this.getNodeParameter('invoiceItemsUi', i).invoiceItemsValues;
                            if (invoceItemsValues) {
                                const items = [];
                                for (const itemValue of invoceItemsValues) {
                                    const item = {
                                        cost: itemValue.cost,
                                        notes: itemValue.description,
                                        product_key: itemValue.service,
                                        qty: itemValue.hours,
                                        tax_rate1: itemValue.taxRate1,
                                        tax_rate2: itemValue.taxRate2,
                                        tax_name1: itemValue.taxName1,
                                        tax_name2: itemValue.taxName2,
                                    };
                                    items.push(item);
                                }
                                body.invoice_items = items;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/invoices', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'email') {
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/email_invoice', { id: invoiceId });
                        }
                        if (operation === 'get') {
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/invoices/${invoiceId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            if (options.invoiceNumber) {
                                qs.invoice_number = options.invoiceNumber;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/invoices', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/invoices', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const invoiceId = this.getNodeParameter('invoiceId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/invoices/${invoiceId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'task') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.client) {
                                body.client_id = additionalFields.client;
                            }
                            if (additionalFields.project) {
                                body.project_id = additionalFields.project;
                            }
                            if (additionalFields.customValue1) {
                                body.custom_value1 = additionalFields.customValue1;
                            }
                            if (additionalFields.customValue2) {
                                body.custom_value2 = additionalFields.customValue2;
                            }
                            if (additionalFields.description) {
                                body.description = additionalFields.description;
                            }
                            const timeLogsValues = this.getNodeParameter('timeLogsUi', i).timeLogsValues;
                            if (timeLogsValues) {
                                const logs = [];
                                for (const logValue of timeLogsValues) {
                                    let from = 0, to;
                                    if (logValue.startDate) {
                                        from = new Date(logValue.startDate).getTime() / 1000;
                                    }
                                    if (logValue.endDate) {
                                        to = new Date(logValue.endDate).getTime() / 1000;
                                    }
                                    if (logValue.duration) {
                                        to = from + (logValue.duration * 3600);
                                    }
                                    logs.push([from, to]);
                                }
                                body.time_log = JSON.stringify(logs);
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/tasks', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'get') {
                            const taskId = this.getNodeParameter('taskId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/tasks/${taskId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/tasks', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/tasks', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'payment') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const invoice = this.getNodeParameter('invoice', i);
                            const amount = this.getNodeParameter('amount', i);
                            const body = {
                                invoice_id: invoice,
                                amount,
                            };
                            if (additionalFields.paymentType) {
                                body.payment_type_id = additionalFields.paymentType;
                            }
                            if (additionalFields.transferReference) {
                                body.transaction_reference = additionalFields.transferReference;
                            }
                            if (additionalFields.privateNotes) {
                                body.private_notes = additionalFields.privateNotes;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/payments', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'get') {
                            const paymentId = this.getNodeParameter('paymentId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/payments/${paymentId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/payments', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/payments', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const paymentId = this.getNodeParameter('paymentId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/payments/${paymentId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'expense') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {};
                            if (additionalFields.amount) {
                                body.amount = additionalFields.amount;
                            }
                            if (additionalFields.billable) {
                                body.should_be_invoiced = additionalFields.billable;
                            }
                            if (additionalFields.client) {
                                body.client_id = additionalFields.client;
                            }
                            if (additionalFields.customValue1) {
                                body.custom_value1 = additionalFields.customValue1;
                            }
                            if (additionalFields.customValue2) {
                                body.custom_value2 = additionalFields.customValue2;
                            }
                            if (additionalFields.category) {
                                body.expense_category_id = additionalFields.category;
                            }
                            if (additionalFields.expenseDate) {
                                body.expense_date = additionalFields.expenseDate;
                            }
                            if (additionalFields.paymentDate) {
                                body.payment_date = additionalFields.paymentDate;
                            }
                            if (additionalFields.paymentType) {
                                body.payment_type_id = additionalFields.paymentType;
                            }
                            if (additionalFields.publicNotes) {
                                body.public_notes = additionalFields.publicNotes;
                            }
                            if (additionalFields.privateNotes) {
                                body.private_notes = additionalFields.privateNotes;
                            }
                            if (additionalFields.taxName1) {
                                body.tax_name1 = additionalFields.taxName1;
                            }
                            if (additionalFields.taxName2) {
                                body.tax_name2 = additionalFields.taxName2;
                            }
                            if (additionalFields.taxRate1) {
                                body.tax_rate1 = additionalFields.taxRate1;
                            }
                            if (additionalFields.taxRate2) {
                                body.tax_rate2 = additionalFields.taxRate2;
                            }
                            if (additionalFields.transactionReference) {
                                body.transaction_reference = additionalFields.transactionReference;
                            }
                            if (additionalFields.vendor) {
                                body.vendor_id = additionalFields.vendor;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/expenses', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'get') {
                            const expenseId = this.getNodeParameter('expenseId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/expenses/${expenseId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/expenses', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/expenses', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const expenseId = this.getNodeParameter('expenseId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/expenses/${expenseId}`);
                            responseData = responseData.data;
                        }
                    }
                    if (resource === 'quote') {
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                is_quote: true,
                            };
                            if (additionalFields.client) {
                                body.client_id = additionalFields.client;
                            }
                            if (additionalFields.email) {
                                body.email = additionalFields.email;
                            }
                            if (additionalFields.autoBill) {
                                body.auto_bill = additionalFields.autoBill;
                            }
                            if (additionalFields.customValue1) {
                                body.custom_value1 = additionalFields.customValue1;
                            }
                            if (additionalFields.customValue2) {
                                body.custom_value2 = additionalFields.customValue2;
                            }
                            if (additionalFields.dueDate) {
                                body.due_date = additionalFields.dueDate;
                            }
                            if (additionalFields.quouteDate) {
                                body.invoice_date = additionalFields.quouteDate;
                            }
                            if (additionalFields.quoteNumber) {
                                body.invoice_number = additionalFields.quoteNumber;
                            }
                            if (additionalFields.invoiceStatus) {
                                body.invoice_status_id = additionalFields.invoiceStatus;
                            }
                            if (additionalFields.isAmountDiscount) {
                                body.is_amount_discount = additionalFields.isAmountDiscount;
                            }
                            if (additionalFields.partial) {
                                body.partial = additionalFields.partial;
                            }
                            if (additionalFields.partialDueDate) {
                                body.partial_due_date = additionalFields.partialDueDate;
                            }
                            if (additionalFields.poNumber) {
                                body.po_number = additionalFields.poNumber;
                            }
                            if (additionalFields.privateNotes) {
                                body.private_notes = additionalFields.privateNotes;
                            }
                            if (additionalFields.publicNotes) {
                                body.public_notes = additionalFields.publicNotes;
                            }
                            if (additionalFields.taxName1) {
                                body.tax_name1 = additionalFields.taxName1;
                            }
                            if (additionalFields.taxName2) {
                                body.tax_name2 = additionalFields.taxName2;
                            }
                            if (additionalFields.taxtRate1) {
                                body.tax_rate1 = additionalFields.taxtRate1;
                            }
                            if (additionalFields.taxtRate2) {
                                body.tax_rate2 = additionalFields.taxtRate2;
                            }
                            if (additionalFields.discount) {
                                body.discount = additionalFields.discount;
                            }
                            if (additionalFields.paid) {
                                body.paid = additionalFields.paid;
                            }
                            if (additionalFields.emailQuote) {
                                body.email_invoice = additionalFields.emailQuote;
                            }
                            const invoceItemsValues = this.getNodeParameter('invoiceItemsUi', i).invoiceItemsValues;
                            if (invoceItemsValues) {
                                const items = [];
                                for (const itemValue of invoceItemsValues) {
                                    const item = {
                                        cost: itemValue.cost,
                                        notes: itemValue.description,
                                        product_key: itemValue.service,
                                        qty: itemValue.hours,
                                        tax_rate1: itemValue.taxRate1,
                                        tax_rate2: itemValue.taxRate2,
                                        tax_name1: itemValue.taxName1,
                                        tax_name2: itemValue.taxName2,
                                    };
                                    items.push(item);
                                }
                                body.invoice_items = items;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/invoices', body);
                            responseData = responseData.data;
                        }
                        if (operation === 'email') {
                            const quoteId = this.getNodeParameter('quoteId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'POST', '/email_invoice', { id: quoteId });
                        }
                        if (operation === 'get') {
                            const quoteId = this.getNodeParameter('quoteId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', `/invoices/${quoteId}`, {}, qs);
                            responseData = responseData.data;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', i);
                            if (options.include) {
                                qs.include = options.include;
                            }
                            if (options.invoiceNumber) {
                                qs.invoice_number = options.invoiceNumber;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequestAllItems.call(this, 'data', 'GET', '/quotes', {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'GET', '/quotes', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                        if (operation === 'delete') {
                            const quoteId = this.getNodeParameter('quoteId', i);
                            responseData = yield GenericFunctions_1.invoiceNinjaApiRequest.call(this, 'DELETE', `/invoices/${quoteId}`);
                            responseData = responseData.data;
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
exports.InvoiceNinja = InvoiceNinja;
