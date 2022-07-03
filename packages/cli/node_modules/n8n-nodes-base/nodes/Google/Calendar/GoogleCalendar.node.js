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
exports.GoogleCalendar = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const EventDescription_1 = require("./EventDescription");
const CalendarDescription_1 = require("./CalendarDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const uuid_1 = require("uuid");
class GoogleCalendar {
    constructor() {
        this.description = {
            displayName: 'Google Calendar',
            name: 'googleCalendar',
            icon: 'file:googleCalendar.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Google Calendar API',
            defaults: {
                name: 'Google Calendar',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleCalendarOAuth2Api',
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
                            name: 'Calendar',
                            value: 'calendar',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                    ],
                    default: 'event',
                },
                ...CalendarDescription_1.calendarOperations,
                ...CalendarDescription_1.calendarFields,
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the calendars to display them to user so that he can
                // select them easily
                getConferenceSolutations() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const calendar = this.getCurrentNodeParameter('calendar');
                        const posibleSolutions = {
                            'eventHangout': 'Google Hangout',
                            'eventNamedHangout': 'Google Hangout Classic',
                            'hangoutsMeet': 'Google Meet',
                        };
                        const { conferenceProperties: { allowedConferenceSolutionTypes } } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/users/me/calendarList/${calendar}`);
                        for (const solution of allowedConferenceSolutionTypes) {
                            returnData.push({
                                name: posibleSolutions[solution],
                                value: solution,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the calendars to display them to user so that he can
                // select them easily
                getCalendars() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const calendars = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/calendar/v3/users/me/calendarList');
                        for (const calendar of calendars) {
                            const calendarName = calendar.summary;
                            const calendarId = encodeURIComponent(calendar.id);
                            returnData.push({
                                name: calendarName,
                                value: calendarId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the colors to display them to user so that he can
                // select them easily
                getColors() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { event } = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', '/calendar/v3/colors');
                        for (const key of Object.keys(event)) {
                            const colorName = `Background: ${event[key].background} - Foreground: ${event[key].foreground}`;
                            const colorId = key;
                            returnData.push({
                                name: `${colorName}`,
                                value: colorId,
                            });
                        }
                        return returnData;
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
            },
        };
    }
    execute() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const timezone = this.getTimezone();
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'calendar') {
                        //https://developers.google.com/calendar/v3/reference/freebusy/query
                        if (operation === 'availability') {
                            const calendarId = this.getNodeParameter('calendar', i);
                            const timeMin = this.getNodeParameter('timeMin', i);
                            const timeMax = this.getNodeParameter('timeMax', i);
                            const options = this.getNodeParameter('options', i);
                            const outputFormat = options.outputFormat || 'availability';
                            const body = {
                                timeMin: (0, moment_timezone_1.default)(timeMin).utc().format(),
                                timeMax: (0, moment_timezone_1.default)(timeMax).utc().format(),
                                items: [
                                    {
                                        id: calendarId,
                                    },
                                ],
                                timeZone: options.timezone || timezone,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/calendar/v3/freeBusy`, body, {});
                            if (responseData.calendars[calendarId].errors) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData.calendars[calendarId]);
                            }
                            if (outputFormat === 'availability') {
                                responseData = {
                                    available: !responseData.calendars[calendarId].busy.length,
                                };
                            }
                            else if (outputFormat === 'bookedSlots') {
                                responseData = responseData.calendars[calendarId].busy;
                            }
                        }
                    }
                    if (resource === 'event') {
                        //https://developers.google.com/calendar/v3/reference/events/insert
                        if (operation === 'create') {
                            const calendarId = this.getNodeParameter('calendar', i);
                            const start = this.getNodeParameter('start', i);
                            const end = this.getNodeParameter('end', i);
                            const useDefaultReminders = this.getNodeParameter('useDefaultReminders', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.maxAttendees) {
                                qs.maxAttendees = additionalFields.maxAttendees;
                            }
                            if (additionalFields.sendNotifications) {
                                qs.sendNotifications = additionalFields.sendNotifications;
                            }
                            if (additionalFields.sendUpdates) {
                                qs.sendUpdates = additionalFields.sendUpdates;
                            }
                            const body = {
                                start: {
                                    dateTime: moment_timezone_1.default.tz(start, timezone).utc().format(),
                                    timeZone: timezone,
                                },
                                end: {
                                    dateTime: moment_timezone_1.default.tz(end, timezone).utc().format(),
                                    timeZone: timezone,
                                },
                            };
                            if (additionalFields.attendees) {
                                body.attendees = [];
                                additionalFields.attendees.forEach(attendee => {
                                    body.attendees.push.apply(body.attendees, attendee.split(',').map(a => a.trim()).map(email => ({ email })));
                                });
                            }
                            if (additionalFields.color) {
                                body.colorId = additionalFields.color;
                            }
                            if (additionalFields.description) {
                                body.description = additionalFields.description;
                            }
                            if (additionalFields.guestsCanInviteOthers) {
                                body.guestsCanInviteOthers = additionalFields.guestsCanInviteOthers;
                            }
                            if (additionalFields.guestsCanModify) {
                                body.guestsCanModify = additionalFields.guestsCanModify;
                            }
                            if (additionalFields.guestsCanSeeOtherGuests) {
                                body.guestsCanSeeOtherGuests = additionalFields.guestsCanSeeOtherGuests;
                            }
                            if (additionalFields.id) {
                                body.id = additionalFields.id;
                            }
                            if (additionalFields.location) {
                                body.location = additionalFields.location;
                            }
                            if (additionalFields.summary) {
                                body.summary = additionalFields.summary;
                            }
                            if (additionalFields.showMeAs) {
                                body.transparency = additionalFields.showMeAs;
                            }
                            if (additionalFields.visibility) {
                                body.visibility = additionalFields.visibility;
                            }
                            if (!useDefaultReminders) {
                                const reminders = this.getNodeParameter('remindersUi', i).remindersValues;
                                body.reminders = {
                                    useDefault: false,
                                };
                                if (reminders) {
                                    body.reminders.overrides = reminders;
                                }
                            }
                            if (additionalFields.allday) {
                                body.start = {
                                    date: timezone ?
                                        moment_timezone_1.default.tz(start, timezone).utc(true).format('YYYY-MM-DD') :
                                        moment_timezone_1.default.tz(start, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                                };
                                body.end = {
                                    date: timezone ?
                                        moment_timezone_1.default.tz(end, timezone).utc(true).format('YYYY-MM-DD') :
                                        moment_timezone_1.default.tz(end, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                                };
                            }
                            //exampel: RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10;UNTIL=20110701T170000Z
                            //https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
                            body.recurrence = [];
                            if (additionalFields.rrule) {
                                body.recurrence = [`RRULE:${additionalFields.rrule}`];
                            }
                            else {
                                if (additionalFields.repeatHowManyTimes &&
                                    additionalFields.repeatUntil) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `You can set either 'Repeat How Many Times' or 'Repeat Until' but not both`);
                                }
                                if (additionalFields.repeatFrecuency) {
                                    (_a = body.recurrence) === null || _a === void 0 ? void 0 : _a.push(`FREQ=${additionalFields.repeatFrecuency.toUpperCase()};`);
                                }
                                if (additionalFields.repeatHowManyTimes) {
                                    (_b = body.recurrence) === null || _b === void 0 ? void 0 : _b.push(`COUNT=${additionalFields.repeatHowManyTimes};`);
                                }
                                if (additionalFields.repeatUntil) {
                                    const repeatUntil = (0, moment_timezone_1.default)(additionalFields.repeatUntil)
                                        .utc()
                                        .format('YYYYMMDDTHHmmss');
                                    (_c = body.recurrence) === null || _c === void 0 ? void 0 : _c.push(`UNTIL=${repeatUntil}Z`);
                                }
                                if (body.recurrence.length !== 0) {
                                    body.recurrence = [`RRULE:${body.recurrence.join('')}`];
                                }
                            }
                            if (additionalFields.conferenceDataUi) {
                                const conferenceData = additionalFields.conferenceDataUi.conferenceDataValues;
                                if (conferenceData) {
                                    qs.conferenceDataVersion = 1;
                                    body.conferenceData = {
                                        createRequest: {
                                            requestId: (0, uuid_1.v4)(),
                                            conferenceSolution: {
                                                type: conferenceData.conferenceSolution,
                                            },
                                        },
                                    };
                                }
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/calendar/v3/calendars/${calendarId}/events`, body, qs);
                        }
                        //https://developers.google.com/calendar/v3/reference/events/delete
                        if (operation === 'delete') {
                            const calendarId = this.getNodeParameter('calendar', i);
                            const eventId = this.getNodeParameter('eventId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.sendUpdates) {
                                qs.sendUpdates = options.sendUpdates;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, {});
                            responseData = { success: true };
                        }
                        //https://developers.google.com/calendar/v3/reference/events/get
                        if (operation === 'get') {
                            const calendarId = this.getNodeParameter('calendar', i);
                            const eventId = this.getNodeParameter('eventId', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.maxAttendees) {
                                qs.maxAttendees = options.maxAttendees;
                            }
                            if (options.timeZone) {
                                qs.timeZone = options.timeZone;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, {}, qs);
                        }
                        //https://developers.google.com/calendar/v3/reference/events/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const calendarId = this.getNodeParameter('calendar', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.iCalUID) {
                                qs.iCalUID = options.iCalUID;
                            }
                            if (options.maxAttendees) {
                                qs.maxAttendees = options.maxAttendees;
                            }
                            if (options.orderBy) {
                                qs.orderBy = options.orderBy;
                            }
                            if (options.query) {
                                qs.q = options.query;
                            }
                            if (options.showDeleted) {
                                qs.showDeleted = options.showDeleted;
                            }
                            if (options.showHiddenInvitations) {
                                qs.showHiddenInvitations = options.showHiddenInvitations;
                            }
                            if (options.singleEvents) {
                                qs.singleEvents = options.singleEvents;
                            }
                            if (options.timeMax) {
                                qs.timeMax = options.timeMax;
                            }
                            if (options.timeMin) {
                                qs.timeMin = options.timeMin;
                            }
                            if (options.timeZone) {
                                qs.timeZone = options.timeZone;
                            }
                            if (options.updatedMin) {
                                qs.updatedMin = options.updatedMin;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        //https://developers.google.com/calendar/v3/reference/events/patch
                        if (operation === 'update') {
                            const calendarId = this.getNodeParameter('calendar', i);
                            const eventId = this.getNodeParameter('eventId', i);
                            const useDefaultReminders = this.getNodeParameter('useDefaultReminders', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const timezone = updateFields.timezone;
                            if (updateFields.maxAttendees) {
                                qs.maxAttendees = updateFields.maxAttendees;
                            }
                            if (updateFields.sendNotifications) {
                                qs.sendNotifications = updateFields.sendNotifications;
                            }
                            if (updateFields.sendUpdates) {
                                qs.sendUpdates = updateFields.sendUpdates;
                            }
                            const body = {};
                            if (updateFields.start) {
                                body.start = {
                                    dateTime: moment_timezone_1.default.tz(updateFields.start, timezone).utc().format(),
                                    timeZone: timezone,
                                };
                            }
                            if (updateFields.end) {
                                body.end = {
                                    dateTime: moment_timezone_1.default.tz(updateFields.end, timezone).utc().format(),
                                    timeZone: timezone,
                                };
                            }
                            if (updateFields.attendees) {
                                body.attendees = [];
                                updateFields.attendees.forEach(attendee => {
                                    body.attendees.push.apply(body.attendees, attendee.split(',').map(a => a.trim()).map(email => ({ email })));
                                });
                            }
                            if (updateFields.color) {
                                body.colorId = updateFields.color;
                            }
                            if (updateFields.description) {
                                body.description = updateFields.description;
                            }
                            if (updateFields.guestsCanInviteOthers) {
                                body.guestsCanInviteOthers = updateFields.guestsCanInviteOthers;
                            }
                            if (updateFields.guestsCanModify) {
                                body.guestsCanModify = updateFields.guestsCanModify;
                            }
                            if (updateFields.guestsCanSeeOtherGuests) {
                                body.guestsCanSeeOtherGuests = updateFields.guestsCanSeeOtherGuests;
                            }
                            if (updateFields.id) {
                                body.id = updateFields.id;
                            }
                            if (updateFields.location) {
                                body.location = updateFields.location;
                            }
                            if (updateFields.summary) {
                                body.summary = updateFields.summary;
                            }
                            if (updateFields.showMeAs) {
                                body.transparency = updateFields.showMeAs;
                            }
                            if (updateFields.visibility) {
                                body.visibility = updateFields.visibility;
                            }
                            if (!useDefaultReminders) {
                                const reminders = this.getNodeParameter('remindersUi', i).remindersValues;
                                body.reminders = {
                                    useDefault: false,
                                };
                                if (reminders) {
                                    body.reminders.overrides = reminders;
                                }
                            }
                            if (updateFields.allday && updateFields.start && updateFields.end) {
                                body.start = {
                                    date: timezone ?
                                        moment_timezone_1.default.tz(updateFields.start, timezone).utc(true).format('YYYY-MM-DD') :
                                        moment_timezone_1.default.tz(updateFields.start, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                                };
                                body.end = {
                                    date: timezone ?
                                        moment_timezone_1.default.tz(updateFields.end, timezone).utc(true).format('YYYY-MM-DD') :
                                        moment_timezone_1.default.tz(updateFields.end, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                                };
                            }
                            //exampel: RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10;UNTIL=20110701T170000Z
                            //https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
                            body.recurrence = [];
                            if (updateFields.rrule) {
                                body.recurrence = [`RRULE:${updateFields.rrule}`];
                            }
                            else {
                                if (updateFields.repeatHowManyTimes && updateFields.repeatUntil) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `You can set either 'Repeat How Many Times' or 'Repeat Until' but not both`);
                                }
                                if (updateFields.repeatFrecuency) {
                                    (_d = body.recurrence) === null || _d === void 0 ? void 0 : _d.push(`FREQ=${updateFields.repeatFrecuency.toUpperCase()};`);
                                }
                                if (updateFields.repeatHowManyTimes) {
                                    (_e = body.recurrence) === null || _e === void 0 ? void 0 : _e.push(`COUNT=${updateFields.repeatHowManyTimes};`);
                                }
                                if (updateFields.repeatUntil) {
                                    const repeatUntil = (0, moment_timezone_1.default)(updateFields.repeatUntil)
                                        .utc()
                                        .format('YYYYMMDDTHHmmss');
                                    (_f = body.recurrence) === null || _f === void 0 ? void 0 : _f.push(`UNTIL=${repeatUntil}Z`);
                                }
                                if (body.recurrence.length !== 0) {
                                    body.recurrence = [`RRULE:${body.recurrence.join('')}`];
                                }
                                else {
                                    delete body.recurrence;
                                }
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PATCH', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, body, qs);
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
                    if (this.continueOnFail() !== true) {
                        throw error;
                    }
                    else {
                        // Return the actual reason as error
                        returnData.push({
                            error: error.message,
                        });
                        continue;
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GoogleCalendar = GoogleCalendar;
