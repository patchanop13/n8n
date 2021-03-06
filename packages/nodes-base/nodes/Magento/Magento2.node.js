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
exports.Magento2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const CustomerDescription_1 = require("./CustomerDescription");
const OrderDescription_1 = require("./OrderDescription");
const ProductDescription_1 = require("./ProductDescription");
const InvoiceDescription_1 = require("./InvoiceDescription");
const change_case_1 = require("change-case");
class Magento2 {
    constructor() {
        this.description = {
            displayName: 'Magento 2',
            name: 'magento2',
            icon: 'file:magento.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Magento API',
            defaults: {
                name: 'Magento 2',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'magento2Api',
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
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Invoice',
                            value: 'invoice',
                        },
                        {
                            name: 'Order',
                            value: 'order',
                        },
                        {
                            name: 'Product',
                            value: 'product',
                        },
                    ],
                    default: 'customer',
                },
                ...CustomerDescription_1.customerOperations,
                ...CustomerDescription_1.customerFields,
                ...InvoiceDescription_1.invoiceOperations,
                ...InvoiceDescription_1.invoiceFields,
                ...OrderDescription_1.orderOperations,
                ...OrderDescription_1.orderFields,
                ...ProductDescription_1.productOperations,
                ...ProductDescription_1.productFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCountries() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/directorycountries
                        const countries = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', '/rest/default/V1/directory/countries');
                        const returnData = [];
                        for (const country of countries) {
                            returnData.push({
                                name: country.full_name_english,
                                value: country.id,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/customerGroupsdefault#operation/customerGroupManagementV1GetDefaultGroupGet
                        const group = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', '/rest/default/V1/customerGroups/default');
                        const returnData = [];
                        returnData.push({
                            name: group.code,
                            value: group.id,
                        });
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getStores() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/storestoreConfigs
                        const stores = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', '/rest/default/V1/store/storeConfigs');
                        const returnData = [];
                        for (const store of stores) {
                            returnData.push({
                                name: store.base_url,
                                value: store.id,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getWebsites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/storewebsites
                        const websites = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', '/rest/default/V1/store/websites');
                        const returnData = [];
                        for (const website of websites) {
                            returnData.push({
                                name: website.name,
                                value: website.id,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getCustomAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/attributeMetadatacustomer#operation/customerCustomerMetadataV1GetAllAttributesMetadataGet
                        const resource = this.getCurrentNodeParameter('resource');
                        const attributes = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/attributeMetadata/${resource}`);
                        const returnData = [];
                        for (const attribute of attributes) {
                            if (attribute.system === false && attribute.frontend_label !== '') {
                                returnData.push({
                                    name: attribute.frontend_label,
                                    value: attribute.attribute_code,
                                });
                            }
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getSystemAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/attributeMetadatacustomer#operation/customerCustomerMetadataV1GetAllAttributesMetadataGet
                        const resource = this.getCurrentNodeParameter('resource');
                        const attributes = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/attributeMetadata/${resource}`);
                        const returnData = [];
                        for (const attribute of attributes) {
                            if (attribute.system === true && attribute.frontend_label !== null) {
                                returnData.push({
                                    name: attribute.frontend_label,
                                    value: attribute.attribute_code,
                                });
                            }
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getProductTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/productslinkstypes
                        const types = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/types`);
                        const returnData = [];
                        for (const type of types) {
                            returnData.push({
                                name: type.label,
                                value: type.name,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/categories#operation/catalogCategoryManagementV1GetTreeGet
                        const { items: categories } = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/categories/list`, {}, {
                            search_criteria: {
                                filter_groups: [
                                    {
                                        filters: [
                                            {
                                                field: 'is_active',
                                                condition_type: 'eq',
                                                value: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        });
                        const returnData = [];
                        for (const category of categories) {
                            returnData.push({
                                name: category.name,
                                value: category.id,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getAttributeSets() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //https://magento.redoc.ly/2.3.7-admin/tag/productsattribute-setssetslist#operation/catalogAttributeSetRepositoryV1GetListGet
                        const { items: attributeSets } = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/attribute-sets/sets/list`, {}, {
                            search_criteria: 0,
                        });
                        const returnData = [];
                        for (const attributeSet of attributeSets) {
                            returnData.push({
                                name: attributeSet.attribute_set_name,
                                value: attributeSet.attribute_set_id,
                            });
                        }
                        returnData.sort(GenericFunctions_1.sort);
                        return returnData;
                    });
                },
                getFilterableCustomerAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.getProductAttributes.call(this, (attribute) => attribute.is_filterable === true);
                    });
                },
                getProductAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.getProductAttributes.call(this);
                    });
                },
                // async getProductAttributesFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                // 	return getProductAttributes.call(this, undefined, { name: '*', value: '*', description: 'All properties' });
                // },
                getFilterableProductAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.getProductAttributes.call(this, (attribute) => attribute.is_searchable === '1');
                    });
                },
                getSortableProductAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return GenericFunctions_1.getProductAttributes.call(this, (attribute) => attribute.used_for_sort_by === true);
                    });
                },
                getOrderAttributes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return (0, GenericFunctions_1.getOrderFields)().map(field => ({ name: (0, change_case_1.capitalCase)(field), value: field })).sort(GenericFunctions_1.sort);
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
            const timezone = this.getTimezone();
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'customer') {
                        if (operation === 'create') {
                            // https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
                            const email = this.getNodeParameter('email', i);
                            const firstname = this.getNodeParameter('firstname', i);
                            const lastname = this.getNodeParameter('lastname', i);
                            const _a = this.getNodeParameter('additionalFields', i), { addresses, customAttributes, password } = _a, rest = __rest(_a, ["addresses", "customAttributes", "password"]);
                            const body = {
                                customer: {
                                    email,
                                    firstname,
                                    lastname,
                                },
                            };
                            body.customer.addresses = (0, GenericFunctions_1.adjustAddresses)((addresses === null || addresses === void 0 ? void 0 : addresses.address) || []);
                            body.customer.custom_attributes = (customAttributes === null || customAttributes === void 0 ? void 0 : customAttributes.customAttribute) || {};
                            body.customer.extension_attributes = ['amazon_id', 'is_subscribed', 'vertex_customer_code', 'vertex_customer_country']
                                // tslint:disable-next-line: no-any
                                .reduce((obj, value) => {
                                if (rest.hasOwnProperty(value)) {
                                    const data = Object.assign(obj, { [value]: rest[value] });
                                    delete rest[value];
                                    return data;
                                }
                                else {
                                    return obj;
                                }
                            }, {});
                            if (password) {
                                body.password = password;
                            }
                            Object.assign(body.customer, rest);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'POST', '/rest/V1/customers', body);
                        }
                        if (operation === 'delete') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
                            const customerId = this.getNodeParameter('customerId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'DELETE', `/rest/default/V1/customers/${customerId}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1GetByIdGet
                            const customerId = this.getNodeParameter('customerId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/customers/${customerId}`);
                        }
                        if (operation === 'getAll') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/customerssearch
                            const filterType = this.getNodeParameter('filterType', i);
                            const sort = this.getNodeParameter('options.sort', i, {});
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            let qs = {};
                            if (filterType === 'manual') {
                                const filters = this.getNodeParameter('filters', i);
                                const matchType = this.getNodeParameter('matchType', i);
                                qs = (0, GenericFunctions_1.getFilterQuery)(Object.assign(filters, { matchType }, sort));
                            }
                            else if (filterType === 'json') {
                                const filterJson = this.getNodeParameter('filterJson', i);
                                if ((0, GenericFunctions_1.validateJSON)(filterJson) !== undefined) {
                                    qs = JSON.parse(filterJson);
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Filter (JSON) must be a valid json' });
                                }
                            }
                            else {
                                qs = {
                                    search_criteria: {},
                                };
                                if (Object.keys(sort).length !== 0) {
                                    qs.search_criteria = {
                                        sort_orders: sort.sort,
                                    };
                                }
                            }
                            if (returnAll === true) {
                                qs.search_criteria.page_size = 100;
                                responseData = yield GenericFunctions_1.magentoApiRequestAllItems.call(this, 'items', 'GET', `/rest/default/V1/customers/search`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', 0);
                                qs.search_criteria.page_size = limit;
                                responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/customers/search`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        if (operation === 'update') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
                            const customerId = this.getNodeParameter('customerId', i);
                            const firstName = this.getNodeParameter('firstName', i);
                            const lastName = this.getNodeParameter('lastName', i);
                            const email = this.getNodeParameter('email', i);
                            const _b = this.getNodeParameter('updateFields', i), { addresses, customAttributes, password } = _b, rest = __rest(_b, ["addresses", "customAttributes", "password"]);
                            const body = {
                                customer: {
                                    email,
                                    firstname: firstName,
                                    lastname: lastName,
                                    id: parseInt(customerId, 10),
                                    website_id: 0,
                                },
                            };
                            body.customer.addresses = (0, GenericFunctions_1.adjustAddresses)((addresses === null || addresses === void 0 ? void 0 : addresses.address) || []);
                            body.customer.custom_attributes = (customAttributes === null || customAttributes === void 0 ? void 0 : customAttributes.customAttribute) || {};
                            body.customer.extension_attributes = ['amazon_id', 'is_subscribed', 'vertex_customer_code', 'vertex_customer_country']
                                // tslint:disable-next-line: no-any
                                .reduce((obj, value) => {
                                if (rest.hasOwnProperty(value)) {
                                    const data = Object.assign(obj, { [value]: rest[value] });
                                    delete rest[value];
                                    return data;
                                }
                                else {
                                    return obj;
                                }
                            }, {});
                            if (password) {
                                body.password = password;
                            }
                            Object.assign(body.customer, rest);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'PUT', `/rest/V1/customers/${customerId}`, body);
                        }
                    }
                    if (resource === 'invoice') {
                        if (operation === 'create') {
                            ///https://magento.redoc.ly/2.3.7-admin/tag/orderorderIdinvoice
                            const orderId = this.getNodeParameter('orderId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'POST', `/rest/default/V1/order/${orderId}/invoice`);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'order') {
                        if (operation === 'cancel') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/ordersidcancel
                            const orderId = this.getNodeParameter('orderId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'POST', `/rest/default/V1/orders/${orderId}/cancel`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/ordersid#operation/salesOrderRepositoryV1GetGet
                            const orderId = this.getNodeParameter('orderId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/orders/${orderId}`);
                        }
                        if (operation === 'ship') {
                            ///https://magento.redoc.ly/2.3.7-admin/tag/orderorderIdship#operation/salesShipOrderV1ExecutePost
                            const orderId = this.getNodeParameter('orderId', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'POST', `/rest/default/V1/order/${orderId}/ship`);
                            responseData = { success: true };
                        }
                        if (operation === 'getAll') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/orders#operation/salesOrderRepositoryV1GetListGet
                            const filterType = this.getNodeParameter('filterType', i);
                            const sort = this.getNodeParameter('options.sort', i, {});
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            let qs = {};
                            if (filterType === 'manual') {
                                const filters = this.getNodeParameter('filters', i);
                                const matchType = this.getNodeParameter('matchType', i);
                                qs = (0, GenericFunctions_1.getFilterQuery)(Object.assign(filters, { matchType }, sort));
                            }
                            else if (filterType === 'json') {
                                const filterJson = this.getNodeParameter('filterJson', i);
                                if ((0, GenericFunctions_1.validateJSON)(filterJson) !== undefined) {
                                    qs = JSON.parse(filterJson);
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Filter (JSON) must be a valid json' });
                                }
                            }
                            else {
                                qs = {
                                    search_criteria: {},
                                };
                                if (Object.keys(sort).length !== 0) {
                                    qs.search_criteria = {
                                        sort_orders: sort.sort,
                                    };
                                }
                            }
                            if (returnAll === true) {
                                qs.search_criteria.page_size = 100;
                                responseData = yield GenericFunctions_1.magentoApiRequestAllItems.call(this, 'items', 'GET', `/rest/default/V1/orders`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', 0);
                                qs.search_criteria.page_size = limit;
                                responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/orders`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                    }
                    if (resource === 'product') {
                        if (operation === 'create') {
                            // https://magento.redoc.ly/2.3.7-admin/tag/products#operation/catalogProductRepositoryV1SavePost
                            const sku = this.getNodeParameter('sku', i);
                            const name = this.getNodeParameter('name', i);
                            const attributeSetId = this.getNodeParameter('attributeSetId', i);
                            const price = this.getNodeParameter('price', i);
                            const _c = this.getNodeParameter('additionalFields', i), { customAttributes, category } = _c, rest = __rest(_c, ["customAttributes", "category"]);
                            const body = {
                                product: {
                                    sku,
                                    name,
                                    attribute_set_id: parseInt(attributeSetId, 10),
                                    price,
                                },
                            };
                            body.product.custom_attributes = (customAttributes === null || customAttributes === void 0 ? void 0 : customAttributes.customAttribute) || {};
                            Object.assign(body.product, rest);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'POST', '/rest/default/V1/products', body);
                        }
                        if (operation === 'delete') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1DeleteByIdDelete
                            const sku = this.getNodeParameter('sku', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'DELETE', `/rest/default/V1/products/${sku}`);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1GetGet
                            const sku = this.getNodeParameter('sku', i);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/${sku}`);
                        }
                        if (operation === 'getAll') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/customerssearch
                            const filterType = this.getNodeParameter('filterType', i);
                            const sort = this.getNodeParameter('options.sort', i, {});
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            let qs = {};
                            if (filterType === 'manual') {
                                const filters = this.getNodeParameter('filters', i);
                                const matchType = this.getNodeParameter('matchType', i);
                                qs = (0, GenericFunctions_1.getFilterQuery)(Object.assign(filters, { matchType }, sort));
                            }
                            else if (filterType === 'json') {
                                const filterJson = this.getNodeParameter('filterJson', i);
                                if ((0, GenericFunctions_1.validateJSON)(filterJson) !== undefined) {
                                    qs = JSON.parse(filterJson);
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Filter (JSON) must be a valid json' });
                                }
                            }
                            else {
                                qs = {
                                    search_criteria: {},
                                };
                                if (Object.keys(sort).length !== 0) {
                                    qs.search_criteria = {
                                        sort_orders: sort.sort,
                                    };
                                }
                            }
                            if (returnAll === true) {
                                qs.search_criteria.page_size = 100;
                                responseData = yield GenericFunctions_1.magentoApiRequestAllItems.call(this, 'items', 'GET', `/rest/default/V1/products`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', 0);
                                qs.search_criteria.page_size = limit;
                                responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'GET', `/rest/default/V1/products`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        if (operation === 'update') {
                            //https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1SavePut
                            const sku = this.getNodeParameter('sku', i);
                            const _d = this.getNodeParameter('updateFields', i), { customAttributes } = _d, rest = __rest(_d, ["customAttributes"]);
                            if (!Object.keys(rest).length) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'At least one parameter has to be updated' });
                            }
                            const body = {
                                product: {
                                    sku,
                                },
                            };
                            body.product.custom_attributes = (customAttributes === null || customAttributes === void 0 ? void 0 : customAttributes.customAttribute) || {};
                            Object.assign(body.product, rest);
                            responseData = yield GenericFunctions_1.magentoApiRequest.call(this, 'PUT', `/rest/default/V1/products/${sku}`, body);
                        }
                    }
                    Array.isArray(responseData)
                        ? returnData.push(...responseData)
                        : returnData.push(responseData);
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
exports.Magento2 = Magento2;
