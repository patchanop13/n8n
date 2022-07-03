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
exports.Interval = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Interval {
    constructor() {
        this.description = {
            displayName: 'Interval',
            name: 'interval',
            icon: 'fa:hourglass',
            group: ['trigger', 'schedule'],
            version: 1,
            description: 'Triggers the workflow in a given interval',
            eventTriggerDescription: '',
            activationMessage: 'Your interval trigger will now trigger executions on the schedule you have defined.',
            defaults: {
                name: 'Interval',
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
                    displayName: 'Interval',
                    name: 'interval',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 1,
                    description: 'Interval value',
                },
                {
                    displayName: 'Unit',
                    name: 'unit',
                    type: 'options',
                    options: [
                        {
                            name: 'Seconds',
                            value: 'seconds',
                        },
                        {
                            name: 'Minutes',
                            value: 'minutes',
                        },
                        {
                            name: 'Hours',
                            value: 'hours',
                        },
                    ],
                    default: 'seconds',
                    description: 'Unit of the interval value',
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const interval = this.getNodeParameter('interval');
            const unit = this.getNodeParameter('unit');
            if (interval <= 0) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The interval has to be set to at least 1 or higher!');
            }
            let intervalValue = interval;
            if (unit === 'minutes') {
                intervalValue *= 60;
            }
            if (unit === 'hours') {
                intervalValue *= 60 * 60;
            }
            const executeTrigger = () => {
                this.emit([this.helpers.returnJsonArray([{}])]);
            };
            intervalValue *= 1000;
            // Reference: https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args
            if (intervalValue > 2147483647) {
                throw new Error('The interval value is too large.');
            }
            const intervalObj = setInterval(executeTrigger, intervalValue);
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    clearInterval(intervalObj);
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
exports.Interval = Interval;
