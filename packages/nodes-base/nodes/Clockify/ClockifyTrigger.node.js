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
exports.ClockifyTrigger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const GenericFunctions_1 = require("./GenericFunctions");
const EntryTypeEnum_1 = require("./EntryTypeEnum");
class ClockifyTrigger {
    constructor() {
        this.description = {
            displayName: 'Clockify Trigger',
            icon: 'file:clockify.svg',
            name: 'clockifyTrigger',
            group: ['trigger'],
            version: 1,
            description: 'Listens to Clockify events',
            defaults: {
                name: 'Clockify Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'clockifyApi',
                    required: true,
                },
            ],
            polling: true,
            properties: [
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspaceId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'listWorkspaces',
                    },
                    required: true,
                    default: '',
                },
                // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
                {
                    displayName: 'Trigger',
                    name: 'watchField',
                    type: 'options',
                    options: [
                        {
                            name: 'New Time Entry',
                            value: EntryTypeEnum_1.EntryTypeEnum.NEW_TIME_ENTRY,
                        },
                    ],
                    required: true,
                    default: EntryTypeEnum_1.EntryTypeEnum.NEW_TIME_ENTRY,
                },
            ],
        };
        this.methods = {
            loadOptions: {
                listWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtv = [];
                        const workspaces = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', 'workspaces');
                        if (undefined !== workspaces) {
                            workspaces.forEach(value => {
                                rtv.push({
                                    name: value.name,
                                    value: value.id,
                                });
                            });
                        }
                        return rtv;
                    });
                },
            },
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookData = this.getWorkflowStaticData('node');
            const triggerField = this.getNodeParameter('watchField');
            const workspaceId = this.getNodeParameter('workspaceId');
            if (!webhookData.userId) {
                // Cache the user-id that we do not have to request it every time
                const userInfo = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', 'user');
                webhookData.userId = userInfo.id;
            }
            const qs = {};
            let resource;
            let result = null;
            switch (triggerField) {
                case EntryTypeEnum_1.EntryTypeEnum.NEW_TIME_ENTRY:
                default:
                    const workflowTimezone = this.getTimezone();
                    resource = `workspaces/${workspaceId}/user/${webhookData.userId}/time-entries`;
                    qs.start = webhookData.lastTimeChecked;
                    qs.end = (0, moment_timezone_1.default)().tz(workflowTimezone).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
                    qs.hydrated = true;
                    qs['in-progress'] = false;
                    break;
            }
            result = yield GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource, {}, qs);
            webhookData.lastTimeChecked = qs.end;
            if (Array.isArray(result) && result.length !== 0) {
                return [this.helpers.returnJsonArray(result)];
            }
            return null;
        });
    }
}
exports.ClockifyTrigger = ClockifyTrigger;
