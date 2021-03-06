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
exports.UptimeRobot = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const MonitorDescription_1 = require("./MonitorDescription");
const AlertContactDescription_1 = require("./AlertContactDescription");
const MaintenanceWindowDescription_1 = require("./MaintenanceWindowDescription");
const PublicStatusPageDescription_1 = require("./PublicStatusPageDescription");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class UptimeRobot {
    constructor() {
        this.description = {
            displayName: 'UptimeRobot',
            name: 'uptimeRobot',
            icon: 'file:uptimerobot.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume UptimeRobot API',
            defaults: {
                name: 'UptimeRobot',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'uptimeRobotApi',
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
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Alert Contact',
                            value: 'alertContact',
                        },
                        {
                            name: 'Maintenance Window',
                            value: 'maintenanceWindow',
                        },
                        {
                            name: 'Monitor',
                            value: 'monitor',
                        },
                        {
                            name: 'Public Status Page',
                            value: 'publicStatusPage',
                        },
                    ],
                    default: 'account',
                },
                /* -------------------------------------------------------------------------- */
                /*                                account:getAccountDetails					  */
                /* -------------------------------------------------------------------------- */
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'account',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get account details',
                        },
                    ],
                    default: 'get',
                },
                /* -------------------------------------------------------------------------- */
                /*                                Monitor									  */
                /* -------------------------------------------------------------------------- */
                ...MonitorDescription_1.monitorOperations,
                ...MonitorDescription_1.monitorFields,
                /* -------------------------------------------------------------------------- */
                /*                                Alert Contact                               */
                /* -------------------------------------------------------------------------- */
                ...AlertContactDescription_1.alertContactOperations,
                ...AlertContactDescription_1.alertContactFields,
                /* -------------------------------------------------------------------------- */
                /*                                Maintenance Window                          */
                /* -------------------------------------------------------------------------- */
                ...MaintenanceWindowDescription_1.maintenanceWindowOperations,
                ...MaintenanceWindowDescription_1.maintenanceWindowFields,
                /* -------------------------------------------------------------------------- */
                /*                               Public Status Page                           */
                /* -------------------------------------------------------------------------- */
                ...PublicStatusPageDescription_1.publicStatusPageOperations,
                ...PublicStatusPageDescription_1.publicStatusPageFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const timezone = this.getTimezone();
            for (let i = 0; i < length; i++) {
                try {
                    const resource = this.getNodeParameter('resource', 0);
                    const operation = this.getNodeParameter('operation', 0);
                    let body = {};
                    //https://uptimerobot.com/#methods
                    if (resource === 'account') {
                        if (operation === 'get') {
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getAccountDetails');
                            responseData = responseData.account;
                        }
                    }
                    if (resource === 'monitor') {
                        if (operation === 'create') {
                            body = {
                                friendly_name: this.getNodeParameter('friendlyName', i),
                                url: this.getNodeParameter('url', i),
                                type: this.getNodeParameter('type', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/newMonitor', body);
                            responseData = responseData.monitor;
                        }
                        if (operation === 'delete') {
                            body = {
                                id: this.getNodeParameter('id', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/deleteMonitor', body);
                            responseData = responseData.monitor;
                        }
                        if (operation === 'get') {
                            const monitors = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getMonitors', { monitors });
                            responseData = responseData.monitors;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            body = Object.assign({}, filters);
                            if (body.statuses) {
                                body.statuses = body.statuses.join('-');
                            }
                            if (body.types) {
                                body.types = body.types.join('-');
                            }
                            if (body.alert_contacts) {
                                body.alert_contacts = 1;
                            }
                            if (body.logs) {
                                body.logs = 1;
                            }
                            if (body.mwindow) {
                                body.mwindows = 1;
                            }
                            if (body.response_times) {
                                body.response_times = 1;
                            }
                            if (!returnAll) {
                                body.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getMonitors', body);
                            responseData = responseData.monitors;
                        }
                        if (operation === 'reset') {
                            body = {
                                id: this.getNodeParameter('id', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/resetMonitor', body);
                            responseData = responseData.monitor;
                        }
                        if (operation === 'update') {
                            body = Object.assign({ id: this.getNodeParameter('id', i) }, this.getNodeParameter('updateFields', i));
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/editMonitor', body);
                            responseData = responseData.monitor;
                        }
                    }
                    if (resource === 'alertContact') {
                        if (operation === 'create') {
                            body = {
                                friendly_name: this.getNodeParameter('friendlyName', i),
                                value: this.getNodeParameter('value', i),
                                type: this.getNodeParameter('type', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/newAlertContact', body);
                            responseData = responseData.alertcontact;
                        }
                        if (operation === 'delete') {
                            body = {
                                id: this.getNodeParameter('id', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/deleteAlertContact', body);
                            responseData = responseData.alert_contact;
                        }
                        if (operation === 'get') {
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getAlertContacts', { alert_contacts: id });
                            responseData = responseData.alert_contacts;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            body = Object.assign({}, this.getNodeParameter('filters', i));
                            if (!returnAll) {
                                body.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getAlertContacts', body);
                            responseData = responseData.alert_contacts;
                        }
                        if (operation === 'update') {
                            body = Object.assign({ id: this.getNodeParameter('id', i) }, this.getNodeParameter('updateFields', i));
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/editAlertContact', body);
                            responseData = responseData.alert_contact;
                        }
                    }
                    if (resource === 'maintenanceWindow') {
                        if (operation === 'create') {
                            const startTime = this.getNodeParameter('start_time', i);
                            const type = this.getNodeParameter('type', i);
                            const parsedStartTime = type === 1
                                ? moment_timezone_1.default.tz(startTime, timezone).unix()
                                : moment_timezone_1.default.tz(startTime, timezone).format('HH:mm');
                            body = {
                                duration: this.getNodeParameter('duration', i),
                                friendly_name: this.getNodeParameter('friendlyName', i),
                                start_time: parsedStartTime,
                                type,
                            };
                            if (type === 3) {
                                body['value'] = this.getNodeParameter('weekDay', i);
                            }
                            if (type === 4) {
                                body['value'] = this.getNodeParameter('monthDay', i);
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/newMWindow', body);
                            responseData = responseData.mwindow;
                        }
                        if (operation === 'delete') {
                            body = {
                                id: this.getNodeParameter('id', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/deleteMWindow', body);
                            responseData = { status: responseData.message };
                        }
                        if (operation === 'get') {
                            const mwindows = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getMWindows', { mwindows });
                            responseData = responseData.mwindows;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            body = Object.assign({}, this.getNodeParameter('filters', i));
                            if (!returnAll) {
                                body.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getMWindows', body);
                            responseData = responseData.mwindows;
                        }
                        if (operation === 'update') {
                            body = Object.assign({ id: this.getNodeParameter('id', i), duration: this.getNodeParameter('duration', i) }, this.getNodeParameter('updateFields', i));
                            if (body.type === 1 && body.start_time) {
                                body.start_time = moment_timezone_1.default.tz(body.start_time, timezone).unix();
                            }
                            else {
                                body.start_time = moment_timezone_1.default.tz(body.start_time, timezone).format('HH:mm');
                            }
                            if (body.type === 3) {
                                body['value'] = body.weekDay;
                                delete body.weekDay;
                            }
                            if (body.type === 4) {
                                body['value'] = body.monthDay;
                                delete body.monthDay;
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/editMWindow', body);
                            responseData = responseData.mwindow;
                        }
                    }
                    if (resource === 'publicStatusPage') {
                        if (operation === 'create') {
                            body = Object.assign({ friendly_name: this.getNodeParameter('friendlyName', i), monitors: this.getNodeParameter('monitors', i) }, this.getNodeParameter('additionalFields', i));
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/newPSP', body);
                            responseData = responseData.psp;
                        }
                        if (operation === 'delete') {
                            body = {
                                id: this.getNodeParameter('id', i),
                            };
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/deletePSP', body);
                            responseData = responseData.psp;
                        }
                        if (operation === 'get') {
                            const psps = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getPSPs', { psps });
                            responseData = responseData.psps;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            body = Object.assign({}, this.getNodeParameter('filters', i));
                            if (!returnAll) {
                                body.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/getPSPs', body);
                            responseData = responseData.psps;
                        }
                        if (operation === 'update') {
                            body = Object.assign({ id: this.getNodeParameter('id', i) }, this.getNodeParameter('updateFields', i));
                            responseData = yield GenericFunctions_1.uptimeRobotApiRequest.call(this, 'POST', '/editPSP', body);
                            responseData = responseData.psp;
                        }
                    }
                    Array.isArray(responseData)
                        ? returnData.push(...responseData)
                        : returnData.push(responseData);
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
exports.UptimeRobot = UptimeRobot;
