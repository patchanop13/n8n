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
exports.Paddle = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const CouponDescription_1 = require("./CouponDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const PaymentDescription_1 = require("./PaymentDescription");
const PlanDescription_1 = require("./PlanDescription");
const ProductDescription_1 = require("./ProductDescription");
const UserDescription_1 = require("./UserDescription");
// import {
// 	orderOperations,
// 	orderFields,
// } from './OrderDescription';
const moment_1 = __importDefault(require("moment"));
class Paddle {
    constructor() {
        this.description = {
            displayName: 'Paddle',
            name: 'paddle',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:paddle.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Paddle API',
            defaults: {
                name: 'Paddle',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'paddleApi',
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
                            name: 'Coupon',
                            value: 'coupon',
                        },
                        {
                            name: 'Payment',
                            value: 'payment',
                        },
                        {
                            name: 'Plan',
                            value: 'plan',
                        },
                        {
                            name: 'Product',
                            value: 'product',
                        },
                        // {
                        // 	name: 'Order',
                        // 	value: 'order',
                        // },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'coupon',
                },
                // COUPON
                ...CouponDescription_1.couponOperations,
                ...CouponDescription_1.couponFields,
                // PAYMENT
                ...PaymentDescription_1.paymentOperations,
                ...PaymentDescription_1.paymentFields,
                // PLAN
                ...PlanDescription_1.planOperations,
                ...PlanDescription_1.planFields,
                // PRODUCT
                ...ProductDescription_1.productOperations,
                ...ProductDescription_1.productFields,
                // ORDER
                // ...orderOperations,
                // ...orderFields,
                // USER
                ...UserDescription_1.userOperations,
                ...UserDescription_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                /* -------------------------------------------------------------------------- */
                /*                                 PAYMENT                                    */
                /* -------------------------------------------------------------------------- */
                // Get all payment so they can be selected in payment rescheduling
                getPayments() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = '/2.0/subscription/payments';
                        const paymentResponse = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', {});
                        // Alert user if there's no payments present to be loaded into payments property
                        if (paymentResponse.response === undefined || paymentResponse.response.length === 0) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), paymentResponse, { message: 'No payments on account.' });
                        }
                        for (const payment of paymentResponse.response) {
                            const id = payment.id;
                            returnData.push({
                                name: id,
                                value: id,
                            });
                        }
                        return returnData;
                    });
                },
                /* -------------------------------------------------------------------------- */
                /*                                 PRODUCTS                                   */
                /* -------------------------------------------------------------------------- */
                // Get all Products so they can be selected in coupon creation when assigning products
                getProducts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const endpoint = '/2.0/product/get_products';
                        const products = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', {});
                        // Alert user if there's no products present to be loaded into payments property
                        if (products.length === 0) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No products on account.');
                        }
                        for (const product of products) {
                            const name = product.name;
                            const id = product.id;
                            returnData.push({
                                name,
                                value: id,
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
            const body = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'coupon') {
                        if (operation === 'create') {
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const discountType = this.getNodeParameter('discountType', i);
                                const couponType = this.getNodeParameter('couponType', i);
                                const discountAmount = this.getNodeParameter('discountAmount', i);
                                if (couponType === 'product') {
                                    body.product_ids = this.getNodeParameter('productIds', i);
                                }
                                if (discountType === 'flat') {
                                    body.currency = this.getNodeParameter('currency', i);
                                }
                                body.coupon_type = couponType;
                                body.discount_type = discountType;
                                body.discount_amount = discountAmount;
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.allowedUses) {
                                    body.allowed_uses = additionalFields.allowedUses;
                                }
                                if (additionalFields.couponCode) {
                                    body.coupon_code = additionalFields.couponCode;
                                }
                                if (additionalFields.couponPrefix) {
                                    body.coupon_prefix = additionalFields.couponPrefix;
                                }
                                if (additionalFields.expires) {
                                    body.expires = (0, moment_1.default)(additionalFields.expires).format('YYYY-MM-DD');
                                }
                                if (additionalFields.group) {
                                    body.group = additionalFields.group;
                                }
                                if (additionalFields.recurring) {
                                    body.recurring = 1;
                                }
                                else {
                                    body.recurring = 0;
                                }
                                if (additionalFields.numberOfCoupons) {
                                    body.num_coupons = additionalFields.numberOfCoupons;
                                }
                                if (additionalFields.description) {
                                    body.description = additionalFields.description;
                                }
                                const endpoint = '/2.1/product/create_coupon';
                                responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                                responseData = responseData.response.coupon_codes.map((coupon) => ({ coupon }));
                            }
                        }
                        if (operation === 'getAll') {
                            const productId = this.getNodeParameter('productId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = '/2.0/product/list_coupons';
                            body.product_id = productId;
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            if (returnAll) {
                                responseData = responseData.response;
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.response.splice(0, limit);
                            }
                        }
                        if (operation === 'update') {
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const updateBy = this.getNodeParameter('updateBy', i);
                                if (updateBy === 'group') {
                                    body.group = this.getNodeParameter('group', i);
                                }
                                else {
                                    body.coupon_code = this.getNodeParameter('couponCode', i);
                                }
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.allowedUses) {
                                    body.allowed_uses = additionalFields.allowedUses;
                                }
                                if (additionalFields.currency) {
                                    body.currency = additionalFields.currency;
                                }
                                if (additionalFields.newCouponCode) {
                                    body.new_coupon_code = additionalFields.newCouponCode;
                                }
                                if (additionalFields.expires) {
                                    body.expires = (0, moment_1.default)(additionalFields.expires).format('YYYY-MM-DD');
                                }
                                if (additionalFields.newGroup) {
                                    body.new_group = additionalFields.newGroup;
                                }
                                if (additionalFields.recurring === true) {
                                    body.recurring = 1;
                                }
                                else if (additionalFields.recurring === false) {
                                    body.recurring = 0;
                                }
                                if (additionalFields.productIds) {
                                    body.product_ids = additionalFields.productIds;
                                }
                                if (additionalFields.discountAmount) {
                                    body.discount_amount = additionalFields.discountAmount;
                                }
                                if (additionalFields.discount) {
                                    //@ts-ignore
                                    if (additionalFields.discount.discountProperties.discountType === 'percentage') {
                                        // @ts-ignore
                                        body.discount_amount = additionalFields.discount.discountProperties.discountAmount;
                                    }
                                    else {
                                        //@ts-ignore
                                        body.currency = additionalFields.discount.discountProperties.currency;
                                        //@ts-ignore
                                        body.discount_amount = additionalFields.discount.discountProperties.discountAmount;
                                    }
                                }
                            }
                            const endpoint = '/2.1/product/update_coupon';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            responseData = responseData.response;
                        }
                    }
                    if (resource === 'payment') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.subscriptionId) {
                                    body.subscription_id = additionalFields.subscriptionId;
                                }
                                if (additionalFields.plan) {
                                    body.plan = additionalFields.plan;
                                }
                                if (additionalFields.state) {
                                    body.state = additionalFields.state;
                                }
                                if (additionalFields.isPaid) {
                                    body.is_paid = 1;
                                }
                                else {
                                    body.is_paid = 0;
                                }
                                if (additionalFields.from) {
                                    body.from = (0, moment_1.default)(additionalFields.from).format('YYYY-MM-DD');
                                }
                                if (additionalFields.to) {
                                    body.to = (0, moment_1.default)(additionalFields.to).format('YYYY-MM-DD');
                                }
                                if (additionalFields.isOneOffCharge) {
                                    body.is_one_off_charge = additionalFields.isOneOffCharge;
                                }
                            }
                            const endpoint = '/2.0/subscription/payments';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            if (returnAll) {
                                responseData = responseData.response;
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.response.splice(0, limit);
                            }
                        }
                        if (operation === 'reschedule') {
                            const paymentId = this.getNodeParameter('paymentId', i);
                            const date = this.getNodeParameter('date', i);
                            body.payment_id = paymentId;
                            body.date = body.to = (0, moment_1.default)(date).format('YYYY-MM-DD');
                            const endpoint = '/2.0/subscription/payments_reschedule';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                        }
                    }
                    if (resource === 'plan') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = '/2.0/subscription/plans';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            if (returnAll) {
                                responseData = responseData.response;
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.response.splice(0, limit);
                            }
                        }
                        if (operation === 'get') {
                            const planId = this.getNodeParameter('planId', i);
                            body.plan = planId;
                            const endpoint = '/2.0/subscription/plans';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            responseData = responseData.response;
                        }
                    }
                    if (resource === 'product') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const endpoint = '/2.0/product/get_products';
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                            if (returnAll) {
                                responseData = responseData.response.products;
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.response.products.splice(0, limit);
                            }
                        }
                    }
                    if (resource === 'order') {
                        if (operation === 'get') {
                            const endpoint = '/1.0/order';
                            const checkoutId = this.getNodeParameter('checkoutId', i);
                            body.checkout_id = checkoutId;
                            responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'GET', body);
                        }
                    }
                    if (resource === 'user') {
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const jsonParameters = this.getNodeParameter('jsonParameters', i);
                            if (jsonParameters) {
                                const additionalFieldsJson = this.getNodeParameter('additionalFieldsJson', i);
                                if (additionalFieldsJson !== '') {
                                    if ((0, GenericFunctions_1.validateJSON)(additionalFieldsJson) !== undefined) {
                                        Object.assign(body, JSON.parse(additionalFieldsJson));
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Additional fields must be a valid JSON');
                                    }
                                }
                            }
                            else {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.state) {
                                    body.state = additionalFields.state;
                                }
                                if (additionalFields.planId) {
                                    body.plan_id = additionalFields.planId;
                                }
                                if (additionalFields.subscriptionId) {
                                    body.subscription_id = additionalFields.subscriptionId;
                                }
                            }
                            const endpoint = '/2.0/subscription/users';
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.paddleApiRequestAllItems.call(this, 'response', endpoint, 'POST', body);
                            }
                            else {
                                body.results_per_page = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.paddleApiRequest.call(this, endpoint, 'POST', body);
                                responseData = responseData.response;
                            }
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
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Paddle = Paddle;
