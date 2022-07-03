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
exports.simplifyTransactionReport = exports.adjustTransactionDates = exports.splitPascalCase = exports.toDisplayName = exports.toOptions = exports.populateFields = exports.processLines = exports.loadResource = exports.handleBinaryData = exports.getRefAndSyncToken = exports.getSyncToken = exports.handleListing = exports.quickBooksApiRequestAllItems = exports.quickBooksApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
const lodash_1 = require("lodash");
/**
 * Make an authenticated API request to QuickBooks.
 */
function quickBooksApiRequest(method, endpoint, qs, body, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let isDownload = false;
        if (['estimate', 'invoice', 'payment'].includes(resource) && operation === 'get') {
            isDownload = this.getNodeParameter('download', 0);
        }
        const productionUrl = 'https://quickbooks.api.intuit.com';
        const sandboxUrl = 'https://sandbox-quickbooks.api.intuit.com';
        const credentials = yield this.getCredentials('quickBooksOAuth2Api');
        const options = {
            headers: {
                'user-agent': 'n8n',
            },
            method,
            uri: `${credentials.environment === 'sandbox' ? sandboxUrl : productionUrl}${endpoint}`,
            qs,
            body,
            json: !isDownload,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        if (isDownload) {
            options.headers['Accept'] = 'application/pdf';
        }
        if (resource === 'invoice' && operation === 'send') {
            options.headers['Content-Type'] = 'application/octet-stream';
        }
        if ((resource === 'invoice' && (operation === 'void' || operation === 'delete')) ||
            (resource === 'payment' && (operation === 'void' || operation === 'delete'))) {
            options.headers['Content-Type'] = 'application/json';
        }
        try {
            return yield this.helpers.requestOAuth2.call(this, 'quickBooksOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.quickBooksApiRequest = quickBooksApiRequest;
/**
 * Make an authenticated API request to QuickBooks and return all results.
 */
function quickBooksApiRequestAllItems(method, endpoint, qs, body, resource) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        let startPosition = 1;
        const maxResults = 1000;
        const returnData = [];
        const maxCountQuery = {
            query: `SELECT COUNT(*) FROM ${resource}`,
        };
        const maxCount = yield getCount.call(this, method, endpoint, maxCountQuery);
        const originalQuery = qs.query;
        do {
            qs.query = `${originalQuery} MAXRESULTS ${maxResults} STARTPOSITION ${startPosition}`;
            responseData = yield quickBooksApiRequest.call(this, method, endpoint, qs, body);
            try {
                const nonResource = (_a = originalQuery.split(' ')) === null || _a === void 0 ? void 0 : _a.pop();
                if (nonResource === 'CreditMemo' || nonResource === 'Term' || nonResource === 'TaxCode') {
                    returnData.push(...responseData.QueryResponse[nonResource]);
                }
                else {
                    returnData.push(...responseData.QueryResponse[(0, change_case_1.capitalCase)(resource)]);
                }
            }
            catch (error) {
                return [];
            }
            startPosition += maxResults;
        } while (maxCount > returnData.length);
        return returnData;
    });
}
exports.quickBooksApiRequestAllItems = quickBooksApiRequestAllItems;
function getCount(method, endpoint, qs) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield quickBooksApiRequest.call(this, method, endpoint, qs, {});
        return responseData.QueryResponse.totalCount;
    });
}
/**
 * Handles a QuickBooks listing by returning all items or up to a limit.
 */
function handleListing(i, endpoint, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData;
        const qs = {
            query: `SELECT * FROM ${resource}`,
        };
        const returnAll = this.getNodeParameter('returnAll', i);
        const filters = this.getNodeParameter('filters', i);
        if (filters.query) {
            qs.query += ` ${filters.query}`;
        }
        if (returnAll) {
            return yield quickBooksApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, resource);
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            qs.query += ` MAXRESULTS ${limit}`;
            responseData = yield quickBooksApiRequest.call(this, 'GET', endpoint, qs, {});
            responseData = responseData.QueryResponse[(0, change_case_1.capitalCase)(resource)];
            return responseData;
        }
    });
}
exports.handleListing = handleListing;
/**
 * Get the SyncToken required for delete and void operations in QuickBooks.
 */
function getSyncToken(i, companyId, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceId = this.getNodeParameter(`${resource}Id`, i);
        const getEndpoint = `/v3/company/${companyId}/${resource}/${resourceId}`;
        const propertyName = (0, change_case_1.capitalCase)(resource);
        const { [propertyName]: { SyncToken } } = yield quickBooksApiRequest.call(this, 'GET', getEndpoint, {}, {});
        return SyncToken;
    });
}
exports.getSyncToken = getSyncToken;
/**
 * Get the reference and SyncToken required for update operations in QuickBooks.
 */
function getRefAndSyncToken(i, companyId, resource, ref) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceId = this.getNodeParameter(`${resource}Id`, i);
        const endpoint = `/v3/company/${companyId}/${resource}/${resourceId}`;
        const responseData = yield quickBooksApiRequest.call(this, 'GET', endpoint, {}, {});
        return {
            ref: responseData[(0, change_case_1.capitalCase)(resource)][ref],
            syncToken: responseData[(0, change_case_1.capitalCase)(resource)].SyncToken,
        };
    });
}
exports.getRefAndSyncToken = getRefAndSyncToken;
/**
 * Populate node items with binary data.
 */
function handleBinaryData(items, i, companyId, resource, resourceId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const binaryProperty = this.getNodeParameter('binaryProperty', i);
        const fileName = this.getNodeParameter('fileName', i);
        const endpoint = `/v3/company/${companyId}/${resource}/${resourceId}/pdf`;
        const data = yield quickBooksApiRequest.call(this, 'GET', endpoint, {}, {}, { encoding: null });
        items[i].binary = (_a = items[i].binary) !== null && _a !== void 0 ? _a : {};
        items[i].binary[binaryProperty] = yield this.helpers.prepareBinaryData(data);
        items[i].binary[binaryProperty].fileName = fileName;
        items[i].binary[binaryProperty].fileExtension = 'pdf';
        return items;
    });
}
exports.handleBinaryData = handleBinaryData;
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const qs = {
            query: `SELECT * FROM ${resource}`,
        };
        const { oauthTokenData: { callbackQueryString: { realmId } } } = yield this.getCredentials('quickBooksOAuth2Api');
        const endpoint = `/v3/company/${realmId}/query`;
        const resourceItems = yield quickBooksApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, resource);
        if (resource === 'preferences') {
            const { SalesFormsPrefs: { CustomField } } = resourceItems[0];
            const customFields = CustomField[1].CustomField;
            for (const customField of customFields) {
                const length = customField.Name.length;
                returnData.push({
                    name: customField.StringValue,
                    value: customField.Name.charAt(length - 1),
                });
            }
            return returnData;
        }
        resourceItems.forEach((resourceItem) => {
            returnData.push({
                name: resourceItem.DisplayName || resourceItem.Name || `Memo ${resourceItem.Id}`,
                value: resourceItem.Id,
            });
        });
        return returnData;
    });
}
exports.loadResource = loadResource;
/**
 * Populate the `Line` property in a request body.
 */
function processLines(body, lines, resource) {
    lines.forEach((line) => {
        if (resource === 'bill') {
            if (line.DetailType === 'AccountBasedExpenseLineDetail') {
                line.AccountBasedExpenseLineDetail = {
                    AccountRef: {
                        value: line.accountId,
                    },
                };
                delete line.accountId;
            }
            else if (line.DetailType === 'ItemBasedExpenseLineDetail') {
                line.ItemBasedExpenseLineDetail = {
                    ItemRef: {
                        value: line.itemId,
                    },
                };
                delete line.itemId;
            }
        }
        else if (resource === 'estimate') {
            if (line.DetailType === 'SalesItemLineDetail') {
                line.SalesItemLineDetail = {
                    ItemRef: {
                        value: line.itemId,
                    },
                    TaxCodeRef: {
                        value: line.TaxCodeRef,
                    },
                };
                delete line.itemId;
                delete line.TaxCodeRef;
            }
        }
        else if (resource === 'invoice') {
            if (line.DetailType === 'SalesItemLineDetail') {
                line.SalesItemLineDetail = {
                    ItemRef: {
                        value: line.itemId,
                    },
                    TaxCodeRef: {
                        value: line.TaxCodeRef,
                    },
                };
                delete line.itemId;
                delete line.TaxCodeRef;
            }
        }
    });
    return lines;
}
exports.processLines = processLines;
/**
 * Populate update fields or additional fields into a request body.
 */
function populateFields(body, fields, resource) {
    Object.entries(fields).forEach(([key, value]) => {
        if (resource === 'bill') {
            if (key.endsWith('Ref')) {
                const { details } = value;
                body[key] = {
                    name: details.name,
                    value: details.value,
                };
            }
            else {
                body[key] = value;
            }
        }
        else if (['customer', 'employee', 'vendor'].includes(resource)) {
            if (key === 'BillAddr') {
                const { details } = value;
                body.BillAddr = (0, lodash_1.pickBy)(details, detail => detail !== '');
            }
            else if (key === 'PrimaryEmailAddr') {
                body.PrimaryEmailAddr = {
                    Address: value,
                };
            }
            else if (key === 'PrimaryPhone') {
                body.PrimaryPhone = {
                    FreeFormNumber: value,
                };
            }
            else {
                body[key] = value;
            }
        }
        else if (resource === 'estimate' || resource === 'invoice') {
            if (key === 'BillAddr' || key === 'ShipAddr') {
                const { details } = value;
                body[key] = (0, lodash_1.pickBy)(details, detail => detail !== '');
            }
            else if (key === 'BillEmail') {
                body.BillEmail = {
                    Address: value,
                };
            }
            else if (key === 'CustomFields') {
                const { Field } = value;
                body.CustomField = Field;
                const length = body.CustomField.length;
                for (let i = 0; i < length; i++) {
                    //@ts-ignore
                    body.CustomField[i]['Type'] = 'StringType';
                }
            }
            else if (key === 'CustomerMemo') {
                body.CustomerMemo = {
                    value,
                };
            }
            else if (key.endsWith('Ref')) {
                const { details } = value;
                body[key] = {
                    name: details.name,
                    value: details.value,
                };
            }
            else if (key === 'TotalTax') {
                body.TxnTaxDetail = {
                    TotalTax: value,
                };
            }
            else {
                body[key] = value;
            }
        }
        else if (resource === 'payment') {
            body[key] = value;
        }
    });
    return body;
}
exports.populateFields = populateFields;
const toOptions = (option) => ({ name: option, value: option });
exports.toOptions = toOptions;
const toDisplayName = ({ name, value }) => {
    return { name: (0, exports.splitPascalCase)(name), value };
};
exports.toDisplayName = toDisplayName;
const splitPascalCase = (word) => {
    return word.match(/($[a-z])|[A-Z][^A-Z]+/g).join(' ');
};
exports.splitPascalCase = splitPascalCase;
function adjustTransactionDates(transactionFields) {
    const dateFieldKeys = [
        'dateRangeCustom',
        'dateRangeDueCustom',
        'dateRangeModificationCustom',
        'dateRangeCreationCustom',
    ];
    if (dateFieldKeys.every(dateField => !transactionFields[dateField])) {
        return transactionFields;
    }
    let adjusted = (0, lodash_1.omit)(transactionFields, dateFieldKeys);
    dateFieldKeys.forEach(dateFieldKey => {
        const dateField = transactionFields[dateFieldKey];
        if (dateField) {
            Object.entries(dateField[`${dateFieldKey}Properties`]).map(([key, value]) => dateField[`${dateFieldKey}Properties`][key] = value.split('T')[0]);
            adjusted = Object.assign(Object.assign({}, adjusted), dateField[`${dateFieldKey}Properties`]);
        }
    });
    return adjusted;
}
exports.adjustTransactionDates = adjustTransactionDates;
function simplifyTransactionReport(transactionReport) {
    const columns = transactionReport.Columns.Column.map((column) => column.ColType);
    const rows = transactionReport.Rows.Row.map((row) => row.ColData.map(i => i.value));
    const simplified = [];
    for (const row of rows) {
        const transaction = {};
        for (let i = 0; i < row.length; i++) {
            transaction[columns[i]] = row[i];
        }
        simplified.push(transaction);
    }
    return simplified;
}
exports.simplifyTransactionReport = simplifyTransactionReport;
