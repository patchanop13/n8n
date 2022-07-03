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
exports.Strava = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ActivityDescription_1 = require("./ActivityDescription");
const moment_1 = __importDefault(require("moment"));
class Strava {
    constructor() {
        this.description = {
            displayName: 'Strava',
            name: 'strava',
            icon: 'file:strava.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Strava API',
            defaults: {
                name: 'Strava',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'stravaOAuth2Api',
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
                            name: 'Activity',
                            value: 'activity',
                        },
                    ],
                    default: 'activity',
                },
                ...ActivityDescription_1.activityOperations,
                ...ActivityDescription_1.activityFields,
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'activity') {
                        //https://developers.strava.com/docs/reference/#api-Activities-createActivity
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            const startDate = this.getNodeParameter('startDate', i);
                            const elapsedTime = this.getNodeParameter('elapsedTime', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.trainer === true) {
                                additionalFields.trainer = 1;
                            }
                            if (additionalFields.commute === true) {
                                additionalFields.commute = 1;
                            }
                            const body = {
                                name,
                                type,
                                start_date_local: (0, moment_1.default)(startDate).toISOString(),
                                elapsed_time: elapsedTime,
                            };
                            Object.assign(body, additionalFields);
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'POST', '/activities', body);
                        }
                        //https://developers.strava.com/docs/reference/#api-Activities-getActivityById
                        if (operation === 'get') {
                            const activityId = this.getNodeParameter('activityId', i);
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}`);
                        }
                        if (['getLaps', 'getZones', 'getKudos', 'getComments'].includes(operation)) {
                            const path = {
                                'getComments': 'comments',
                                'getZones': 'zones',
                                'getKudos': 'kudos',
                                'getLaps': 'laps',
                            };
                            const activityId = this.getNodeParameter('activityId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}/${path[operation]}`);
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
                        }
                        //https://developers.strava.com/docs/reference/#api-Streams-getActivityStreams
                        if (operation === 'getStreams') {
                            const activityId = this.getNodeParameter('activityId', i);
                            const keys = this.getNodeParameter('keys', i);
                            qs.keys = keys.toString();
                            qs.key_by_type = true;
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}/streams`, {}, qs);
                        }
                        //https://developers.mailerlite.com/reference#subscribers
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.stravaApiRequestAllItems.call(this, 'GET', `/activities`, {}, qs);
                            }
                            else {
                                qs.per_page = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities`, {}, qs);
                            }
                        }
                        //https://developers.strava.com/docs/reference/#api-Activities-updateActivityById
                        if (operation === 'update') {
                            const activityId = this.getNodeParameter('activityId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.trainer === true) {
                                updateFields.trainer = 1;
                            }
                            if (updateFields.commute === true) {
                                updateFields.commute = 1;
                            }
                            const body = {};
                            Object.assign(body, updateFields);
                            responseData = yield GenericFunctions_1.stravaApiRequest.call(this, 'PUT', `/activities/${activityId}`, body);
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
exports.Strava = Strava;
