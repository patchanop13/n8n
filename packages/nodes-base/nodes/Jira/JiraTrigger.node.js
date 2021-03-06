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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const queryString = __importStar(require("querystring"));
class JiraTrigger {
    constructor() {
        this.description = {
            displayName: 'Jira Trigger',
            name: 'jiraTrigger',
            icon: 'file:jira.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Jira events occur',
            defaults: {
                name: 'Jira Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'jiraSoftwareCloudApi',
                    required: true,
                    displayOptions: {
                        show: {
                            jiraVersion: [
                                'cloud',
                            ],
                        },
                    },
                },
                {
                    name: 'jiraSoftwareServerApi',
                    required: true,
                    displayOptions: {
                        show: {
                            jiraVersion: [
                                'server',
                            ],
                        },
                    },
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Jira Version',
                    name: 'jiraVersion',
                    type: 'options',
                    options: [
                        {
                            name: 'Cloud',
                            value: 'cloud',
                        },
                        {
                            name: 'Server (Self Hosted)',
                            value: 'server',
                        },
                    ],
                    default: 'cloud',
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: '*',
                            value: '*',
                        },
                        {
                            name: 'Board Configuration Changed',
                            value: 'board_configuration_changed',
                        },
                        {
                            name: 'Board Created',
                            value: 'board_created',
                        },
                        {
                            name: 'Board Deleted',
                            value: 'board_deleted',
                        },
                        {
                            name: 'Board Updated',
                            value: 'board_updated',
                        },
                        {
                            name: 'Comment Created',
                            value: 'comment_created',
                        },
                        {
                            name: 'Comment Deleted',
                            value: 'comment_deleted',
                        },
                        {
                            name: 'Comment Updated',
                            value: 'comment_updated',
                        },
                        {
                            name: 'Issue Created',
                            value: 'jira:issue_created',
                        },
                        {
                            name: 'Issue Deleted',
                            value: 'jira:issue_deleted',
                        },
                        {
                            name: 'Issue Link Created',
                            value: 'issuelink_created',
                        },
                        {
                            name: 'Issue Link Deleted',
                            value: 'issuelink_deleted',
                        },
                        {
                            name: 'Issue Updated',
                            value: 'jira:issue_updated',
                        },
                        {
                            name: 'Option Attachments Changed',
                            value: 'option_attachments_changed',
                        },
                        {
                            name: 'Option Issue Links Changed',
                            value: 'option_issuelinks_changed',
                        },
                        {
                            name: 'Option Subtasks Changed',
                            value: 'option_subtasks_changed',
                        },
                        {
                            name: 'Option Timetracking Changed',
                            value: 'option_timetracking_changed',
                        },
                        {
                            name: 'Option Unassigned Issues Changed',
                            value: 'option_unassigned_issues_changed',
                        },
                        {
                            name: 'Option Voting Changed',
                            value: 'option_voting_changed',
                        },
                        {
                            name: 'Option Watching Changed',
                            value: 'option_watching_changed',
                        },
                        {
                            name: 'Project Created',
                            value: 'project_created',
                        },
                        {
                            name: 'Project Deleted',
                            value: 'project_deleted',
                        },
                        {
                            name: 'Project Updated',
                            value: 'project_updated',
                        },
                        {
                            name: 'Sprint Closed',
                            value: 'sprint_closed',
                        },
                        {
                            name: 'Sprint Created',
                            value: 'sprint_created',
                        },
                        {
                            name: 'Sprint Deleted',
                            value: 'sprint_deleted',
                        },
                        {
                            name: 'Sprint Started',
                            value: 'sprint_started',
                        },
                        {
                            name: 'Sprint Updated',
                            value: 'sprint_updated',
                        },
                        {
                            name: 'User Created',
                            value: 'user_created',
                        },
                        {
                            name: 'User Deleted',
                            value: 'user_deleted',
                        },
                        {
                            name: 'User Updated',
                            value: 'user_updated',
                        },
                        {
                            name: 'Version Created',
                            value: 'jira:version_created',
                        },
                        {
                            name: 'Version Deleted',
                            value: 'jira:version_deleted',
                        },
                        {
                            name: 'Version Moved',
                            value: 'jira:version_moved',
                        },
                        {
                            name: 'Version Released',
                            value: 'jira:version_released',
                        },
                        {
                            name: 'Version Unreleased',
                            value: 'jira:version_unreleased',
                        },
                        {
                            name: 'Version Updated',
                            value: 'jira:version_updated',
                        },
                        {
                            name: 'Worklog Created',
                            value: 'worklog_created',
                        },
                        {
                            name: 'Worklog Deleted',
                            value: 'worklog_deleted',
                        },
                        {
                            name: 'Worklog Updated',
                            value: 'worklog_updated',
                        },
                    ],
                    required: true,
                    default: [],
                    description: 'The events to listen to',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Exclude Body',
                            name: 'excludeBody',
                            type: 'boolean',
                            default: false,
                            description: 'Whether a request with empty body will be sent to the URL. Leave unchecked if you want to receive JSON.',
                        },
                        {
                            displayName: 'Filter',
                            name: 'filter',
                            type: 'string',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                            default: '',
                            placeholder: 'Project = JRA AND resolution = Fixed',
                            description: 'You can specify a JQL query to send only events triggered by matching issues. The JQL filter only applies to events under the Issue and Comment columns.',
                        },
                        {
                            displayName: 'Include Fields',
                            name: 'includeFields',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'Attachment ID',
                                    value: 'attachment.id',
                                },
                                {
                                    name: 'Board ID',
                                    value: 'board.id',
                                },
                                {
                                    name: 'Comment ID',
                                    value: 'comment.id',
                                },
                                {
                                    name: 'Issue ID',
                                    value: 'issue.id',
                                },
                                {
                                    name: 'Merge Version ID',
                                    value: 'mergeVersion.id',
                                },
                                {
                                    name: 'Modified User Account ID',
                                    value: 'modifiedUser.accountId',
                                },
                                {
                                    name: 'Modified User Key',
                                    value: 'modifiedUser.key',
                                },
                                {
                                    name: 'Modified User Name',
                                    value: 'modifiedUser.name',
                                },
                                {
                                    name: 'Project ID',
                                    value: 'project.id',
                                },
                                {
                                    name: 'Project Key',
                                    value: 'project.key',
                                },
                                {
                                    name: 'Propery Key',
                                    value: 'property.key',
                                },
                                {
                                    name: 'Sprint ID',
                                    value: 'sprint.id',
                                },
                                {
                                    name: 'Version ID',
                                    value: 'version.id',
                                },
                                {
                                    name: 'Worklog ID',
                                    value: 'worklog.id',
                                },
                            ],
                            default: [],
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
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const events = this.getNodeParameter('events');
                        const endpoint = `/webhooks/1.0/webhook`;
                        const webhooks = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, endpoint, 'GET', {});
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl && (0, GenericFunctions_1.eventExists)(events, webhook.events)) {
                                webhookData.webhookId = (0, GenericFunctions_1.getId)(webhook.self);
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        let events = this.getNodeParameter('events', []);
                        const additionalFields = this.getNodeParameter('additionalFields');
                        const endpoint = `/webhooks/1.0/webhook`;
                        const webhookData = this.getWorkflowStaticData('node');
                        if (events.includes('*')) {
                            events = GenericFunctions_1.allEvents;
                        }
                        const body = {
                            name: `n8n-webhook:${webhookUrl}`,
                            url: webhookUrl,
                            events,
                            filters: {},
                            excludeBody: false,
                        };
                        if (additionalFields.filter) {
                            body.filters = {
                                'issue-related-events-section': additionalFields.filter,
                            };
                        }
                        if (additionalFields.excludeBody) {
                            body.excludeBody = additionalFields.excludeBody;
                        }
                        if (additionalFields.includeFields) {
                            // tslint:disable-next-line: no-any
                            const parameters = {};
                            for (const field of additionalFields.includeFields) {
                                parameters[field] = '${' + field + '}';
                            }
                            body.url = `${body.url}?${queryString.unescape(queryString.stringify(parameters))}`;
                        }
                        const responseData = yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, endpoint, 'POST', body);
                        webhookData.webhookId = (0, GenericFunctions_1.getId)(responseData.self);
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhooks/1.0/webhook/${webhookData.webhookId}`;
                            const body = {};
                            try {
                                yield GenericFunctions_1.jiraSoftwareCloudApiRequest.call(this, endpoint, 'DELETE', body);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            const queryData = this.getQueryData();
            Object.assign(bodyData, queryData);
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.JiraTrigger = JiraTrigger;
