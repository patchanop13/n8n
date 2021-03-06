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
exports.WorkableTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class WorkableTrigger {
    constructor() {
        this.description = {
            displayName: 'Workable Trigger',
            name: 'workableTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:workable.png',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["triggerOn"]}}',
            description: 'Starts the workflow when Workable events occur',
            defaults: {
                name: 'Workable Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'workableApi',
                    required: true,
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
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    options: [
                        {
                            name: 'Candidate Created',
                            value: 'candidateCreated',
                        },
                        {
                            name: 'Candidate Moved',
                            value: 'candidateMoved',
                        },
                    ],
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    options: [
                        {
                            displayName: 'Job Name or ID',
                            name: 'job',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getJobs',
                            },
                            default: '',
                            description: 'Get notifications only for one job. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Stage Name or ID',
                            name: 'stage',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getStages',
                            },
                            default: '',
                            description: 'Get notifications for specific stages. e.g. \'hired\'. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getJobs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { jobs } = yield GenericFunctions_1.workableApiRequest.call(this, 'GET', '/jobs');
                        for (const job of jobs) {
                            returnData.push({
                                name: job.full_title,
                                value: job.shortcode,
                            });
                        }
                        return returnData;
                    });
                },
                getStages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { stages } = yield GenericFunctions_1.workableApiRequest.call(this, 'GET', '/stages');
                        for (const stage of stages) {
                            returnData.push({
                                name: stage.name,
                                value: stage.slug,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const { subscriptions } = yield GenericFunctions_1.workableApiRequest.call(this, 'GET', `/subscriptions`);
                        for (const subscription of subscriptions) {
                            if (subscription.target === webhookUrl) {
                                webhookData.webhookId = subscription.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = yield this.getCredentials('workableApi');
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const triggerOn = this.getNodeParameter('triggerOn');
                        const { stage, job } = this.getNodeParameter('filters');
                        const endpoint = '/subscriptions';
                        const body = {
                            event: (0, change_case_1.snakeCase)(triggerOn).toLowerCase(),
                            args: Object.assign(Object.assign({ account_id: credentials.subdomain }, (job) && { job_shortcode: job }), (stage) && { stage_slug: stage }),
                            target: webhookUrl,
                        };
                        const responseData = yield GenericFunctions_1.workableApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/subscriptions/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.workableApiRequest.call(this, 'DELETE', endpoint);
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
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.WorkableTrigger = WorkableTrigger;
