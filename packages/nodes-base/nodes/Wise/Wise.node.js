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
exports.Wise = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const lodash_1 = require("lodash");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const uuid_1 = require("uuid");
class Wise {
    constructor() {
        this.description = {
            displayName: 'Wise',
            name: 'wise',
            icon: 'file:wise.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Wise API',
            defaults: {
                name: 'Wise',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wiseApi',
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
                        {
                            name: 'Exchange Rate',
                            value: 'exchangeRate',
                        },
                        {
                            name: 'Profile',
                            value: 'profile',
                        },
                        {
                            name: 'Quote',
                            value: 'quote',
                        },
                        {
                            name: 'Recipient',
                            value: 'recipient',
                        },
                        {
                            name: 'Transfer',
                            value: 'transfer',
                        },
                    ],
                    default: 'account',
                },
                ...descriptions_1.accountOperations,
                ...descriptions_1.accountFields,
                ...descriptions_1.exchangeRateOperations,
                ...descriptions_1.exchangeRateFields,
                ...descriptions_1.profileOperations,
                ...descriptions_1.profileFields,
                ...descriptions_1.quoteOperations,
                ...descriptions_1.quoteFields,
                ...descriptions_1.recipientOperations,
                ...descriptions_1.recipientFields,
                ...descriptions_1.transferOperations,
                ...descriptions_1.transferFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getBorderlessAccounts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const qs = {
                            profileId: this.getNodeParameter('profileId', 0),
                        };
                        const accounts = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/borderless-accounts', {}, qs);
                        return accounts.map(({ id, balances }) => ({
                            name: balances.map(({ currency }) => currency).join(' - '),
                            value: id,
                        }));
                    });
                },
                getProfiles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const profiles = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/profiles');
                        return profiles.map(({ id, type }) => ({
                            name: type.charAt(0).toUpperCase() + type.slice(1),
                            value: id,
                        }));
                    });
                },
                getRecipients() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const qs = {
                            profileId: this.getNodeParameter('profileId', 0),
                        };
                        const recipients = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/accounts', {}, qs);
                        return recipients.reduce((activeRecipients, { active, id, accountHolderName, currency, country, type, }) => {
                            if (active) {
                                const recipient = {
                                    name: `[${currency}] ${accountHolderName} - (${country !== null ? country + ' - ' : ''}${type})`,
                                    value: id,
                                };
                                activeRecipients.push(recipient);
                            }
                            return activeRecipients;
                        }, []);
                    });
                },
            },
        };
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const timezone = this.getTimezone();
            let responseData;
            const returnData = [];
            let binaryOutput = false;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'account') {
                        // *********************************************************************
                        //                             account
                        // *********************************************************************
                        if (operation === 'getBalances') {
                            // ----------------------------------
                            //      account: getBalances
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#borderless-accounts-get-account-balance
                            const qs = {
                                profileId: this.getNodeParameter('profileId', i),
                            };
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/borderless-accounts', {}, qs);
                        }
                        else if (operation === 'getCurrencies') {
                            // ----------------------------------
                            //      account: getCurrencies
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#borderless-accounts-get-available-currencies
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/borderless-accounts/balance-currencies');
                        }
                        else if (operation === 'getStatement') {
                            // ----------------------------------
                            //      account: getStatement
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#borderless-accounts-get-account-statement
                            const profileId = this.getNodeParameter('profileId', i);
                            const borderlessAccountId = this.getNodeParameter('borderlessAccountId', i);
                            const format = this.getNodeParameter('format', i);
                            const endpoint = `v3/profiles/${profileId}/borderless-accounts/${borderlessAccountId}/statement.${format}`;
                            const qs = {
                                currency: this.getNodeParameter('currency', i),
                            };
                            const { lineStyle, range } = this.getNodeParameter('additionalFields', i);
                            if (lineStyle !== undefined) {
                                qs.type = lineStyle;
                            }
                            if (range !== undefined) {
                                qs.intervalStart = moment_timezone_1.default.tz(range.rangeProperties.intervalStart, timezone).utc().format();
                                qs.intervalEnd = moment_timezone_1.default.tz(range.rangeProperties.intervalEnd, timezone).utc().format();
                            }
                            else {
                                qs.intervalStart = (0, moment_timezone_1.default)().subtract(1, 'months').utc().format();
                                qs.intervalEnd = (0, moment_timezone_1.default)().utc().format();
                            }
                            if (format === 'json') {
                                responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', endpoint, {}, qs);
                            }
                            else {
                                const data = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', endpoint, {}, qs, { encoding: 'arraybuffer' });
                                const binaryProperty = this.getNodeParameter('binaryProperty', i);
                                items[i].binary = (_a = items[i].binary) !== null && _a !== void 0 ? _a : {};
                                items[i].binary[binaryProperty] = yield this.helpers.prepareBinaryData(data, this.getNodeParameter('fileName', i));
                                responseData = items;
                                binaryOutput = true;
                            }
                        }
                    }
                    else if (resource === 'exchangeRate') {
                        // *********************************************************************
                        //                             exchangeRate
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //       exchangeRate: get
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#exchange-rates-list
                            const qs = {
                                source: this.getNodeParameter('source', i),
                                target: this.getNodeParameter('target', i),
                            };
                            const { interval, range, time, } = this.getNodeParameter('additionalFields', i);
                            if (interval !== undefined) {
                                qs.group = interval;
                            }
                            if (time !== undefined) {
                                qs.time = time;
                            }
                            if (range !== undefined && time === undefined) {
                                qs.from = moment_timezone_1.default.tz(range.rangeProperties.from, timezone).utc().format();
                                qs.to = moment_timezone_1.default.tz(range.rangeProperties.to, timezone).utc().format();
                            }
                            else if (time === undefined) {
                                qs.from = (0, moment_timezone_1.default)().subtract(1, 'months').utc().format();
                                qs.to = (0, moment_timezone_1.default)().format();
                            }
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/rates', {}, qs);
                        }
                    }
                    else if (resource === 'profile') {
                        // *********************************************************************
                        //                             profile
                        // *********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------
                            //          profile: get
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#user-profiles-get-by-id
                            const profileId = this.getNodeParameter('profileId', i);
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v1/profiles/${profileId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         profile: getAll
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#user-profiles-list
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/profiles');
                        }
                    }
                    else if (resource === 'recipient') {
                        // *********************************************************************
                        //                             recipient
                        // *********************************************************************
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //       recipient: getAll
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#recipient-accounts-list
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/accounts');
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    else if (resource === 'quote') {
                        // *********************************************************************
                        //                             quote
                        // *********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //          quote: create
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#quotes-create
                            const body = {
                                profile: this.getNodeParameter('profileId', i),
                                sourceCurrency: this.getNodeParameter('sourceCurrency', i).toUpperCase(),
                                targetCurrency: this.getNodeParameter('targetCurrency', i).toUpperCase(),
                            };
                            const amountType = this.getNodeParameter('amountType', i);
                            if (amountType === 'source') {
                                body.sourceAmount = this.getNodeParameter('amount', i);
                            }
                            else if (amountType === 'target') {
                                body.targetAmount = this.getNodeParameter('amount', i);
                            }
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'POST', 'v2/quotes', body, {});
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //          quote: get
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#quotes-get-by-id
                            const quoteId = this.getNodeParameter('quoteId', i);
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v2/quotes/${quoteId}`);
                        }
                    }
                    else if (resource === 'transfer') {
                        // *********************************************************************
                        //                             transfer
                        // *********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------
                            //         transfer: create
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#transfers-create
                            const body = {
                                quoteUuid: this.getNodeParameter('quoteId', i),
                                targetAccount: this.getNodeParameter('targetAccountId', i),
                                customerTransactionId: (0, uuid_1.v4)(),
                            };
                            const { reference } = this.getNodeParameter('additionalFields', i);
                            if (reference !== undefined) {
                                body.details = { reference };
                            }
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'POST', 'v1/transfers', body, {});
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //        transfer: delete
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#transfers-cancel
                            const transferId = this.getNodeParameter('transferId', i);
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'PUT', `v1/transfers/${transferId}/cancel`);
                        }
                        else if (operation === 'execute') {
                            // ----------------------------------
                            //        transfer: execute
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#transfers-fund
                            const profileId = this.getNodeParameter('profileId', i);
                            const transferId = this.getNodeParameter('transferId', i);
                            const endpoint = `v3/profiles/${profileId}/transfers/${transferId}/payments`;
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'POST', endpoint, { type: 'BALANCE' }, {});
                            // in sandbox, simulate transfer completion so that PDF receipt can be downloaded
                            const { environment } = yield this.getCredentials('wiseApi');
                            if (environment === 'test') {
                                for (const endpoint of ['processing', 'funds_converted', 'outgoing_payment_sent']) {
                                    yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v1/simulation/transfers/${transferId}/${endpoint}`);
                                }
                            }
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //        transfer: get
                            // ----------------------------------
                            const transferId = this.getNodeParameter('transferId', i);
                            const downloadReceipt = this.getNodeParameter('downloadReceipt', i);
                            if (downloadReceipt) {
                                // https://api-docs.transferwise.com/#transfers-get-receipt-pdf
                                const data = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v1/transfers/${transferId}/receipt.pdf`, {}, {}, { encoding: 'arraybuffer' });
                                const binaryProperty = this.getNodeParameter('binaryProperty', i);
                                items[i].binary = (_b = items[i].binary) !== null && _b !== void 0 ? _b : {};
                                items[i].binary[binaryProperty] = yield this.helpers.prepareBinaryData(data, this.getNodeParameter('fileName', i));
                                responseData = items;
                                binaryOutput = true;
                            }
                            else {
                                // https://api-docs.transferwise.com/#transfers-get-by-id
                                responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', `v1/transfers/${transferId}`);
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        transfer: getAll
                            // ----------------------------------
                            // https://api-docs.transferwise.com/#transfers-list
                            const qs = {
                                profile: this.getNodeParameter('profileId', i),
                            };
                            const filters = this.getNodeParameter('filters', i);
                            Object.keys((0, lodash_1.omit)(filters, 'range')).forEach(key => {
                                qs[key] = filters[key];
                            });
                            if (filters.range !== undefined) {
                                qs.createdDateStart = (0, moment_timezone_1.default)(filters.range.rangeProperties.createdDateStart).format();
                                qs.createdDateEnd = (0, moment_timezone_1.default)(filters.range.rangeProperties.createdDateEnd).format();
                            }
                            else {
                                qs.createdDateStart = (0, moment_timezone_1.default)().subtract(1, 'months').format();
                                qs.createdDateEnd = (0, moment_timezone_1.default)().format();
                            }
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.wiseApiRequest.call(this, 'GET', 'v1/transfers', {}, qs);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            if (binaryOutput && responseData !== undefined) {
                return this.prepareOutputData(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Wise = Wise;
