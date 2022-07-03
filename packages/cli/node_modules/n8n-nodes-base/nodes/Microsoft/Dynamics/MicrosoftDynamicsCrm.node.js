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
exports.MicrosoftDynamicsCrm = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class MicrosoftDynamicsCrm {
    constructor() {
        this.description = {
            displayName: 'Microsoft Dynamics CRM',
            name: 'microsoftDynamicsCrm',
            icon: 'file:dynamicsCrm.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Microsoft Dynamics CRM API',
            defaults: {
                name: 'Microsoft Dynamics CRM',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftDynamicsOAuth2Api',
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
                            name: 'Account',
                            value: 'account',
                        },
                    ],
                    default: 'account',
                },
                ...descriptions_1.accountOperations,
                ...descriptions_1.accountFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getAccountCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'accountcategorycode');
                    });
                },
                getAccountRatingCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'accountratingcode');
                    });
                },
                getAddressTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'address1_addresstypecode');
                    });
                },
                getBusinessTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'businesstypecode');
                    });
                },
                getCustomerSizeCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'customersizecode');
                    });
                },
                getCustomerTypeCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'customertypecode');
                    });
                },
                getIndustryCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'industrycode');
                    });
                },
                getPaymentTermsCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'paymenttermscode');
                    });
                },
                getPreferredAppointmentDayCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredappointmentdaycode');
                    });
                },
                getPreferredAppointmentTimeCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredappointmenttimecode');
                    });
                },
                getPreferredContactMethodCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredcontactmethodcode');
                    });
                },
                getShippingMethodCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'shippingmethodcode');
                    });
                },
                getTerritoryCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.getPicklistOptions.call(this, 'account', 'territorycode');
                    });
                },
                getAccountFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const fields = yield GenericFunctions_1.getEntityFields.call(this, 'account');
                        const isSelectable = (field) => (field.IsValidForRead && field.CanBeSecuredForRead && field.IsValidODataAttribute && field.LogicalName !== 'slaid');
                        return fields.filter(isSelectable).filter(field => { var _a; return (_a = field.DisplayName.UserLocalizedLabel) === null || _a === void 0 ? void 0 : _a.Label; }).map(field => ({ name: field.DisplayName.UserLocalizedLabel.Label, value: field.LogicalName })).sort(GenericFunctions_1.sort);
                    });
                },
                getExpandableAccountFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const fields = yield GenericFunctions_1.getEntityFields.call(this, 'account');
                        const isSelectable = (field) => (field.IsValidForRead && field.CanBeSecuredForRead && field.IsValidODataAttribute && field.AttributeType === 'Lookup' && field.LogicalName !== 'slaid');
                        return fields.filter(isSelectable).map(field => ({ name: field.DisplayName.UserLocalizedLabel.Label, value: field.LogicalName })).sort(GenericFunctions_1.sort);
                    });
                },
            },
        };
    }
    execute() {
        var _a, _b;
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
                    if (resource === 'account') {
                        //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/create-entity-web-api
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            // tslint:disable-next-line: no-any
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const options = this.getNodeParameter('options', i);
                            const body = Object.assign({ name }, additionalFields);
                            if ((_a = body === null || body === void 0 ? void 0 : body.addresses) === null || _a === void 0 ? void 0 : _a.address) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAddresses)(body.addresses.address));
                                //@ts-ignore
                                body === null || body === void 0 ? true : delete body.addresses;
                            }
                            if (options.returnFields) {
                                options.returnFields.push('accountid');
                                qs['$select'] = options.returnFields.join(',');
                            }
                            else {
                                qs['$select'] = 'accountid';
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'POST', `/accounts`, body, qs);
                        }
                        if (operation === 'delete') {
                            //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/update-delete-entities-using-web-api#basic-delete
                            const accountId = this.getNodeParameter('accountId', i);
                            yield GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/accounts(${accountId})`, {}, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/retrieve-entity-using-web-api
                            const accountId = this.getNodeParameter('accountId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.returnFields) {
                                qs['$select'] = options.returnFields.join(',');
                            }
                            if (options.expandFields) {
                                qs['$expand'] = options.expandFields.join(',');
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/accounts(${accountId})`, {}, qs);
                        }
                        if (operation === 'getAll') {
                            //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/query-data-web-api
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (options.returnFields) {
                                qs['$select'] = options.returnFields.join(',');
                            }
                            if (options.expandFields) {
                                qs['$expand'] = options.expandFields.join(',');
                            }
                            if (filters.query) {
                                qs['$filter'] = filters.query;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/accounts`, {}, qs);
                            }
                            else {
                                qs['$top'] = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/accounts`, {}, qs);
                                responseData = responseData.value;
                            }
                        }
                        if (operation === 'update') {
                            const accountId = this.getNodeParameter('accountId', i);
                            // tslint:disable-next-line: no-any
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const options = this.getNodeParameter('options', i);
                            const body = Object.assign({}, updateFields);
                            if ((_b = body === null || body === void 0 ? void 0 : body.addresses) === null || _b === void 0 ? void 0 : _b.address) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAddresses)(body.addresses.address));
                                //@ts-ignore
                                body === null || body === void 0 ? true : delete body.addresses;
                            }
                            if (options.returnFields) {
                                options.returnFields.push('accountid');
                                qs['$select'] = options.returnFields.join(',');
                            }
                            else {
                                qs['$select'] = 'accountid';
                            }
                            responseData = yield GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/accounts(${accountId})`, body, qs);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push(...responseData);
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
exports.MicrosoftDynamicsCrm = MicrosoftDynamicsCrm;
