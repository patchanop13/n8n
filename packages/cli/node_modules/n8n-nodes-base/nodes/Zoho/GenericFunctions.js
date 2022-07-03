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
exports.capitalizeInitial = exports.addGetAllFilterOptions = exports.getPicklistOptions = exports.getModuleName = exports.getFields = exports.toLoadOptions = exports.adjustProductPayload = exports.adjustVendorPayload = exports.adjustSalesOrderPayload = exports.adjustQuotePayload = exports.adjustPurchaseOrderPayload = exports.adjustLeadPayload = exports.adjustInvoicePayloadOnUpdate = exports.adjustInvoicePayload = exports.adjustDealPayload = exports.adjustContactPayload = exports.adjustAccountPayload = exports.adjustProductDetailsOnUpdate = exports.adjustProductDetails = exports.throwOnErrorStatus = exports.throwOnMissingProducts = exports.throwOnEmptyUpdate = exports.handleListing = exports.zohoApiRequestAllItems = exports.zohoApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function zohoApiRequest(method, endpoint, body = {}, qs = {}, uri) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('zohoOAuth2Api');
        const options = {
            body: {
                data: [
                    body,
                ],
            },
            method,
            qs,
            uri: uri !== null && uri !== void 0 ? uri : `${oauthTokenData.api_domain}/crm/v2${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            const responseData = yield ((_a = this.helpers.requestOAuth2) === null || _a === void 0 ? void 0 : _a.call(this, 'zohoOAuth2Api', options));
            if (responseData === undefined)
                return [];
            throwOnErrorStatus.call(this, responseData);
            return responseData;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.zohoApiRequest = zohoApiRequest;
/**
 * Make an authenticated API request to Zoho CRM API and return all items.
 */
function zohoApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        qs.per_page = 200;
        qs.page = 1;
        do {
            responseData = yield zohoApiRequest.call(this, method, endpoint, body, qs);
            if (Array.isArray(responseData) && !responseData.length)
                return returnData;
            returnData.push(...responseData.data);
            qs.page++;
        } while (responseData.info.more_records !== undefined &&
            responseData.info.more_records === true);
        return returnData;
    });
}
exports.zohoApiRequestAllItems = zohoApiRequestAllItems;
/**
 * Handle a Zoho CRM API listing by returning all items or up to a limit.
 */
function handleListing(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (returnAll) {
            return yield zohoApiRequestAllItems.call(this, method, endpoint, body, qs);
        }
        const responseData = yield zohoApiRequestAllItems.call(this, method, endpoint, body, qs);
        const limit = this.getNodeParameter('limit', 0);
        return responseData.slice(0, limit);
    });
}
exports.handleListing = handleListing;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
function throwOnMissingProducts(resource, productDetails) {
    if (!productDetails.length) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one product for the ${resource}.`);
    }
}
exports.throwOnMissingProducts = throwOnMissingProducts;
function throwOnErrorStatus(responseData) {
    var _a;
    if (((_a = responseData === null || responseData === void 0 ? void 0 : responseData.data) === null || _a === void 0 ? void 0 : _a[0].status) === 'error') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), responseData);
    }
}
exports.throwOnErrorStatus = throwOnErrorStatus;
// ----------------------------------------
//        required field adjusters
// ----------------------------------------
/**
 * Place a product ID at a nested position in a product details field.
 */
const adjustProductDetails = (productDetails) => {
    return productDetails.map(p => {
        return Object.assign(Object.assign({}, omit('product', p)), { product: { id: p.id }, quantity: p.quantity || 1 });
    });
};
exports.adjustProductDetails = adjustProductDetails;
// ----------------------------------------
//        additional field adjusters
// ----------------------------------------
/**
 * Place a product ID at a nested position in a product details field.
 *
 * Only for updating products from Invoice, Purchase Order, Quote, and Sales Order.
 */
const adjustProductDetailsOnUpdate = (allFields) => {
    if (!allFields.Product_Details)
        return allFields;
    return allFields.Product_Details.map(p => {
        return Object.assign(Object.assign({}, omit('product', p)), { product: { id: p.id }, quantity: p.quantity || 1 });
    });
};
exports.adjustProductDetailsOnUpdate = adjustProductDetailsOnUpdate;
/**
 * Place a location field's contents at the top level of the payload.
 */
const adjustLocationFields = (locationType) => (allFields) => {
    const locationField = allFields[locationType];
    if (!locationField)
        return allFields;
    return Object.assign(Object.assign({}, omit(locationType, allFields)), locationField.address_fields);
};
const adjustAddressFields = adjustLocationFields('Address');
const adjustBillingAddressFields = adjustLocationFields('Billing_Address');
const adjustMailingAddressFields = adjustLocationFields('Mailing_Address');
const adjustShippingAddressFields = adjustLocationFields('Shipping_Address');
const adjustOtherAddressFields = adjustLocationFields('Other_Address');
/**
 * Remove from a date field the timestamp set by the datepicker.
 */
const adjustDateField = (dateType) => (allFields) => {
    const dateField = allFields[dateType];
    if (!dateField)
        return allFields;
    allFields[dateType] = dateField.split('T')[0];
    return allFields;
};
const adjustDateOfBirthField = adjustDateField('Date_of_Birth');
const adjustClosingDateField = adjustDateField('Closing_Date');
const adjustInvoiceDateField = adjustDateField('Invoice_Date');
const adjustDueDateField = adjustDateField('Due_Date');
const adjustPurchaseOrderDateField = adjustDateField('PO_Date');
const adjustValidTillField = adjustDateField('Valid_Till');
/**
 * Place an ID field's value nested inside the payload.
 */
const adjustIdField = (idType, nameProperty) => (allFields) => {
    const idValue = allFields[idType];
    if (!idValue)
        return allFields;
    return Object.assign(Object.assign({}, omit(idType, allFields)), { [nameProperty]: { id: idValue } });
};
const adjustAccountIdField = adjustIdField('accountId', 'Account_Name');
const adjustContactIdField = adjustIdField('contactId', 'Full_Name');
const adjustDealIdField = adjustIdField('dealId', 'Deal_Name');
const adjustCustomFields = (allFields) => {
    const { customFields } = allFields, rest = __rest(allFields, ["customFields"]);
    if (!(customFields === null || customFields === void 0 ? void 0 : customFields.customFields.length))
        return allFields;
    return customFields.customFields.reduce((acc, cur) => {
        acc[cur.fieldId] = cur.value;
        return acc;
    }, rest);
};
// ----------------------------------------
//           payload adjusters
// ----------------------------------------
exports.adjustAccountPayload = (0, lodash_1.flow)(adjustBillingAddressFields, adjustShippingAddressFields, adjustCustomFields);
exports.adjustContactPayload = (0, lodash_1.flow)(adjustMailingAddressFields, adjustOtherAddressFields, adjustDateOfBirthField, adjustCustomFields);
exports.adjustDealPayload = (0, lodash_1.flow)(adjustClosingDateField, adjustCustomFields);
exports.adjustInvoicePayload = (0, lodash_1.flow)(adjustBillingAddressFields, adjustShippingAddressFields, adjustInvoiceDateField, adjustDueDateField, adjustAccountIdField, adjustCustomFields);
exports.adjustInvoicePayloadOnUpdate = (0, lodash_1.flow)(exports.adjustInvoicePayload, exports.adjustProductDetailsOnUpdate);
exports.adjustLeadPayload = (0, lodash_1.flow)(adjustAddressFields, adjustCustomFields);
exports.adjustPurchaseOrderPayload = (0, lodash_1.flow)(adjustBillingAddressFields, adjustShippingAddressFields, adjustDueDateField, adjustPurchaseOrderDateField, adjustCustomFields);
exports.adjustQuotePayload = (0, lodash_1.flow)(adjustBillingAddressFields, adjustShippingAddressFields, adjustValidTillField, adjustCustomFields);
exports.adjustSalesOrderPayload = (0, lodash_1.flow)(adjustBillingAddressFields, adjustShippingAddressFields, adjustDueDateField, adjustAccountIdField, adjustContactIdField, adjustDealIdField, adjustCustomFields);
exports.adjustVendorPayload = (0, lodash_1.flow)(adjustAddressFields, adjustCustomFields);
exports.adjustProductPayload = adjustCustomFields;
// ----------------------------------------
//               helpers
// ----------------------------------------
/**
 * Create a copy of an object without a specific property.
 */
const omit = (propertyToOmit, _a) => {
    var _b = propertyToOmit, _ = _a[_b], remainingObject = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return remainingObject;
};
/**
 * Convert items in a Zoho CRM API response into n8n load options.
 */
const toLoadOptions = (items, nameProperty) => items.map((item) => ({ name: item[nameProperty], value: item.id }));
exports.toLoadOptions = toLoadOptions;
/**
 * Retrieve all fields for a resource, sorted alphabetically.
 */
function getFields(resource, { onlyCustom } = { onlyCustom: false }) {
    return __awaiter(this, void 0, void 0, function* () {
        const qs = { module: getModuleName(resource) };
        let { fields } = yield zohoApiRequest.call(this, 'GET', '/settings/fields', {}, qs);
        if (onlyCustom) {
            fields = fields.filter(({ custom_field }) => custom_field);
        }
        const options = fields.map(({ field_label, api_name }) => ({ name: field_label, value: api_name }));
        return (0, lodash_1.sortBy)(options, o => o.name);
    });
}
exports.getFields = getFields;
function getModuleName(resource) {
    const map = {
        account: 'Accounts',
        contact: 'Contacts',
        deal: 'Deals',
        invoice: 'Invoices',
        lead: 'Leads',
        product: 'Products',
        purchaseOrder: 'Purchase_Orders',
        salesOrder: 'Sales_Orders',
        vendor: 'Vendors',
        quote: 'Quotes',
    };
    return map[resource];
}
exports.getModuleName = getModuleName;
function getPicklistOptions(resource, targetField) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const qs = { module: getModuleName(resource) };
        const responseData = yield zohoApiRequest.call(this, 'GET', '/settings/layouts', {}, qs);
        const pickListOptions = (_b = (_a = responseData.layouts[0]
            .sections.find(section => section.api_name === getSectionApiName(resource))) === null || _a === void 0 ? void 0 : _a.fields.find(f => f.api_name === targetField)) === null || _b === void 0 ? void 0 : _b.pick_list_values;
        if (!pickListOptions)
            return [];
        return pickListOptions.map((option) => ({ name: option.display_value, value: option.actual_value }));
    });
}
exports.getPicklistOptions = getPicklistOptions;
function getSectionApiName(resource) {
    if (resource === 'purchaseOrder')
        return 'Purchase Order Information';
    if (resource === 'salesOrder')
        return 'Sales Order Information';
    return `${(0, exports.capitalizeInitial)(resource)} Information`;
}
/**
 * Add filter options to a query string object.
 */
const addGetAllFilterOptions = (qs, options) => {
    if (Object.keys(options).length) {
        const { fields } = options, rest = __rest(options, ["fields"]);
        Object.assign(qs, fields && { fields: fields.join(',') }, rest);
    }
};
exports.addGetAllFilterOptions = addGetAllFilterOptions;
const capitalizeInitial = (str) => str[0].toUpperCase() + str.slice(1);
exports.capitalizeInitial = capitalizeInitial;
