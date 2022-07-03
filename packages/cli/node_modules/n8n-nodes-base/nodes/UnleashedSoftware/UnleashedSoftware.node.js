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
exports.UnleashedSoftware = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const SalesOrderDescription_1 = require("./SalesOrderDescription");
const StockOnHandDescription_1 = require("./StockOnHandDescription");
const moment_1 = __importDefault(require("moment"));
class UnleashedSoftware {
    constructor() {
        this.description = {
            displayName: 'Unleashed Software',
            name: 'unleashedSoftware',
            group: ['transform'],
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:unleashedSoftware.png',
            version: 1,
            description: 'Consume Unleashed Software API',
            defaults: {
                name: 'Unleashed Software',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'unleashedSoftwareApi',
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
                            name: 'Sales Order',
                            value: 'salesOrder',
                        },
                        {
                            name: 'Stock On Hand',
                            value: 'stockOnHand',
                        },
                    ],
                    default: 'salesOrder',
                },
                ...SalesOrderDescription_1.salesOrderOperations,
                ...SalesOrderDescription_1.salesOrderFields,
                ...StockOnHandDescription_1.stockOnHandOperations,
                ...StockOnHandDescription_1.stockOnHandFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            for (let i = 0; i < length; i++) {
                const resource = this.getNodeParameter('resource', 0);
                const operation = this.getNodeParameter('operation', 0);
                //https://apidocs.unleashedsoftware.com/SalesOrders
                if (resource === 'salesOrder') {
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        if (filters.startDate) {
                            filters.startDate = (0, moment_1.default)(filters.startDate).format('YYYY-MM-DD');
                        }
                        if (filters.endDate) {
                            filters.endDate = (0, moment_1.default)(filters.endDate).format('YYYY-MM-DD');
                        }
                        if (filters.modifiedSince) {
                            filters.modifiedSince = (0, moment_1.default)(filters.modifiedSince).format('YYYY-MM-DD');
                        }
                        if (filters.orderStatus) {
                            filters.orderStatus = filters.orderStatus.join(',');
                        }
                        Object.assign(qs, filters);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.unleashedApiRequestAllItems.call(this, 'Items', 'GET', '/SalesOrders', {}, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.pageSize = limit;
                            responseData = yield GenericFunctions_1.unleashedApiRequest.call(this, 'GET', `/SalesOrders`, {}, qs, 1);
                            responseData = responseData.Items;
                        }
                        (0, GenericFunctions_1.convertNETDates)(responseData);
                    }
                }
                //https://apidocs.unleashedsoftware.com/StockOnHand
                if (resource === 'stockOnHand') {
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filters = this.getNodeParameter('filters', i);
                        if (filters.asAtDate) {
                            filters.asAtDate = (0, moment_1.default)(filters.asAtDate).format('YYYY-MM-DD');
                        }
                        if (filters.modifiedSince) {
                            filters.modifiedSince = (0, moment_1.default)(filters.modifiedSince).format('YYYY-MM-DD');
                        }
                        if (filters.orderBy) {
                            filters.orderBy = filters.orderBy.trim();
                        }
                        Object.assign(qs, filters);
                        if (returnAll) {
                            responseData = yield GenericFunctions_1.unleashedApiRequestAllItems.call(this, 'Items', 'GET', '/StockOnHand', {}, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.pageSize = limit;
                            responseData = yield GenericFunctions_1.unleashedApiRequest.call(this, 'GET', `/StockOnHand`, {}, qs, 1);
                            responseData = responseData.Items;
                        }
                        (0, GenericFunctions_1.convertNETDates)(responseData);
                    }
                    if (operation === 'get') {
                        const productId = this.getNodeParameter('productId', i);
                        responseData = yield GenericFunctions_1.unleashedApiRequest.call(this, 'GET', `/StockOnHand/${productId}`);
                        (0, GenericFunctions_1.convertNETDates)(responseData);
                    }
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
exports.UnleashedSoftware = UnleashedSoftware;
