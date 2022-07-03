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
exports.Oura = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ProfileDescription_1 = require("./ProfileDescription");
const SummaryDescription_1 = require("./SummaryDescription");
const moment_1 = __importDefault(require("moment"));
class Oura {
    constructor() {
        this.description = {
            displayName: 'Oura',
            name: 'oura',
            icon: 'file:oura.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Oura API',
            defaults: {
                name: 'Oura',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'ouraApi',
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
                            name: 'Profile',
                            value: 'profile',
                        },
                        {
                            name: 'Summary',
                            value: 'summary',
                        },
                    ],
                    default: 'summary',
                },
                ...ProfileDescription_1.profileOperations,
                ...SummaryDescription_1.summaryOperations,
                ...SummaryDescription_1.summaryFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            let responseData;
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                if (resource === 'profile') {
                    // *********************************************************************
                    //                             profile
                    // *********************************************************************
                    // https://cloud.ouraring.com/docs/personal-info
                    if (operation === 'get') {
                        // ----------------------------------
                        //         profile: get
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/userinfo');
                    }
                }
                else if (resource === 'summary') {
                    // *********************************************************************
                    //                             summary
                    // *********************************************************************
                    // https://cloud.ouraring.com/docs/daily-summaries
                    const qs = {};
                    const { start, end } = this.getNodeParameter('filters', i);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    if (start) {
                        qs.start = (0, moment_1.default)(start).format('YYYY-MM-DD');
                    }
                    if (end) {
                        qs.end = (0, moment_1.default)(end).format('YYYY-MM-DD');
                    }
                    if (operation === 'getActivity') {
                        // ----------------------------------
                        //       profile: getActivity
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/activity', {}, qs);
                        responseData = responseData.activity;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    else if (operation === 'getReadiness') {
                        // ----------------------------------
                        //       profile: getReadiness
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/readiness', {}, qs);
                        responseData = responseData.readiness;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    else if (operation === 'getSleep') {
                        // ----------------------------------
                        //         profile: getSleep
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/sleep', {}, qs);
                        responseData = responseData.sleep;
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Oura = Oura;
