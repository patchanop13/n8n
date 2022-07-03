"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loadRegistranMultiChoiceQuestions = exports.loadAnswers = exports.loadRegistranSimpleQuestions = exports.loadWebinarSessions = exports.loadWebinars = exports.handleGetAll = exports.goToWebinarApiRequestAllItems = exports.goToWebinarApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_1 = __importDefault(require("moment"));
const losslessJSON = __importStar(require("lossless-json"));
/**
 * Make an authenticated API request to GoToWebinar.
 */
function goToWebinarApiRequest(method, endpoint, qs, body, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const operation = this.getNodeParameter('operation', 0);
        const resource = this.getNodeParameter('resource', 0);
        const options = {
            headers: {
                'user-agent': 'n8n',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            uri: `https://api.getgo.com/G2W/rest/v2/${endpoint}`,
            qs,
            body: JSON.stringify(body),
            json: false,
        };
        if (resource === 'session' && operation === 'getAll') {
            options.headers['Accept'] = 'application/vnd.citrix.g2wapi-v1.1+json';
        }
        if (['GET', 'DELETE'].includes(method)) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        try {
            const response = yield this.helpers.requestOAuth2.call(this, 'goToWebinarOAuth2Api', options, { tokenExpiredStatusCode: 403 });
            if (response === '') {
                return {};
            }
            // https://stackoverflow.com/questions/62190724/getting-gotowebinar-registrant
            return losslessJSON.parse(response, convertLosslessNumber);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.goToWebinarApiRequest = goToWebinarApiRequest;
/**
 * Make an authenticated API request to GoToWebinar and return all results.
 */
function goToWebinarApiRequestAllItems(method, endpoint, qs, body, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceToResponseKey = {
            session: 'sessionInfoResources',
            webinar: 'webinars',
        };
        const key = resourceToResponseKey[resource];
        let returnData = [];
        let responseData;
        do {
            responseData = yield goToWebinarApiRequest.call(this, method, endpoint, qs, body);
            if (responseData.page && parseInt(responseData.page.totalElements, 10) === 0) {
                return [];
            }
            else if (responseData._embedded && responseData._embedded[key]) {
                returnData.push(...responseData._embedded[key]);
            }
            else {
                returnData.push(...responseData);
            }
            if (qs.limit && returnData.length >= qs.limit) {
                returnData = returnData.splice(0, qs.limit);
                return returnData;
            }
        } while (responseData.totalElements && parseInt(responseData.totalElements, 10) > returnData.length);
        return returnData;
    });
}
exports.goToWebinarApiRequestAllItems = goToWebinarApiRequestAllItems;
function handleGetAll(endpoint, qs, body, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (!returnAll) {
            qs.limit = this.getNodeParameter('limit', 0);
        }
        return yield goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, body, resource);
    });
}
exports.handleGetAll = handleGetAll;
function loadWebinars() {
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
        const endpoint = `accounts/${oauthTokenData.account_key}/webinars`;
        const qs = {
            fromTime: (0, moment_1.default)().subtract(1, 'years').format(),
            toTime: (0, moment_1.default)().add(1, 'years').format(),
        };
        const resourceItems = yield goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, 'webinar');
        const returnData = [];
        resourceItems.forEach((item) => {
            returnData.push({
                name: item.subject,
                value: item.webinarKey,
            });
        });
        return returnData;
    });
}
exports.loadWebinars = loadWebinars;
function loadWebinarSessions() {
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
        const webinarKey = this.getCurrentNodeParameter('webinarKey');
        const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/sessions`;
        const resourceItems = yield goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, {}, {}, 'session');
        const returnData = [];
        resourceItems.forEach((item) => {
            returnData.push({
                name: `Date: ${(0, moment_1.default)(item.startTime).format('MM-DD-YYYY')} | From: ${(0, moment_1.default)(item.startTime).format('LT')} - To: ${(0, moment_1.default)(item.endTime).format('LT')}`,
                value: item.sessionKey,
            });
        });
        return returnData;
    });
}
exports.loadWebinarSessions = loadWebinarSessions;
function loadRegistranSimpleQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
        const webinarkey = this.getNodeParameter('webinarKey');
        const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;
        const { questions } = yield goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
        const returnData = [];
        questions.forEach((item) => {
            if (item.type === 'shortAnswer') {
                returnData.push({
                    name: item.question,
                    value: item.questionKey,
                });
            }
        });
        return returnData;
    });
}
exports.loadRegistranSimpleQuestions = loadRegistranSimpleQuestions;
function loadAnswers() {
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
        const webinarKey = this.getCurrentNodeParameter('webinarKey');
        const questionKey = this.getCurrentNodeParameter('questionKey');
        const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/registrants/fields`;
        const { questions } = yield goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
        const returnData = [];
        questions.forEach((item) => {
            if (item.type === 'multiChoice' && item.questionKey === questionKey) {
                for (const answer of item.answers) {
                    returnData.push({
                        name: answer.answer,
                        value: answer.answerKey,
                    });
                }
            }
        });
        return returnData;
    });
}
exports.loadAnswers = loadAnswers;
function loadRegistranMultiChoiceQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
        const webinarkey = this.getNodeParameter('webinarKey');
        const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;
        const { questions } = yield goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
        const returnData = [];
        questions.forEach((item) => {
            if (item.type === 'multipleChoice') {
                returnData.push({
                    name: item.question,
                    value: item.questionKey,
                });
            }
        });
        return returnData;
    });
}
exports.loadRegistranMultiChoiceQuestions = loadRegistranMultiChoiceQuestions;
// tslint:disable-next-line: no-any
function convertLosslessNumber(key, value) {
    if (value && value.isLosslessNumber) {
        return value.toString();
    }
    else {
        return value;
    }
}
