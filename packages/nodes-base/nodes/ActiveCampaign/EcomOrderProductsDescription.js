"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecomOrderProductsFields = exports.ecomOrderProductsOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
exports.ecomOrderProductsOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'ecommerceOrderProducts',
                ],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get data of all order products',
            },
            {
                name: 'Get by Product ID',
                value: 'getByProductId',
                description: 'Get data of a ordered product',
            },
            {
                name: 'Get by Order ID',
                value: 'getByOrderId',
                description: 'Get data of an order\'s products',
            },
        ],
        default: 'getAll',
    },
];
exports.ecomOrderProductsFields = [
    // ----------------------------------
    //         ecommerceOrderProducts:getByOrderId
    // ----------------------------------
    {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'getByOrderId',
                ],
                resource: [
                    'ecommerceOrderProducts',
                ],
            },
        },
        description: 'The ID of the order whose products you\'d like returned',
    },
    // ----------------------------------
    //         ecommerceOrderProducts:getByProductId
    // ----------------------------------
    {
        displayName: 'Product ID',
        name: 'procuctId',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'getByProductId',
                ],
                resource: [
                    'ecommerceOrderProducts',
                ],
            },
        },
        description: 'The ID of the product you\'d like returned',
    },
    // ----------------------------------
    //         ecommerceOrderProducts:getAll
    // ----------------------------------
    ...(0, GenericFunctions_1.activeCampaignDefaultGetAllProperties)('ecommerceOrderProducts', 'getAll'),
];
