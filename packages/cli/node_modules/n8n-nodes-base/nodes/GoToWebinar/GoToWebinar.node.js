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
exports.GoToWebinar = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const lodash_1 = require("lodash");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class GoToWebinar {
    constructor() {
        this.description = {
            displayName: 'GoToWebinar',
            name: 'goToWebinar',
            icon: 'file:gotowebinar.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the GoToWebinar API',
            defaults: {
                name: 'GoToWebinar',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'goToWebinarOAuth2Api',
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
                            name: 'Attendee',
                            value: 'attendee',
                        },
                        {
                            name: 'Co-Organizer',
                            value: 'coorganizer',
                        },
                        {
                            name: 'Panelist',
                            value: 'panelist',
                        },
                        {
                            name: 'Registrant',
                            value: 'registrant',
                        },
                        {
                            name: 'Session',
                            value: 'session',
                        },
                        {
                            name: 'Webinar',
                            value: 'webinar',
                        },
                    ],
                    default: 'attendee',
                },
                ...descriptions_1.attendeeOperations,
                ...descriptions_1.attendeeFields,
                ...descriptions_1.coorganizerOperations,
                ...descriptions_1.coorganizerFields,
                ...descriptions_1.panelistOperations,
                ...descriptions_1.panelistFields,
                ...descriptions_1.registrantOperations,
                ...descriptions_1.registrantFields,
                ...descriptions_1.sessionOperations,
                ...descriptions_1.sessionFields,
                ...descriptions_1.webinarOperations,
                ...descriptions_1.webinarFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getWebinars() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadWebinars.call(this);
                    });
                },
                getAnswers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadAnswers.call(this);
                    });
                },
                getWebinarSessions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadWebinarSessions.call(this);
                    });
                },
                // Get all the timezones to display them to user so that he can
                // select them easily
                getTimezones() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const timezone of moment_timezone_1.default.tz.names()) {
                            const timezoneName = timezone;
                            const timezoneId = timezone;
                            returnData.push({
                                name: timezoneName,
                                value: timezoneId,
                            });
                        }
                        return returnData;
                    });
                },
                getRegistranSimpleQuestions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadRegistranSimpleQuestions.call(this);
                    });
                },
                getRegistranMultiChoiceQuestions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadRegistranMultiChoiceQuestions.call(this);
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            const { oauthTokenData } = yield this.getCredentials('goToWebinarOAuth2Api');
            const accountKey = oauthTokenData.account_key;
            const organizerKey = oauthTokenData.organizer_key;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'attendee') {
                        // *********************************************************************
                        //                            attendee
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Attendees
                        if (operation === 'get') {
                            // ----------------------------------
                            //         attendee: get
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const sessionKey = this.getNodeParameter('sessionKey', i);
                            const registrantKey = this.getNodeParameter('registrantKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/attendees/${registrantKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        attendee: getAll
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const sessionKey = this.getNodeParameter('sessionKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/attendees`;
                            responseData = yield GenericFunctions_1.handleGetAll.call(this, endpoint, {}, {}, resource);
                        }
                        else if (operation === 'getDetails') {
                            // ----------------------------------
                            //     attendee: getDetails
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const sessionKey = this.getNodeParameter('sessionKey', i);
                            const registrantKey = this.getNodeParameter('registrantKey', i);
                            const details = this.getNodeParameter('details', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/attendees/${registrantKey}/${details}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                    }
                    else if (resource === 'coorganizer') {
                        // *********************************************************************
                        //                            coorganizer
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Co-organizers
                        if (operation === 'create') {
                            // ----------------------------------
                            //        coorganizer: create
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const body = {
                                external: this.getNodeParameter('isExternal', i),
                            };
                            if (body.external === false) {
                                body.organizerKey = this.getNodeParameter('organizerKey', i);
                            }
                            if (body.external === true) {
                                body.givenName = this.getNodeParameter('givenName', i);
                                body.email = this.getNodeParameter('email', i);
                            }
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/coorganizers`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, {}, [body]);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //       coorganizer: delete
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const coorganizerKey = this.getNodeParameter('coorganizerKey', i);
                            const qs = {
                                external: this.getNodeParameter('isExternal', i),
                            };
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/coorganizers/${coorganizerKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'DELETE', endpoint, qs, {});
                            responseData = { success: true };
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        coorganizer: getAll
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/coorganizers`;
                            responseData = yield GenericFunctions_1.handleGetAll.call(this, endpoint, {}, {}, resource);
                        }
                        else if (operation === 'reinvite') {
                            // ----------------------------------
                            //       coorganizer: reinvite
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const coorganizerKey = this.getNodeParameter('coorganizerKey', i);
                            const qs = {
                                external: this.getNodeParameter('isExternal', i),
                            };
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/coorganizers/${coorganizerKey}/resendInvitation`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, qs, {});
                            responseData = { success: true };
                        }
                    }
                    else if (resource === 'panelist') {
                        // *********************************************************************
                        //                            panelist
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Panelists
                        if (operation === 'create') {
                            // ----------------------------------
                            //         panelist: create
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const body = [
                                {
                                    name: this.getNodeParameter('name', i),
                                    email: this.getNodeParameter('email', i),
                                },
                            ];
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/panelists`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, {}, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         panelist: delete
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const panelistKey = this.getNodeParameter('panelistKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/panelists/${panelistKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'DELETE', endpoint, {}, {});
                            responseData = { success: true };
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         panelist: getAll
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/panelists`;
                            responseData = yield GenericFunctions_1.handleGetAll.call(this, endpoint, {}, {}, resource);
                        }
                        else if (operation === 'reinvite') {
                            // ----------------------------------
                            //        panelist: reinvite
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const panelistKey = this.getNodeParameter('panelistKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/panelists/${panelistKey}/resendInvitation`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, {}, {});
                            responseData = { success: true };
                        }
                    }
                    else if (resource === 'registrant') {
                        // *********************************************************************
                        //                            registrant
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Registrants
                        if (operation === 'create') {
                            // ----------------------------------
                            //         registrant: create
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const qs = {};
                            const body = {
                                firstName: this.getNodeParameter('firstName', i),
                                lastName: this.getNodeParameter('lastName', i),
                                email: this.getNodeParameter('email', i),
                                responses: [],
                            };
                            let additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.resendConfirmation) {
                                qs.resendConfirmation = additionalFields.resendConfirmation;
                                additionalFields = (0, lodash_1.omit)(additionalFields, ['resendConfirmation']);
                            }
                            if (additionalFields.fullAddress) {
                                Object.assign(body, additionalFields.fullAddress.details);
                                additionalFields = (0, lodash_1.omit)(additionalFields, ['fullAddress']);
                            }
                            if (additionalFields.simpleResponses) {
                                //@ts-ignore
                                body.responses.push(...additionalFields.simpleResponses.details);
                                additionalFields = (0, lodash_1.omit)(additionalFields, ['simpleResponses']);
                            }
                            if (additionalFields.multiChoiceResponses) {
                                //@ts-ignore
                                body.responses.push(...additionalFields.multiChoiceResponses.details);
                                additionalFields = (0, lodash_1.omit)(additionalFields, ['multiChoiceResponses']);
                            }
                            Object.assign(body, additionalFields);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/registrants`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, qs, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //        registrant: delete
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const registrantKey = this.getNodeParameter('registrantKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/registrants/${registrantKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'DELETE', endpoint, {}, {});
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //        registrant: get
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const registrantKey = this.getNodeParameter('registrantKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/registrants/${registrantKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //        registrant: getAll
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/registrants`;
                            responseData = yield GenericFunctions_1.handleGetAll.call(this, endpoint, {}, {}, resource);
                        }
                    }
                    else if (resource === 'session') {
                        // *********************************************************************
                        //                              session
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Sessions
                        if (operation === 'get') {
                            // ----------------------------------
                            //         session: get
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const sessionKey = this.getNodeParameter('sessionKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         session: getAll
                            // ----------------------------------
                            const qs = {};
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', 0);
                            }
                            const { webinarKey, times, } = this.getNodeParameter('additionalFields', i);
                            if (times) {
                                qs.fromTime = (0, moment_timezone_1.default)(times.timesProperties.fromTime).format();
                                qs.toTime = (0, moment_timezone_1.default)(times.timesProperties.toTime).format();
                            }
                            else {
                                qs.fromTime = (0, moment_timezone_1.default)().subtract(1, 'years').format();
                                qs.toTime = (0, moment_timezone_1.default)().format();
                            }
                            if (webinarKey !== undefined) {
                                const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions`;
                                responseData = yield GenericFunctions_1.goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, resource);
                            }
                            else {
                                const endpoint = `organizers/${organizerKey}/sessions`;
                                responseData = yield GenericFunctions_1.goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, resource);
                            }
                        }
                        else if (operation === 'getDetails') {
                            // ----------------------------------
                            //         session: getDetails
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const sessionKey = this.getNodeParameter('sessionKey', i);
                            const details = this.getNodeParameter('details', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/${details}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                    }
                    else if (resource === 'webinar') {
                        // *********************************************************************
                        //                               webinar
                        // *********************************************************************
                        // https://developer.goto.com/GoToWebinarV2/#tag/Webinars
                        if (operation === 'create') {
                            // ----------------------------------
                            //         webinar: create
                            // ----------------------------------
                            const timesProperties = this.getNodeParameter('times.timesProperties', i, []);
                            const body = {
                                subject: this.getNodeParameter('subject', i),
                                times: timesProperties,
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                            const endpoint = `organizers/${organizerKey}/webinars`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'POST', endpoint, {}, body);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         webinar: delete
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const { sendCancellationEmails } = this.getNodeParameter('additionalFields', i);
                            const qs = {};
                            if (sendCancellationEmails) {
                                qs.sendCancellationEmails = sendCancellationEmails;
                            }
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}`;
                            yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'DELETE', endpoint, qs, {});
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         webinar: get
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         webinar: getAll
                            // ----------------------------------
                            const qs = {};
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                qs.limit = this.getNodeParameter('limit', 0);
                            }
                            const { times } = this.getNodeParameter('additionalFields', i);
                            if (times) {
                                qs.fromTime = (0, moment_timezone_1.default)(times.timesProperties.fromTime).format();
                                qs.toTime = (0, moment_timezone_1.default)(times.timesProperties.toTime).format();
                            }
                            else {
                                qs.fromTime = (0, moment_timezone_1.default)().subtract(1, 'years').format();
                                qs.toTime = (0, moment_timezone_1.default)().format();
                            }
                            const endpoint = `accounts/${accountKey}/webinars`;
                            responseData = yield GenericFunctions_1.goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, resource);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         webinar: update
                            // ----------------------------------
                            const webinarKey = this.getNodeParameter('webinarKey', i);
                            const qs = {
                                notifyParticipants: this.getNodeParameter('notifyParticipants', i),
                            };
                            let body = {};
                            let updateFields = this.getNodeParameter('updateFields', i);
                            if (updateFields.times) {
                                const { times } = updateFields;
                                body = {
                                    times: times.timesProperties,
                                };
                                updateFields = (0, lodash_1.omit)(updateFields, ['times']);
                            }
                            Object.assign(body, updateFields);
                            if ((0, lodash_1.isEmpty)(updateFields)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            const endpoint = `organizers/${organizerKey}/webinars/${webinarKey}`;
                            yield GenericFunctions_1.goToWebinarApiRequest.call(this, 'PUT', endpoint, qs, body);
                            responseData = { success: true };
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
exports.GoToWebinar = GoToWebinar;
