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
exports.DateTime = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class DateTime {
    constructor() {
        this.description = {
            displayName: 'Date & Time',
            name: 'dateTime',
            icon: 'fa:clock',
            group: ['transform'],
            version: 1,
            description: 'Allows you to manipulate date and time values',
            subtitle: '={{$parameter["action"]}}',
            defaults: {
                name: 'Date & Time',
                color: '#408000',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    options: [
                        {
                            name: 'Calculate a Date',
                            description: 'Add or subtract time from a date',
                            value: 'calculate',
                        },
                        {
                            name: 'Format a Date',
                            description: 'Convert a date to a different format',
                            value: 'format',
                        },
                    ],
                    default: 'format',
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    description: 'The value that should be converted',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the converted date',
                },
                {
                    displayName: 'Custom Format',
                    name: 'custom',
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                        },
                    },
                    type: 'boolean',
                    default: false,
                    description: 'Whether a predefined format should be selected or custom format entered',
                },
                {
                    displayName: 'To Format',
                    name: 'toFormat',
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                            custom: [
                                true,
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    placeholder: 'YYYY-MM-DD',
                    description: 'The format to convert the date to',
                },
                {
                    displayName: 'To Format',
                    name: 'toFormat',
                    type: 'options',
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                            custom: [
                                false,
                            ],
                        },
                    },
                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                    options: [
                        {
                            name: 'MM/DD/YYYY',
                            value: 'MM/DD/YYYY',
                            description: 'Example: 09/04/1986',
                        },
                        {
                            name: 'YYYY/MM/DD',
                            value: 'YYYY/MM/DD',
                            description: 'Example: 1986/04/09',
                        },
                        {
                            name: 'MMMM DD YYYY',
                            value: 'MMMM DD YYYY',
                            description: 'Example: April 09 1986',
                        },
                        {
                            name: 'MM-DD-YYYY',
                            value: 'MM-DD-YYYY',
                            description: 'Example: 09-04-1986',
                        },
                        {
                            name: 'YYYY-MM-DD',
                            value: 'YYYY-MM-DD',
                            description: 'Example: 1986-04-09',
                        },
                        {
                            name: 'Unix Timestamp',
                            value: 'X',
                            description: 'Example: 513388800.879',
                        },
                        {
                            name: 'Unix Ms Timestamp',
                            value: 'x',
                            description: 'Example: 513388800',
                        },
                    ],
                    default: 'MM/DD/YYYY',
                    description: 'The format to convert the date to',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    displayOptions: {
                        show: {
                            action: [
                                'format',
                            ],
                        },
                    },
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'From Format',
                            name: 'fromFormat',
                            type: 'string',
                            default: '',
                            description: 'In case the input format is not recognized you can provide the format',
                        },
                        {
                            displayName: 'From Timezone Name or ID',
                            name: 'fromTimezone',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getTimezones',
                            },
                            default: 'UTC',
                            description: 'The timezone to convert from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'To Timezone Name or ID',
                            name: 'toTimezone',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getTimezones',
                            },
                            default: 'UTC',
                            description: 'The timezone to convert to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
                {
                    displayName: 'Date Value',
                    name: 'value',
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    description: 'The date string or timestamp from which you want to add/subtract time',
                    required: true,
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add time to Date Value',
                        },
                        {
                            name: 'Subtract',
                            value: 'subtract',
                            description: 'Subtract time from Date Value',
                        },
                    ],
                    default: 'add',
                    required: true,
                },
                {
                    displayName: 'Duration',
                    name: 'duration',
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    default: 0,
                    required: true,
                    description: 'E.g. enter “10” then select “Days” if you want to add 10 days to Date Value.',
                },
                {
                    displayName: 'Time Unit',
                    name: 'timeUnit',
                    description: 'Time unit for Duration parameter above',
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    type: 'options',
                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                    options: [
                        {
                            name: 'Quarters',
                            value: 'quarters',
                        },
                        {
                            name: 'Years',
                            value: 'years',
                        },
                        {
                            name: 'Months',
                            value: 'months',
                        },
                        {
                            name: 'Weeks',
                            value: 'weeks',
                        },
                        {
                            name: 'Days',
                            value: 'days',
                        },
                        {
                            name: 'Hours',
                            value: 'hours',
                        },
                        {
                            name: 'Minutes',
                            value: 'minutes',
                        },
                        {
                            name: 'Seconds',
                            value: 'seconds',
                        },
                        {
                            name: 'Milliseconds',
                            value: 'milliseconds',
                        },
                    ],
                    default: 'days',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    description: 'Name of the output property to which to write the converted date',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            action: [
                                'calculate',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'From Format',
                            name: 'fromFormat',
                            type: 'string',
                            default: '',
                            description: 'Format for parsing the value as a date. If unrecognized, specify the <a href="https://docs.n8n.io/nodes/n8n-nodes-base.dateTime/#faqs">format</a> for the value.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
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
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const returnData = [];
            const workflowTimezone = this.getTimezone();
            let item;
            for (let i = 0; i < length; i++) {
                try {
                    const action = this.getNodeParameter('action', 0);
                    item = items[i];
                    if (action === 'format') {
                        const currentDate = this.getNodeParameter('value', i);
                        const dataPropertyName = this.getNodeParameter('dataPropertyName', i);
                        const toFormat = this.getNodeParameter('toFormat', i);
                        const options = this.getNodeParameter('options', i);
                        let newDate;
                        if (currentDate === undefined) {
                            continue;
                        }
                        if (options.fromFormat === undefined && !(0, moment_timezone_1.default)(currentDate).isValid()) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The date input format could not be recognized. Please set the "From Format" field');
                        }
                        if (Number.isInteger(currentDate)) {
                            newDate = moment_timezone_1.default.unix(currentDate);
                        }
                        else {
                            if (options.fromTimezone || options.toTimezone) {
                                const fromTimezone = options.fromTimezone || workflowTimezone;
                                if (options.fromFormat) {
                                    newDate = moment_timezone_1.default.tz(currentDate, options.fromFormat, fromTimezone);
                                }
                                else {
                                    newDate = moment_timezone_1.default.tz(currentDate, fromTimezone);
                                }
                            }
                            else {
                                if (options.fromFormat) {
                                    newDate = (0, moment_timezone_1.default)(currentDate, options.fromFormat);
                                }
                                else {
                                    newDate = (0, moment_timezone_1.default)(currentDate);
                                }
                            }
                        }
                        if (options.toTimezone || options.fromTimezone) {
                            // If either a source or a target timezone got defined the
                            // timezone of the date has to be changed. If a target-timezone
                            // is set use it else fall back to workflow timezone.
                            newDate = newDate.tz(options.toTimezone || workflowTimezone);
                        }
                        newDate = newDate.format(toFormat);
                        let newItem;
                        if (dataPropertyName.includes('.')) {
                            // Uses dot notation so copy all data
                            newItem = {
                                json: JSON.parse(JSON.stringify(item.json)),
                                pairedItem: {
                                    item: i,
                                },
                            };
                        }
                        else {
                            // Does not use dot notation so shallow copy is enough
                            newItem = {
                                json: Object.assign({}, item.json),
                                pairedItem: {
                                    item: i,
                                },
                            };
                        }
                        if (item.binary !== undefined) {
                            newItem.binary = item.binary;
                        }
                        (0, lodash_1.set)(newItem, `json.${dataPropertyName}`, newDate);
                        returnData.push(newItem);
                    }
                    if (action === 'calculate') {
                        const dateValue = this.getNodeParameter('value', i);
                        const operation = this.getNodeParameter('operation', i);
                        const duration = this.getNodeParameter('duration', i);
                        const timeUnit = this.getNodeParameter('timeUnit', i);
                        const { fromFormat } = this.getNodeParameter('options', i);
                        const dataPropertyName = this.getNodeParameter('dataPropertyName', i);
                        const newDate = fromFormat
                            ? parseDateByFormat(dateValue, fromFormat)
                            : parseDateByDefault(dateValue);
                        operation === 'add'
                            ? newDate.add(duration, timeUnit).utc().format()
                            : newDate.subtract(duration, timeUnit).utc().format();
                        let newItem;
                        if (dataPropertyName.includes('.')) {
                            // Uses dot notation so copy all data
                            newItem = {
                                json: JSON.parse(JSON.stringify(item.json)),
                                pairedItem: {
                                    item: i,
                                },
                            };
                        }
                        else {
                            // Does not use dot notation so shallow copy is enough
                            newItem = {
                                json: Object.assign({}, item.json),
                                pairedItem: {
                                    item: i,
                                },
                            };
                        }
                        if (item.binary !== undefined) {
                            newItem.binary = item.binary;
                        }
                        (0, lodash_1.set)(newItem, `json.${dataPropertyName}`, newDate.toISOString());
                        returnData.push(newItem);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.DateTime = DateTime;
function parseDateByFormat(value, fromFormat) {
    const date = (0, moment_timezone_1.default)(value, fromFormat, true);
    if ((0, moment_timezone_1.default)(date).isValid())
        return date;
    throw new Error('Date input cannot be parsed. Please recheck the value and the "From Format" field.');
}
function parseDateByDefault(value) {
    const isoValue = getIsoValue(value);
    if ((0, moment_timezone_1.default)(isoValue).isValid())
        return (0, moment_timezone_1.default)(isoValue);
    throw new Error('Unrecognized date input. Please specify a format in the "From Format" field.');
}
function getIsoValue(value) {
    try {
        return new Date(value).toISOString(); // may throw due to unpredictable input
    }
    catch (error) {
        throw new Error('Unrecognized date input. Please specify a format in the "From Format" field.');
    }
}
