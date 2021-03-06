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
exports.GoogleCalendarTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class GoogleCalendarTrigger {
    constructor() {
        this.description = {
            displayName: 'Google Calendar Trigger',
            name: 'googleCalendarTrigger',
            icon: 'file:googleCalendar.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["triggerOn"]}}',
            description: 'Starts the workflow when Google Calendar events occur',
            defaults: {
                name: 'Google Calendar Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleCalendarOAuth2Api',
                    required: true,
                },
            ],
            polling: true,
            properties: [
                {
                    displayName: 'Calendar Name or ID',
                    name: 'calendarId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getCalendars',
                    },
                    default: '',
                },
                {
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Event Created',
                            value: 'eventCreated',
                        },
                        {
                            name: 'Event Ended',
                            value: 'eventEnded',
                        },
                        {
                            name: 'Event Started',
                            value: 'eventStarted',
                        },
                        {
                            name: 'Event Updated',
                            value: 'eventUpdated',
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Match Term',
                            name: 'matchTerm',
                            type: 'string',
                            default: '',
                            description: 'Free text search terms to filter events that match these terms in any field, except for extended properties',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the calendars to display them to user so that he can
                // select them easily
                getCalendars() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const calendars = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/calendar/v3/users/me/calendarList');
                        for (const calendar of calendars) {
                            returnData.push({
                                name: calendar.summary,
                                value: calendar.id,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const poolTimes = this.getNodeParameter('pollTimes.item', []);
            const triggerOn = this.getNodeParameter('triggerOn', '');
            const calendarId = this.getNodeParameter('calendarId');
            const webhookData = this.getWorkflowStaticData('node');
            const matchTerm = this.getNodeParameter('options.matchTerm', '');
            if (poolTimes.length === 0) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please set a poll time');
            }
            if (triggerOn === '') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please select an event');
            }
            if (calendarId === '') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please select a calendar');
            }
            const now = (0, moment_1.default)().utc().format();
            const startDate = webhookData.lastTimeChecked || now;
            const endDate = now;
            const qs = {
                showDeleted: false,
            };
            if (matchTerm !== '') {
                qs.q = matchTerm;
            }
            let events;
            if (triggerOn === 'eventCreated' || triggerOn === 'eventUpdated') {
                Object.assign(qs, {
                    updatedMin: startDate,
                    orderBy: 'updated',
                });
            }
            else if (triggerOn === 'eventStarted' || triggerOn === 'eventEnded') {
                Object.assign(qs, {
                    singleEvents: true,
                    timeMin: (0, moment_1.default)(startDate).startOf('second').utc().format(),
                    timeMax: (0, moment_1.default)(endDate).endOf('second').utc().format(),
                    orderBy: 'startTime',
                });
            }
            if (this.getMode() === 'manual') {
                delete qs.updatedMin;
                delete qs.timeMin;
                delete qs.timeMax;
                qs.maxResults = 1;
                events = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                events = events.items;
            }
            else {
                events = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                if (triggerOn === 'eventCreated') {
                    events = events.filter((event) => (0, moment_1.default)(event.created).isBetween(startDate, endDate));
                }
                else if (triggerOn === 'eventUpdated') {
                    events = events.filter((event) => !(0, moment_1.default)((0, moment_1.default)(event.created).format('YYYY-MM-DDTHH:mm:ss')).isSame((0, moment_1.default)(event.updated).format('YYYY-MM-DDTHH:mm:ss')));
                }
                else if (triggerOn === 'eventStarted') {
                    events = events.filter((event) => (0, moment_1.default)(event.start.dateTime).isBetween(startDate, endDate, null, '[]'));
                }
                else if (triggerOn === 'eventEnded') {
                    events = events.filter((event) => (0, moment_1.default)(event.end.dateTime).isBetween(startDate, endDate, null, '[]'));
                }
            }
            webhookData.lastTimeChecked = endDate;
            if (Array.isArray(events) && events.length) {
                return [this.helpers.returnJsonArray(events)];
            }
            if (this.getMode() === 'manual') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'No data with the current filter could be found' });
            }
            return null;
        });
    }
}
exports.GoogleCalendarTrigger = GoogleCalendarTrigger;
