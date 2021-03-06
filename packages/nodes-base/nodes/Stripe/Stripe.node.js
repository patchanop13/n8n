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
exports.Stripe = void 0;
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const descriptions_1 = require("./descriptions");
class Stripe {
    constructor() {
        this.description = {
            displayName: 'Stripe',
            name: 'stripe',
            icon: 'file:stripe.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Stripe API',
            defaults: {
                name: 'Stripe',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'stripeApi',
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
                            name: 'Balance',
                            value: 'balance',
                        },
                        {
                            name: 'Charge',
                            value: 'charge',
                        },
                        {
                            name: 'Coupon',
                            value: 'coupon',
                        },
                        {
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Customer Card',
                            value: 'customerCard',
                        },
                        {
                            name: 'Source',
                            value: 'source',
                        },
                        {
                            name: 'Token',
                            value: 'token',
                        },
                    ],
                    default: 'balance',
                },
                ...descriptions_1.balanceOperations,
                ...descriptions_1.customerCardOperations,
                ...descriptions_1.customerCardFields,
                ...descriptions_1.chargeOperations,
                ...descriptions_1.chargeFields,
                ...descriptions_1.couponOperations,
                ...descriptions_1.couponFields,
                ...descriptions_1.customerOperations,
                ...descriptions_1.customerFields,
                ...descriptions_1.sourceOperations,
                ...descriptions_1.sourceFields,
                ...descriptions_1.tokenOperations,
                ...descriptions_1.tokenFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCustomers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield helpers_1.loadResource.call(this, 'customer');
                    });
                },
                getCurrencies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { data } = yield helpers_1.stripeApiRequest.call(this, 'GET', '/country_specs', {});
                        for (const currency of data[0].supported_payment_currencies) {
                            returnData.push({
                                name: currency.toUpperCase(),
                                value: currency,
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'balance') {
                        // *********************************************************************
                        //                             balance
                        // *********************************************************************
                        // https://stripe.com/docs/api/balance
                        if (operation === 'get') {
                            // ----------------------------------
                            //       balance: get
                            // ----------------------------------
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'GET', '/balance', {}, {});
                        }
                    }
                    else if (resource === 'customerCard') {
                        // *********************************************************************
                        //                           customer card
                        // *********************************************************************
                        // https://stripe.com/docs/api/cards
                        if (operation === 'add') {
                            // ----------------------------------
                            //         customerCard: add
                            // ----------------------------------
                            const body = {
                                source: this.getNodeParameter('token', i),
                            };
                            const customerId = this.getNodeParameter('customerId', i);
                            const endpoint = `/customers/${customerId}/sources`;
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', endpoint, body, {});
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------
                            //       customerCard: remove
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const endpoint = `/customers/${customerId}/sources/${cardId}`;
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //        customerCard: get
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            const sourceId = this.getNodeParameter('sourceId', i);
                            const endpoint = `/customers/${customerId}/sources/${sourceId}`;
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                    }
                    else if (resource === 'charge') {
                        // *********************************************************************
                        //                             charge
                        // *********************************************************************
                        // https://stripe.com/docs/api/charges
                        if (operation === 'create') {
                            // ----------------------------------
                            //          charge: create
                            // ----------------------------------
                            const body = {
                                customer: this.getNodeParameter('customerId', i),
                                currency: this.getNodeParameter('currency', i).toLowerCase(),
                                amount: this.getNodeParameter('amount', i),
                                source: this.getNodeParameter('source', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(body, (0, helpers_1.adjustChargeFields)(additionalFields));
                            }
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', '/charges', body, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //           charge: get
                            // ----------------------------------
                            const chargeId = this.getNodeParameter('chargeId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'GET', `/charges/${chargeId}`, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //          charge: getAll
                            // ----------------------------------
                            responseData = yield helpers_1.handleListing.call(this, resource, i);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         charge: update
                            // ----------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new Error(`Please enter at least one field to update for the ${resource}.`);
                            }
                            Object.assign(body, (0, helpers_1.adjustChargeFields)(updateFields));
                            const chargeId = this.getNodeParameter('chargeId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', `/charges/${chargeId}`, body, {});
                        }
                    }
                    else if (resource === 'coupon') {
                        // *********************************************************************
                        //                             coupon
                        // *********************************************************************
                        // https://stripe.com/docs/api/coupons
                        if (operation === 'create') {
                            // ----------------------------------
                            //          coupon: create
                            // ----------------------------------
                            const body = {
                                duration: this.getNodeParameter('duration', i),
                            };
                            const type = this.getNodeParameter('type', i);
                            if (type === 'fixedAmount') {
                                body.amount_off = this.getNodeParameter('amountOff', i);
                                body.currency = this.getNodeParameter('currency', i);
                            }
                            else {
                                body.percent_off = this.getNodeParameter('percentOff', i);
                            }
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', '/coupons', body, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //          coupon: getAll
                            // ----------------------------------
                            responseData = yield helpers_1.handleListing.call(this, resource, i);
                        }
                    }
                    else if (resource === 'customer') {
                        // *********************************************************************
                        //                             customer
                        // *********************************************************************
                        // https://stripe.com/docs/api/customers
                        if (operation === 'create') {
                            // ----------------------------------
                            //         customer: create
                            // ----------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(body, (0, helpers_1.adjustCustomerFields)(additionalFields));
                            }
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', '/customers', body, {});
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         customer: delete
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'DELETE', `/customers/${customerId}`, {}, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //          customer: get
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'GET', `/customers/${customerId}`, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        customer: getAll
                            // ----------------------------------
                            const qs = {};
                            const filters = this.getNodeParameter('filters', i);
                            if (!(0, lodash_1.isEmpty)(filters)) {
                                qs.email = filters.email;
                            }
                            responseData = yield helpers_1.handleListing.call(this, resource, i, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //        customer: update
                            // ----------------------------------
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new Error(`Please enter at least one field to update for the ${resource}.`);
                            }
                            Object.assign(body, (0, helpers_1.adjustCustomerFields)(updateFields));
                            const customerId = this.getNodeParameter('customerId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', `/customers/${customerId}`, body, {});
                        }
                    }
                    else if (resource === 'source') {
                        // *********************************************************************
                        //                             source
                        // *********************************************************************
                        // https://stripe.com/docs/api/sources
                        if (operation === 'create') {
                            // ----------------------------------
                            //         source: create
                            // ----------------------------------
                            const customerId = this.getNodeParameter('customerId', i);
                            const body = {
                                type: this.getNodeParameter('type', i),
                                amount: this.getNodeParameter('amount', i),
                                currency: this.getNodeParameter('currency', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (!(0, lodash_1.isEmpty)(additionalFields)) {
                                Object.assign(body, (0, helpers_1.adjustMetadata)(additionalFields));
                            }
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', '/sources', body, {});
                            // attach source to customer
                            const endpoint = `/customers/${customerId}/sources`;
                            yield helpers_1.stripeApiRequest.call(this, 'POST', endpoint, { source: responseData.id }, {});
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //          source: delete
                            // ----------------------------------
                            const sourceId = this.getNodeParameter('sourceId', i);
                            const customerId = this.getNodeParameter('customerId', i);
                            const endpoint = `/customers/${customerId}/sources/${sourceId}`;
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'DELETE', endpoint, {}, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //          source: get
                            // ----------------------------------
                            const sourceId = this.getNodeParameter('sourceId', i);
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'GET', `/sources/${sourceId}`, {}, {});
                        }
                    }
                    else if (resource === 'token') {
                        // *********************************************************************
                        //                             token
                        // *********************************************************************
                        // https://stripe.com/docs/api/tokens
                        if (operation === 'create') {
                            // ----------------------------------
                            //          token: create
                            // ----------------------------------
                            const type = this.getNodeParameter('type', i);
                            const body = {};
                            if (type !== 'cardToken') {
                                throw new Error('Only card token creation implemented.');
                            }
                            body.card = {
                                number: this.getNodeParameter('number', i),
                                exp_month: this.getNodeParameter('expirationMonth', i),
                                exp_year: this.getNodeParameter('expirationYear', i),
                                cvc: this.getNodeParameter('cvc', i),
                            };
                            responseData = yield helpers_1.stripeApiRequest.call(this, 'POST', '/tokens', body, {});
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Stripe = Stripe;
