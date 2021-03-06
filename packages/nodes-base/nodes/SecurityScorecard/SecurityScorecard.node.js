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
exports.SecurityScorecard = void 0;
const CompanyDescription_1 = require("./descriptions/CompanyDescription");
const IndustryDescription_1 = require("./descriptions/IndustryDescription");
const InviteDescription_1 = require("./descriptions/InviteDescription");
const PortfolioDescription_1 = require("./descriptions/PortfolioDescription");
const PortfolioCompanyDescription_1 = require("./descriptions/PortfolioCompanyDescription");
const ReportDescription_1 = require("./descriptions/ReportDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class SecurityScorecard {
    constructor() {
        this.description = {
            displayName: 'SecurityScorecard',
            name: 'securityScorecard',
            icon: 'file:securityScorecard.svg',
            group: ['transform'],
            subtitle: '={{$parameter["operation"]}} : {{$parameter["resource"]}}',
            version: 1,
            description: 'Consume SecurityScorecard API',
            defaults: {
                name: 'SecurityScorecard',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'securityScorecardApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    required: true,
                    options: [
                        {
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Industry',
                            value: 'industry',
                        },
                        {
                            name: 'Invite',
                            value: 'invite',
                        },
                        {
                            name: 'Portfolio',
                            value: 'portfolio',
                        },
                        {
                            name: 'Portfolio Company',
                            value: 'portfolioCompany',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                    ],
                    default: 'company',
                },
                // Company
                ...CompanyDescription_1.companyOperations,
                ...CompanyDescription_1.companyFields,
                // Industry
                ...IndustryDescription_1.industryOperations,
                ...IndustryDescription_1.industryFields,
                // Invite
                ...InviteDescription_1.inviteOperations,
                ...InviteDescription_1.inviteFields,
                // Portfolio
                ...PortfolioDescription_1.portfolioOperations,
                ...PortfolioDescription_1.portfolioFields,
                // Portfolio Company
                ...PortfolioCompanyDescription_1.portfolioCompanyOperations,
                ...PortfolioCompanyDescription_1.portfolioCompanyFields,
                // Report
                ...ReportDescription_1.reportOperations,
                ...ReportDescription_1.reportFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const length = items.length;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                if (resource === 'portfolio') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i);
                        const description = this.getNodeParameter('description', i);
                        const privacy = this.getNodeParameter('privacy', i);
                        const body = {
                            name,
                            description,
                            privacy,
                        };
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'POST', 'portfolios', body);
                        returnData.push(responseData);
                    }
                    if (operation === 'delete') {
                        const portfolioId = this.getNodeParameter('portfolioId', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'DELETE', `portfolios/${portfolioId}`);
                        returnData.push({ success: true });
                    }
                    if (operation === 'update') {
                        const portfolioId = this.getNodeParameter('portfolioId', i);
                        const name = this.getNodeParameter('name', i);
                        const description = this.getNodeParameter('description', i);
                        const privacy = this.getNodeParameter('privacy', i);
                        const body = {
                            name,
                            description,
                            privacy,
                        };
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'PUT', `portfolios/${portfolioId}`, body);
                        returnData.push(responseData);
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', 'portfolios');
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (resource === 'portfolioCompany') {
                    if (operation === 'add') {
                        const portfolioId = this.getNodeParameter('portfolioId', i);
                        const domain = this.getNodeParameter('domain', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'PUT', `portfolios/${portfolioId}/companies/${domain}`);
                        returnData.push(responseData);
                    }
                    if (operation === 'remove') {
                        const portfolioId = this.getNodeParameter('portfolioId', i);
                        const domain = this.getNodeParameter('domain', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'DELETE', `portfolios/${portfolioId}/companies/${domain}`);
                        returnData.push({ success: true });
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const portfolioId = this.getNodeParameter('portfolioId', i);
                        const filterParams = this.getNodeParameter('filters', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `portfolios/${portfolioId}/companies`, {}, filterParams);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (resource === 'report') {
                    if (operation === 'download') {
                        const reportUrl = this.getNodeParameter('url', i);
                        const response = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', '', {}, {}, reportUrl, { encoding: null, resolveWithFullResponse: true });
                        let mimeType;
                        if (response.headers['content-type']) {
                            mimeType = response.headers['content-type'];
                        }
                        const newItem = {
                            json: items[i].json,
                            binary: {},
                        };
                        if (items[i].binary !== undefined) {
                            // Create a shallow copy of the binary data so that the old
                            // data references which do not get changed still stay behind
                            // but the incoming data does not get changed.
                            Object.assign(newItem.binary, items[i].binary);
                        }
                        items[i] = newItem;
                        const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                        const fileName = reportUrl.split('/').pop();
                        const data = Buffer.from(response.body, 'utf8');
                        items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(data, fileName, mimeType);
                    }
                    if (operation === 'generate') {
                        const reportType = this.getNodeParameter('report', i);
                        let body = {};
                        if (reportType !== 'portfolio') {
                            body['scorecard_identifier'] = this.getNodeParameter('scorecardIdentifier', i);
                        }
                        else {
                            body['portfolio_id'] = this.getNodeParameter('portfolioId', i);
                        }
                        if (reportType === 'events-json') {
                            body['date'] = this.getNodeParameter('date', i);
                        }
                        if (['issues', 'portfolio'].indexOf(reportType) > -1) {
                            body['format'] = this.getNodeParameter('options.format', i) || 'pdf';
                        }
                        if (['detailed', 'summary'].indexOf(reportType) > -1) {
                            body['branding'] = this.getNodeParameter('branding', i);
                        }
                        // json reports want the params differently
                        if (['events-json', 'full-scorecard-json'].indexOf(reportType) > -1) {
                            body = { params: body };
                        }
                        if (reportType === 'scorecard-footprint') {
                            const options = this.getNodeParameter('options', i);
                            Object.assign(body, options);
                        }
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'POST', `reports/${reportType}`, body);
                        returnData.push(responseData);
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', 'reports/recent');
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (resource === 'invite') {
                    if (operation === 'create') {
                        const body = {
                            email: this.getNodeParameter('email', i),
                            first_name: this.getNodeParameter('firstName', i),
                            last_name: this.getNodeParameter('lastName', i),
                            message: this.getNodeParameter('message', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        Object.assign(body, additionalFields);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'POST', `invitations`, body);
                        returnData.push(responseData);
                    }
                }
                if (resource === 'industry') {
                    if (operation === 'getScore') {
                        const industry = this.getNodeParameter('industry', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `industries/${industry}/score`);
                        returnData.push(responseData);
                    }
                    if (operation === 'getFactor') {
                        const simple = this.getNodeParameter('simple', 0);
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const industry = this.getNodeParameter('industry', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `industries/${industry}/history/factors`);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplify)(responseData);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                    if (operation === 'getFactorHistorical') {
                        const simple = this.getNodeParameter('simple', 0);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const industry = this.getNodeParameter('industry', i);
                        const options = this.getNodeParameter('options', i);
                        // Convert to YYYY-MM-DD
                        if (options['from']) {
                            options['from'] = (0, moment_1.default)(options['from']).format('YYYY-MM-DD');
                        }
                        if (options['to']) {
                            options['to'] = (0, moment_1.default)(options['to']).format('YYYY-MM-DD');
                        }
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `industries/${industry}/history/factors`, {}, options);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplify)(responseData);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
                if (resource === 'company') {
                    if (operation === 'getScorecard') {
                        const scorecardIdentifier = this.getNodeParameter('scorecardIdentifier', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `companies/${scorecardIdentifier}`);
                        returnData.push(responseData);
                    }
                    if (operation === 'getFactor') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const scorecardIdentifier = this.getNodeParameter('scorecardIdentifier', i);
                        const filterParams = this.getNodeParameter('filters', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `companies/${scorecardIdentifier}/factors`, {}, filterParams);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                    if (operation === 'getFactorHistorical') {
                        const simple = this.getNodeParameter('simple', 0);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const scorecardIdentifier = this.getNodeParameter('scorecardIdentifier', i);
                        const options = this.getNodeParameter('options', i);
                        // Convert to YYYY-MM-DD
                        if (options['date_from']) {
                            options['date_from'] = (0, moment_1.default)(options['date_from']).format('YYYY-MM-DD');
                        }
                        if (options['date_to']) {
                            options['date_to'] = (0, moment_1.default)(options['date_to']).format('YYYY-MM-DD');
                        }
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `companies/${scorecardIdentifier}/history/factors/score`, {}, options);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplify)(responseData);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                    if (operation === 'getHistoricalScore') {
                        const simple = this.getNodeParameter('simple', 0);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const scorecardIdentifier = this.getNodeParameter('scorecardIdentifier', i);
                        const options = this.getNodeParameter('options', i);
                        // for some reason the params are different between these two APis :/
                        if (options['date_from']) {
                            options['from'] = (0, moment_1.default)(options['date_from']).format('YYYY-MM-DD');
                            delete options['date_from'];
                        }
                        if (options['date_to']) {
                            options['to'] = (0, moment_1.default)(options['date_to']).format('YYYY-MM-DD');
                            delete options['date_to'];
                        }
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `companies/${scorecardIdentifier}/history/factors/score`, {}, options);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        if (simple === true) {
                            responseData = (0, GenericFunctions_1.simplify)(responseData);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                    if (operation === 'getScorePlan') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const scorecardIdentifier = this.getNodeParameter('scorecardIdentifier', i);
                        const targetScore = this.getNodeParameter('score', i);
                        responseData = yield GenericFunctions_1.scorecardApiRequest.call(this, 'GET', `companies/${scorecardIdentifier}/score-plans/by-target/${targetScore}`);
                        responseData = responseData.entries;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                        returnData.push.apply(returnData, responseData);
                    }
                }
            }
            // Handle file download output data differently
            if (resource === 'report' && operation === 'download') {
                return this.prepareOutputData(items);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.SecurityScorecard = SecurityScorecard;
