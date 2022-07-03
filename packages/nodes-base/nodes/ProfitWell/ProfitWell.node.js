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
exports.ProfitWell = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CompanyDescription_1 = require("./CompanyDescription");
const MetricDescription_1 = require("./MetricDescription");
class ProfitWell {
    constructor() {
        this.description = {
            displayName: 'ProfitWell',
            name: 'profitWell',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:profitwell.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume ProfitWell API',
            defaults: {
                name: 'ProfitWell',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'profitWellApi',
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
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Metric',
                            value: 'metric',
                        },
                    ],
                    default: 'metric',
                },
                // COMPANY
                ...CompanyDescription_1.companyOperations,
                // METRICS
                ...MetricDescription_1.metricOperations,
                ...MetricDescription_1.metricFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getPlanIds() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const planIds = yield GenericFunctions_1.profitWellApiRequest.call(this, 'GET', '/metrics/plans');
                        for (const planId of planIds.plan_ids) {
                            returnData.push({
                                name: planId,
                                value: planId,
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
                    if (resource === 'company') {
                        if (operation === 'getSetting') {
                            responseData = yield GenericFunctions_1.profitWellApiRequest.call(this, 'GET', `/company/settings/`);
                        }
                    }
                    if (resource === 'metric') {
                        if (operation === 'get') {
                            const type = this.getNodeParameter('type', i);
                            const simple = this.getNodeParameter('simple', 0);
                            if (type === 'daily') {
                                qs.month = this.getNodeParameter('month', i);
                            }
                            const options = this.getNodeParameter('options', i);
                            Object.assign(qs, options);
                            if (qs.dailyMetrics) {
                                qs.metrics = qs.dailyMetrics.join(',');
                                delete qs.dailyMetrics;
                            }
                            if (qs.monthlyMetrics) {
                                qs.metrics = qs.monthlyMetrics.join(',');
                                delete qs.monthlyMetrics;
                            }
                            responseData = yield GenericFunctions_1.profitWellApiRequest.call(this, 'GET', `/metrics/${type}`, {}, qs);
                            responseData = responseData.data;
                            if (simple === true) {
                                if (type === 'daily') {
                                    responseData = (0, GenericFunctions_1.simplifyDailyMetrics)(responseData);
                                }
                                else {
                                    responseData = (0, GenericFunctions_1.simplifyMontlyMetrics)(responseData);
                                }
                            }
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
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
exports.ProfitWell = ProfitWell;
