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
exports.TogglTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_1 = __importDefault(require("moment"));
const GenericFunctions_1 = require("./GenericFunctions");
class TogglTrigger {
    constructor() {
        this.description = {
            displayName: 'Toggl Trigger',
            name: 'togglTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:toggl.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Toggl events occur',
            defaults: {
                name: 'Toggl',
            },
            credentials: [
                {
                    name: 'togglApi',
                    required: true,
                },
            ],
            polling: true,
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'New Time Entry',
                            value: 'newTimeEntry',
                        },
                    ],
                    required: true,
                    default: 'newTimeEntry',
                },
            ],
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookData = this.getWorkflowStaticData('node');
            const event = this.getNodeParameter('event');
            let endpoint;
            if (event === 'newTimeEntry') {
                endpoint = '/time_entries';
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The defined event "${event}" is not supported`);
            }
            const qs = {};
            let timeEntries = [];
            qs.start_date = webhookData.lastTimeChecked;
            qs.end_date = (0, moment_1.default)().format();
            try {
                timeEntries = yield GenericFunctions_1.togglApiRequest.call(this, 'GET', endpoint, {}, qs);
                webhookData.lastTimeChecked = qs.end_date;
            }
            catch (error) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
            if (Array.isArray(timeEntries) && timeEntries.length !== 0) {
                return [this.helpers.returnJsonArray(timeEntries)];
            }
            return null;
        });
    }
}
exports.TogglTrigger = TogglTrigger;
