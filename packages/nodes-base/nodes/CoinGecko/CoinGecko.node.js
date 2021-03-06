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
exports.CoinGecko = void 0;
const CoinDescription_1 = require("./CoinDescription");
const EventDescription_1 = require("./EventDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class CoinGecko {
    constructor() {
        this.description = {
            displayName: 'CoinGecko',
            name: 'coinGecko',
            icon: 'file:coinGecko.svg',
            group: ['output'],
            version: 1,
            description: 'Consume CoinGecko API',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'CoinGecko',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Coin',
                            value: 'coin',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                    ],
                    default: 'coin',
                },
                ...CoinDescription_1.coinOperations,
                ...CoinDescription_1.coinFields,
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCurrencies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const currencies = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/simple/supported_vs_currencies');
                        currencies.sort();
                        for (const currency of currencies) {
                            returnData.push({
                                name: currency.toUpperCase(),
                                value: currency,
                            });
                        }
                        return returnData;
                    });
                },
                getCoins() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const coins = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/coins/list');
                        for (const coin of coins) {
                            returnData.push({
                                name: coin.symbol.toUpperCase(),
                                value: coin.id,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                getExchanges() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const exchanges = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/exchanges/list');
                        for (const exchange of exchanges) {
                            returnData.push({
                                name: exchange.name,
                                value: exchange.id,
                            });
                        }
                        return returnData;
                    });
                },
                getEventCountryCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const countryCodes = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/events/countries');
                        for (const code of countryCodes.data) {
                            if (!code.code) {
                                continue;
                            }
                            returnData.push({
                                name: code.country,
                                value: code.code,
                            });
                        }
                        return returnData;
                    });
                },
                getEventTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const eventTypes = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/events/types');
                        for (const type of eventTypes.data) {
                            returnData.push({
                                name: type,
                                value: type,
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
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'coin') {
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id_
                        //https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address_
                        if (operation === 'get') {
                            const options = this.getNodeParameter('options', i);
                            qs.community_data = false;
                            qs.developer_data = false;
                            qs.localization = false;
                            qs.market_data = false;
                            qs.sparkline = false;
                            qs.tickers = false;
                            Object.assign(qs, options);
                            const searchBy = this.getNodeParameter('searchBy', i);
                            if (searchBy === 'coinId') {
                                const coinId = this.getNodeParameter('coinId', i);
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${coinId}`, {}, qs);
                            }
                            if (searchBy === 'contractAddress') {
                                const platformId = this.getNodeParameter('platformId', i);
                                const contractAddress = this.getNodeParameter('contractAddress', i);
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${platformId}/contract/${contractAddress}`, {}, qs);
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let limit;
                            responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/coins/list', {}, qs);
                            if (returnAll === false) {
                                limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
                        if (operation === 'market') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const baseCurrency = this.getNodeParameter('baseCurrency', i);
                            const options = this.getNodeParameter('options', i);
                            qs.vs_currency = baseCurrency;
                            Object.assign(qs, options);
                            if (options.price_change_percentage) {
                                qs.price_change_percentage = options.price_change_percentage.join(',');
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.coinGeckoRequestAllItems.call(this, '', 'GET', `/coins/markets`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/markets`, {}, qs);
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price
                        //https://www.coingecko.com/api/documentations/v3#/simple/get_simple_token_price__id_
                        if (operation === 'price') {
                            const searchBy = this.getNodeParameter('searchBy', i);
                            const quoteCurrencies = this.getNodeParameter('quoteCurrencies', i);
                            const options = this.getNodeParameter('options', i);
                            qs.vs_currencies = quoteCurrencies.join(',');
                            Object.assign(qs, options);
                            if (searchBy === 'coinId') {
                                const baseCurrencies = this.getNodeParameter('baseCurrencies', i);
                                qs.ids = baseCurrencies.join(',');
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/simple/price', {}, qs);
                            }
                            if (searchBy === 'contractAddress') {
                                const platformId = this.getNodeParameter('platformId', i);
                                const contractAddresses = this.getNodeParameter('contractAddresses', i);
                                qs.contract_addresses = contractAddresses;
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/simple/token_price/${platformId}`, {}, qs);
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__tickers
                        if (operation === 'ticker') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const coinId = this.getNodeParameter('coinId', i);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            if (options.exchange_ids) {
                                qs.exchange_ids = options.exchange_ids.join(',');
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.coinGeckoRequestAllItems.call(this, 'tickers', 'GET', `/coins/${coinId}/tickers`, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${coinId}/tickers`, {}, qs);
                                responseData = responseData.tickers;
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__history
                        if (operation === 'history') {
                            const coinId = this.getNodeParameter('coinId', i);
                            const date = this.getNodeParameter('date', i);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            qs.date = (0, moment_timezone_1.default)(date).format('DD-MM-YYYY');
                            responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${coinId}/history`, {}, qs);
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__market_chart
                        //https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address__market_chart_
                        if (operation === 'marketChart') {
                            let respData;
                            const searchBy = this.getNodeParameter('searchBy', i);
                            const quoteCurrency = this.getNodeParameter('quoteCurrency', i);
                            const days = this.getNodeParameter('days', i);
                            qs.vs_currency = quoteCurrency;
                            qs.days = days;
                            if (searchBy === 'coinId') {
                                const coinId = this.getNodeParameter('baseCurrency', i);
                                respData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${coinId}/market_chart`, {}, qs);
                            }
                            if (searchBy === 'contractAddress') {
                                const platformId = this.getNodeParameter('platformId', i);
                                const contractAddress = this.getNodeParameter('contractAddress', i);
                                respData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${platformId}/contract/${contractAddress}/market_chart`, {}, qs);
                            }
                            responseData = [];
                            for (let idx = 0; idx < respData.prices.length; idx++) {
                                const [time, price] = respData.prices[idx];
                                const marketCaps = respData.market_caps[idx][1];
                                const totalVolume = respData.total_volumes[idx][1];
                                responseData.push({ time: (0, moment_timezone_1.default)(time).toISOString(), price, marketCaps, totalVolume });
                            }
                        }
                        //https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__ohlc
                        if (operation === 'candlestick') {
                            const baseCurrency = this.getNodeParameter('baseCurrency', i);
                            const quoteCurrency = this.getNodeParameter('quoteCurrency', i);
                            const days = this.getNodeParameter('days', i);
                            qs.vs_currency = quoteCurrency;
                            qs.days = days;
                            responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/coins/${baseCurrency}/ohlc`, {}, qs);
                            for (let idx = 0; idx < responseData.length; idx++) {
                                const [time, open, high, low, close] = responseData[idx];
                                responseData[idx] = { time: (0, moment_timezone_1.default)(time).toISOString(), open, high, low, close };
                            }
                        }
                    }
                    if (resource === 'event') {
                        //https://www.coingecko.com/api/documentations/v3#/events/get_events
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.coinGeckoRequestAllItems.call(this, 'data', 'GET', '/events', {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.per_page = limit;
                                responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/events', {}, qs);
                                responseData = responseData.data;
                            }
                        }
                    }
                    if (resource === 'simple') {
                        //https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price
                        if (operation === 'price') {
                            const ids = this.getNodeParameter('ids', i);
                            const currencies = this.getNodeParameter('currencies', i);
                            const options = this.getNodeParameter('options', i);
                            qs.ids = ids,
                                qs.vs_currencies = currencies.join(',');
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', '/simple/price', {}, qs);
                        }
                        //https://www.coingecko.com/api/documentations/v3#/simple/get_simple_token_price__id_
                        if (operation === 'tokenPrice') {
                            const id = this.getNodeParameter('id', i);
                            const contractAddresses = this.getNodeParameter('contractAddresses', i);
                            const currencies = this.getNodeParameter('currencies', i);
                            const options = this.getNodeParameter('options', i);
                            qs.contract_addresses = contractAddresses;
                            qs.vs_currencies = currencies.join(',');
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.coinGeckoApiRequest.call(this, 'GET', `/simple/token_price/${id}`, {}, qs);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
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
exports.CoinGecko = CoinGecko;
