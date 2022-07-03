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
exports.GoogleAnalytics = void 0;
const ReportDescription_1 = require("./ReportDescription");
const UserActivityDescription_1 = require("./UserActivityDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class GoogleAnalytics {
    constructor() {
        this.description = {
            displayName: 'Google Analytics',
            name: 'googleAnalytics',
            icon: 'file:analytics.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Use the Google Analytics API',
            defaults: {
                name: 'Google Analytics',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleAnalyticsOAuth2',
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
                            name: 'Report',
                            value: 'report',
                        },
                        {
                            name: 'User Activity',
                            value: 'userActivity',
                        },
                    ],
                    default: 'report',
                },
                //-------------------------------
                // Reports Operations
                //-------------------------------
                ...ReportDescription_1.reportOperations,
                ...ReportDescription_1.reportFields,
                //-------------------------------
                // User Activity Operations
                //-------------------------------
                ...UserActivityDescription_1.userActivityOperations,
                ...UserActivityDescription_1.userActivityFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the dimensions to display them to user so that he can
                // select them easily
                getDimensions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { items: dimensions } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://www.googleapis.com/analytics/v3/metadata/ga/columns');
                        for (const dimesion of dimensions) {
                            if (dimesion.attributes.type === 'DIMENSION' && dimesion.attributes.status !== 'DEPRECATED') {
                                returnData.push({
                                    name: dimesion.attributes.uiName,
                                    value: dimesion.id,
                                    description: dimesion.attributes.description,
                                });
                            }
                        }
                        returnData.sort((a, b) => {
                            const aName = a.name.toLowerCase();
                            const bName = b.name.toLowerCase();
                            if (aName < bName) {
                                return -1;
                            }
                            if (aName > bName) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
                // Get all the views to display them to user so that he can
                // select them easily
                getViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { items } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://www.googleapis.com/analytics/v3/management/accounts/~all/webproperties/~all/profiles');
                        for (const item of items) {
                            returnData.push({
                                name: item.name,
                                value: item.id,
                                description: item.websiteUrl,
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let method = '';
            const qs = {};
            let endpoint = '';
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'report') {
                        if (operation === 'get') {
                            //https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
                            method = 'POST';
                            endpoint = '/v4/reports:batchGet';
                            const viewId = this.getNodeParameter('viewId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const simple = this.getNodeParameter('simple', i);
                            const body = {
                                viewId,
                            };
                            if (additionalFields.useResourceQuotas) {
                                qs.useResourceQuotas = additionalFields.useResourceQuotas;
                            }
                            if (additionalFields.dateRangesUi) {
                                const dateValues = additionalFields.dateRangesUi.dateRanges;
                                if (dateValues) {
                                    const start = dateValues.startDate;
                                    const end = dateValues.endDate;
                                    Object.assign(body, {
                                        dateRanges: [
                                            {
                                                startDate: (0, moment_timezone_1.default)(start).utc().format('YYYY-MM-DD'),
                                                endDate: (0, moment_timezone_1.default)(end).utc().format('YYYY-MM-DD'),
                                            },
                                        ],
                                    });
                                }
                            }
                            if (additionalFields.metricsUi) {
                                const metrics = additionalFields.metricsUi.metricValues;
                                body.metrics = metrics;
                            }
                            if (additionalFields.dimensionUi) {
                                const dimensions = additionalFields.dimensionUi.dimensionValues;
                                if (dimensions) {
                                    body.dimensions = dimensions;
                                }
                            }
                            if (additionalFields.dimensionFiltersUi) {
                                const dimensionFilters = additionalFields.dimensionFiltersUi.filterValues;
                                if (dimensionFilters) {
                                    dimensionFilters.forEach(filter => filter.expressions = [filter.expressions]);
                                    body.dimensionFilterClauses = { filters: dimensionFilters };
                                }
                            }
                            if (additionalFields.includeEmptyRows) {
                                Object.assign(body, { includeEmptyRows: additionalFields.includeEmptyRows });
                            }
                            if (additionalFields.hideTotals) {
                                Object.assign(body, { hideTotals: additionalFields.hideTotals });
                            }
                            if (additionalFields.hideValueRanges) {
                                Object.assign(body, { hideTotals: additionalFields.hideTotals });
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'reports', method, endpoint, { reportRequests: [body] }, qs);
                            }
                            else {
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, { reportRequests: [body] }, qs);
                                responseData = responseData.reports;
                            }
                            if (simple === true) {
                                responseData = (0, GenericFunctions_1.simplify)(responseData);
                            }
                            else if (returnAll === true && responseData.length > 1) {
                                responseData = (0, GenericFunctions_1.merge)(responseData);
                            }
                        }
                    }
                    if (resource === 'userActivity') {
                        if (operation === 'search') {
                            //https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/userActivity/search
                            method = 'POST';
                            endpoint = '/v4/userActivity:search';
                            const viewId = this.getNodeParameter('viewId', i);
                            const userId = this.getNodeParameter('userId', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                viewId,
                                user: {
                                    userId,
                                },
                            };
                            if (additionalFields.activityTypes) {
                                Object.assign(body, { activityTypes: additionalFields.activityTypes });
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'sessions', method, endpoint, body);
                            }
                            else {
                                body.pageSize = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, method, endpoint, body);
                                responseData = responseData.sessions;
                            }
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
exports.GoogleAnalytics = GoogleAnalytics;
