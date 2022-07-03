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
exports.Marketstack = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Marketstack {
    constructor() {
        this.description = {
            displayName: 'Marketstack',
            name: 'marketstack',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            icon: 'file:marketstack.svg',
            group: ['transform'],
            version: 1,
            description: 'Consume Marketstack API',
            defaults: {
                name: 'Marketstack',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'marketstackApi',
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
                            name: 'End-of-Day Data',
                            value: 'endOfDayData',
                            description: 'Stock market closing data',
                        },
                        {
                            name: 'Exchange',
                            value: 'exchange',
                            description: 'Stock market exchange',
                        },
                        {
                            name: 'Ticker',
                            value: 'ticker',
                            description: 'Stock market symbol',
                        },
                    ],
                    default: 'endOfDayData',
                    required: true,
                },
                ...descriptions_1.endOfDayDataOperations,
                ...descriptions_1.endOfDayDataFields,
                ...descriptions_1.exchangeOperations,
                ...descriptions_1.exchangeFields,
                ...descriptions_1.tickerOperations,
                ...descriptions_1.tickerFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData; // tslint:disable-line: no-any
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'endOfDayData') {
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //       endOfDayData: getAll
                            // ----------------------------------
                            const qs = {
                                symbols: this.getNodeParameter('symbols', i),
                            };
                            const _a = this.getNodeParameter('filters', i), { latest, specificDate, dateFrom, dateTo } = _a, rest = __rest(_a, ["latest", "specificDate", "dateFrom", "dateTo"]);
                            GenericFunctions_1.validateTimeOptions.call(this, [
                                latest !== undefined && latest !== false,
                                specificDate !== undefined,
                                dateFrom !== undefined && dateTo !== undefined,
                            ]);
                            if (Object.keys(rest).length) {
                                Object.assign(qs, rest);
                            }
                            let endpoint;
                            if (latest) {
                                endpoint = '/eod/latest';
                            }
                            else if (specificDate) {
                                endpoint = `/eod/${(0, GenericFunctions_1.format)(specificDate)}`;
                            }
                            else {
                                if (!dateFrom || !dateTo) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter a start and end date to filter by timeframe.');
                                }
                                endpoint = '/eod';
                                qs.date_from = (0, GenericFunctions_1.format)(dateFrom);
                                qs.date_to = (0, GenericFunctions_1.format)(dateTo);
                            }
                            responseData = yield GenericFunctions_1.marketstackApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                        }
                    }
                    else if (resource === 'exchange') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //          exchange: get
                            // ----------------------------------
                            const exchange = this.getNodeParameter('exchange', i);
                            const endpoint = `/exchanges/${exchange}`;
                            responseData = yield GenericFunctions_1.marketstackApiRequest.call(this, 'GET', endpoint);
                        }
                    }
                    else if (resource === 'ticker') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //           ticker: get
                            // ----------------------------------
                            const symbol = this.getNodeParameter('symbol', i);
                            const endpoint = `/tickers/${symbol}`;
                            responseData = yield GenericFunctions_1.marketstackApiRequest.call(this, 'GET', endpoint);
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
exports.Marketstack = Marketstack;
