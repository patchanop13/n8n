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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cron = void 0;
const cron_1 = require("cron");
class Cron {
    constructor() {
        this.description = {
            displayName: 'Cron',
            name: 'cron',
            icon: 'fa:calendar',
            group: ['trigger', 'schedule'],
            version: 1,
            description: 'Triggers the workflow at a specific time',
            eventTriggerDescription: '',
            activationMessage: 'Your cron trigger will now trigger executions on the schedule you have defined.',
            defaults: {
                name: 'Cron',
                color: '#00FF00',
            },
            // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'This workflow will run on the schedule you define here once you <a data-key="activate">activate</a> it.<br><br>For testing, you can also trigger it manually: by going back to the canvas and clicking ‘execute workflow’',
                    name: 'notice',
                    type: 'notice',
                    default: '',
                },
                {
                    displayName: 'Trigger Times',
                    name: 'triggerTimes',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                        multipleValueButtonText: 'Add Time',
                    },
                    default: {},
                    description: 'Triggers for the workflow',
                    placeholder: 'Add Cron Time',
                    options: [
                        {
                            name: 'item',
                            displayName: 'Item',
                            values: [
                                {
                                    displayName: 'Mode',
                                    name: 'mode',
                                    type: 'options',
                                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                                    options: [
                                        {
                                            name: 'Every Minute',
                                            value: 'everyMinute',
                                        },
                                        {
                                            name: 'Every Hour',
                                            value: 'everyHour',
                                        },
                                        {
                                            name: 'Every Day',
                                            value: 'everyDay',
                                        },
                                        {
                                            name: 'Every Week',
                                            value: 'everyWeek',
                                        },
                                        {
                                            name: 'Every Month',
                                            value: 'everyMonth',
                                        },
                                        {
                                            name: 'Every X',
                                            value: 'everyX',
                                        },
                                        {
                                            name: 'Custom',
                                            value: 'custom',
                                        },
                                    ],
                                    default: 'everyDay',
                                    description: 'How often to trigger',
                                },
                                {
                                    displayName: 'Hour',
                                    name: 'hour',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 23,
                                    },
                                    displayOptions: {
                                        hide: {
                                            mode: [
                                                'custom',
                                                'everyHour',
                                                'everyMinute',
                                                'everyX',
                                            ],
                                        },
                                    },
                                    default: 14,
                                    description: 'The hour of the day to trigger (24h format)',
                                },
                                {
                                    displayName: 'Minute',
                                    name: 'minute',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 59,
                                    },
                                    displayOptions: {
                                        hide: {
                                            mode: [
                                                'custom',
                                                'everyMinute',
                                                'everyX',
                                            ],
                                        },
                                    },
                                    default: 0,
                                    description: 'The minute of the day to trigger',
                                },
                                {
                                    displayName: 'Day of Month',
                                    name: 'dayOfMonth',
                                    type: 'number',
                                    displayOptions: {
                                        show: {
                                            mode: [
                                                'everyMonth',
                                            ],
                                        },
                                    },
                                    typeOptions: {
                                        minValue: 1,
                                        maxValue: 31,
                                    },
                                    default: 1,
                                    description: 'The day of the month to trigger',
                                },
                                {
                                    displayName: 'Weekday',
                                    name: 'weekday',
                                    type: 'options',
                                    displayOptions: {
                                        show: {
                                            mode: [
                                                'everyWeek',
                                            ],
                                        },
                                    },
                                    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                                    options: [
                                        {
                                            name: 'Monday',
                                            value: '1',
                                        },
                                        {
                                            name: 'Tuesday',
                                            value: '2',
                                        },
                                        {
                                            name: 'Wednesday',
                                            value: '3',
                                        },
                                        {
                                            name: 'Thursday',
                                            value: '4',
                                        },
                                        {
                                            name: 'Friday',
                                            value: '5',
                                        },
                                        {
                                            name: 'Saturday',
                                            value: '6',
                                        },
                                        {
                                            name: 'Sunday',
                                            value: '0',
                                        },
                                    ],
                                    default: '1',
                                    description: 'The weekday to trigger',
                                },
                                {
                                    displayName: 'Cron Expression',
                                    name: 'cronExpression',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            mode: [
                                                'custom',
                                            ],
                                        },
                                    },
                                    default: '* * * * * *',
                                    description: 'Use custom cron expression. Values and ranges as follows:<ul><li>Seconds: 0-59</li><li>Minutes: 0 - 59</li><li>Hours: 0 - 23</li><li>Day of Month: 1 - 31</li><li>Months: 0 - 11 (Jan - Dec)</li><li>Day of Week: 0 - 6 (Sun - Sat)</li></ul>.',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                        maxValue: 1000,
                                    },
                                    displayOptions: {
                                        show: {
                                            mode: [
                                                'everyX',
                                            ],
                                        },
                                    },
                                    default: 2,
                                    description: 'All how many X minutes/hours it should trigger',
                                },
                                {
                                    displayName: 'Unit',
                                    name: 'unit',
                                    type: 'options',
                                    displayOptions: {
                                        show: {
                                            mode: [
                                                'everyX',
                                            ],
                                        },
                                    },
                                    options: [
                                        {
                                            name: 'Minutes',
                                            value: 'minutes',
                                        },
                                        {
                                            name: 'Hours',
                                            value: 'hours',
                                        },
                                    ],
                                    default: 'hours',
                                    description: 'If it should trigger all X minutes or hours',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const triggerTimes = this.getNodeParameter('triggerTimes');
            // Define the order the cron-time-parameter appear
            const parameterOrder = [
                'second',
                'minute',
                'hour',
                'dayOfMonth',
                'month',
                'weekday', // 0 - 6(Sun - Sat)
            ];
            // Get all the trigger times
            const cronTimes = [];
            let cronTime;
            let parameterName;
            if (triggerTimes.item !== undefined) {
                for (const item of triggerTimes.item) {
                    cronTime = [];
                    if (item.mode === 'custom') {
                        cronTimes.push(item.cronExpression);
                        continue;
                    }
                    if (item.mode === 'everyMinute') {
                        cronTimes.push(`${Math.floor(Math.random() * 60).toString()} * * * * *`);
                        continue;
                    }
                    if (item.mode === 'everyX') {
                        if (item.unit === 'minutes') {
                            cronTimes.push(`${Math.floor(Math.random() * 60).toString()} */${item.value} * * * *`);
                        }
                        else if (item.unit === 'hours') {
                            cronTimes.push(`${Math.floor(Math.random() * 60).toString()} 0 */${item.value} * * *`);
                        }
                        continue;
                    }
                    for (parameterName of parameterOrder) {
                        if (item[parameterName] !== undefined) {
                            // Value is set so use it
                            cronTime.push(item[parameterName]);
                        }
                        else if (parameterName === 'second') {
                            // For seconds we use by default a random one to make sure to
                            // balance the load a little bit over time
                            cronTime.push(Math.floor(Math.random() * 60).toString());
                        }
                        else {
                            // For all others set "any"
                            cronTime.push('*');
                        }
                    }
                    cronTimes.push(cronTime.join(' '));
                }
            }
            // The trigger function to execute when the cron-time got reached
            // or when manually triggered
            const executeTrigger = () => {
                this.emit([this.helpers.returnJsonArray([{}])]);
            };
            const timezone = this.getTimezone();
            // Start the cron-jobs
            const cronJobs = [];
            for (const cronTime of cronTimes) {
                cronJobs.push(new cron_1.CronJob(cronTime, executeTrigger, undefined, true, timezone));
            }
            // Stop the cron-jobs
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const cronJob of cronJobs) {
                        cronJob.stop();
                    }
                });
            }
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    executeTrigger();
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.Cron = Cron;
