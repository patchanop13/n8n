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
exports.TheHiveTrigger = void 0;
class TheHiveTrigger {
    constructor() {
        this.description = {
            displayName: 'TheHive Trigger',
            name: 'theHiveTrigger',
            icon: 'file:thehive.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when TheHive events occur',
            defaults: {
                name: 'TheHive Trigger',
            },
            inputs: [],
            outputs: ['main'],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    reponseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    default: [],
                    required: true,
                    description: 'Events types',
                    options: [
                        {
                            name: '*',
                            value: '*',
                            description: 'Any time any event is triggered (Wildcard Event)',
                        },
                        {
                            name: 'Alert Created',
                            value: 'alert_create',
                            description: 'Triggered when an alert is created',
                        },
                        {
                            name: 'Alert Deleted',
                            value: 'alert_delete',
                            description: 'Triggered when an alert is deleted',
                        },
                        {
                            name: 'Alert Updated',
                            value: 'alert_update',
                            description: 'Triggered when an alert is updated',
                        },
                        {
                            name: 'Case Created',
                            value: 'case_create',
                            description: 'Triggered when a case is created',
                        },
                        {
                            name: 'Case Deleted',
                            value: 'case_delete',
                            description: 'Triggered when a case is deleted',
                        },
                        {
                            name: 'Case Updated',
                            value: 'case_update',
                            description: 'Triggered when a case is updated',
                        },
                        {
                            name: 'Log Created',
                            value: 'case_task_log_create',
                            description: 'Triggered when a task log is created',
                        },
                        {
                            name: 'Log Deleted',
                            value: 'case_task_log_delete',
                            description: 'Triggered when a task log is deleted',
                        },
                        {
                            name: 'Log Updated',
                            value: 'case_task_log_update',
                            description: 'Triggered when a task log is updated',
                        },
                        {
                            name: 'Observable Created',
                            value: 'case_artifact_create',
                            description: 'Triggered when an observable is created',
                        },
                        {
                            name: 'Observable Deleted',
                            value: 'case_artifact_delete',
                            description: 'Triggered when an observable is deleted',
                        },
                        {
                            name: 'Observable Updated',
                            value: 'case_artifact_update',
                            description: 'Triggered when an observable is updated',
                        },
                        {
                            name: 'Task Created',
                            value: 'case_task_create',
                            description: 'Triggered when a task is created',
                        },
                        {
                            name: 'Task Deleted',
                            value: 'case_task_delete',
                            description: 'Triggered when a task is deleted',
                        },
                        {
                            name: 'Task Updated',
                            value: 'case_task_update',
                            description: 'Triggered when a task is updated',
                        },
                    ],
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the request body
            const bodyData = this.getBodyData();
            const events = this.getNodeParameter('events', []);
            if (!bodyData.operation || !bodyData.objectType) {
                // Don't start the workflow if mandatory fields are not specified
                return {};
            }
            // Don't start the workflow if the event is not fired
            // Replace Creation with Create for TheHive 3 support
            const operation = bodyData.operation.replace('Creation', 'Create');
            const event = `${bodyData.objectType.toLowerCase()}_${operation.toLowerCase()}`;
            if (events.indexOf('*') === -1 && events.indexOf(event) === -1) {
                return {};
            }
            // The data to return and so start the workflow with
            const returnData = [];
            returnData.push({
                event,
                body: this.getBodyData(),
                headers: this.getHeaderData(),
                query: this.getQueryData(),
            });
            return {
                workflowData: [
                    this.helpers.returnJsonArray(returnData),
                ],
            };
        });
    }
}
exports.TheHiveTrigger = TheHiveTrigger;
