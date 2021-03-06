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
exports.ICalendar = void 0;
const util_1 = require("util");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const ics = __importStar(require("ics"));
const createEvent = (0, util_1.promisify)(ics.createEvent);
class ICalendar {
    constructor() {
        this.description = {
            displayName: 'iCalendar',
            name: 'iCal',
            icon: 'fa:calendar',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Create iCalendar file',
            defaults: {
                name: 'iCalendar',
                color: '#408000',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Create Event File',
                            value: 'createEventFile',
                        },
                    ],
                    default: 'createEventFile',
                },
                {
                    displayName: 'Event Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Start',
                    name: 'start',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'Date and time at which the event begins. (For all-day events, the time will be ignored.).',
                },
                {
                    displayName: 'End',
                    name: 'end',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'Date and time at which the event ends. (For all-day events, the time will be ignored.).',
                },
                {
                    displayName: 'All Day',
                    name: 'allDay',
                    type: 'boolean',
                    default: false,
                    description: 'Whether the event lasts all day or not',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'The field that your iCalendar file will be available under in the output',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: [
                                'createEventFile',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Attendees',
                            name: 'attendeesUi',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                            },
                            placeholder: 'Add Attendee',
                            default: {},
                            options: [
                                {
                                    displayName: 'Attendees',
                                    name: 'attendeeValues',
                                    values: [
                                        {
                                            displayName: 'Name',
                                            name: 'name',
                                            type: 'string',
                                            required: true,
                                            default: '',
                                        },
                                        {
                                            displayName: 'Email',
                                            name: 'email',
                                            type: 'string',
                                            placeholder: 'name@email.com',
                                            required: true,
                                            default: '',
                                        },
                                        {
                                            displayName: 'RSVP',
                                            name: 'rsvp',
                                            type: 'boolean',
                                            default: false,
                                            description: 'Whether the attendee has to confirm attendance or not',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Busy Status',
                            name: 'busyStatus',
                            type: 'options',
                            options: [
                                {
                                    name: 'Busy',
                                    value: 'BUSY',
                                },
                                {
                                    name: 'Tentative',
                                    value: 'TENTATIVE',
                                },
                            ],
                            default: '',
                            description: 'Used to specify busy status for Microsoft applications, like Outlook',
                        },
                        {
                            displayName: 'Calendar Name',
                            name: 'calName',
                            type: 'string',
                            default: '',
                            description: 'Specifies the calendar (not event) name. Used by Apple iCal and Microsoft Outlook (<a href="https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/1da58449-b97e-46bd-b018-a1ce576f3e6d">spec</a>).',
                        },
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'File Name',
                            name: 'fileName',
                            type: 'string',
                            default: '',
                            description: 'The name of the file to be generated. Default value is event.ics.',
                        },
                        {
                            displayName: 'Geolocation',
                            name: 'geolocationUi',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: false,
                            },
                            placeholder: 'Add Geolocation',
                            default: {},
                            options: [
                                {
                                    displayName: 'Geolocation',
                                    name: 'geolocationValues',
                                    values: [
                                        {
                                            displayName: 'Latitude',
                                            name: 'lat',
                                            type: 'string',
                                            default: '',
                                        },
                                        {
                                            displayName: 'Longitude',
                                            name: 'lon',
                                            type: 'string',
                                            default: '',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Location',
                            name: 'location',
                            type: 'string',
                            default: '',
                            description: 'The intended venue',
                        },
                        {
                            displayName: 'Recurrence Rule',
                            name: 'recurrenceRule',
                            type: 'string',
                            default: '',
                            description: 'A rule to define the repeat pattern of the event (RRULE). (<a href="https://icalendar.org/rrule-tool.html">Rule generator</a>).',
                        },
                        {
                            displayName: 'Organizer',
                            name: 'organizerUi',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: false,
                            },
                            placeholder: 'Add Organizer',
                            default: {},
                            options: [
                                {
                                    displayName: 'Organizer',
                                    name: 'organizerValues',
                                    values: [
                                        {
                                            displayName: 'Name',
                                            name: 'name',
                                            type: 'string',
                                            default: '',
                                            required: true,
                                        },
                                        {
                                            displayName: 'Email',
                                            name: 'email',
                                            type: 'string',
                                            placeholder: 'name@email.com',
                                            default: '',
                                            required: true,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Sequence',
                            name: 'sequence',
                            type: 'number',
                            default: 0,
                            description: 'When sending an update for an event (with the same uid), defines the revision sequence number',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Confirmed',
                                    value: 'CONFIRMED',
                                },
                                {
                                    name: 'Cancelled',
                                    value: 'CANCELLED',
                                },
                                {
                                    name: 'Tentative',
                                    value: 'TENTATIVE',
                                },
                            ],
                            default: 'CONFIRMED',
                        },
                        {
                            displayName: 'UID',
                            name: 'uid',
                            type: 'string',
                            default: '',
                            description: 'Universally unique ID for the event (will be auto-generated if not specified here). Should be globally unique.',
                        },
                        {
                            displayName: 'URL',
                            name: 'url',
                            type: 'string',
                            default: '',
                            description: 'URL associated with event',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const returnData = [];
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'createEventFile') {
                for (let i = 0; i < length; i++) {
                    const title = this.getNodeParameter('title', i);
                    const allDay = this.getNodeParameter('allDay', i);
                    const start = this.getNodeParameter('start', i);
                    let end = this.getNodeParameter('end', i);
                    end = (allDay) ? (0, moment_timezone_1.default)(end).utc().add(1, 'day').format() : end;
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    let fileName = 'event.ics';
                    const eventStart = (0, moment_timezone_1.default)(start).toArray().splice(0, (allDay) ? 3 : 6);
                    eventStart[1]++;
                    const eventEnd = (0, moment_timezone_1.default)(end).toArray().splice(0, (allDay) ? 3 : 6);
                    eventEnd[1]++;
                    if (additionalFields.fileName) {
                        fileName = additionalFields.fileName;
                    }
                    const data = {
                        title,
                        start: eventStart,
                        end: eventEnd,
                        startInputType: 'utc',
                        endInputType: 'utc',
                    };
                    if (additionalFields.geolocationUi) {
                        data.geo = additionalFields.geolocationUi.geolocationValues;
                        delete additionalFields.geolocationUi;
                    }
                    if (additionalFields.organizerUi) {
                        data.organizer = additionalFields.organizerUi.organizerValues;
                        delete additionalFields.organizerUi;
                    }
                    if (additionalFields.attendeesUi) {
                        data.attendees = additionalFields.attendeesUi.attendeeValues;
                        delete additionalFields.attendeesUi;
                    }
                    Object.assign(data, additionalFields);
                    const buffer = Buffer.from(yield createEvent(data));
                    const binaryData = yield this.helpers.prepareBinaryData(buffer, fileName, 'text/calendar');
                    returnData.push({
                        json: {},
                        binary: {
                            [binaryPropertyName]: binaryData,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                }
            }
            return [returnData];
        });
    }
}
exports.ICalendar = ICalendar;
