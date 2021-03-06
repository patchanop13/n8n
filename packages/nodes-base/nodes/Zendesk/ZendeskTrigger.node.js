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
exports.ZendeskTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ConditionDescription_1 = require("./ConditionDescription");
const TriggerPlaceholders_1 = require("./TriggerPlaceholders");
class ZendeskTrigger {
    constructor() {
        this.description = {
            displayName: 'Zendesk Trigger',
            name: 'zendeskTrigger',
            icon: 'file:zendesk.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Zendesk events via webhooks',
            defaults: {
                name: 'Zendesk Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'zendeskApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiToken',
                            ],
                        },
                    },
                },
                {
                    name: 'zendeskOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'API Token',
                            value: 'apiToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiToken',
                },
                {
                    displayName: 'Service',
                    name: 'service',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'Support',
                            value: 'support',
                        },
                    ],
                    default: 'support',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            service: [
                                'support',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Field Names or IDs',
                            name: 'fields',
                            description: 'The fields to return the values of. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                            type: 'multiOptions',
                            default: [],
                            typeOptions: {
                                loadOptionsMethod: 'getFields',
                            },
                        },
                    ],
                    placeholder: 'Add Option',
                },
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    placeholder: 'Add Condition',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            service: [
                                'support',
                            ],
                        },
                    },
                    description: 'The condition to set',
                    default: {},
                    options: [
                        {
                            name: 'all',
                            displayName: 'All',
                            values: [
                                ...ConditionDescription_1.conditionFields,
                            ],
                        },
                        {
                            name: 'any',
                            displayName: 'Any',
                            values: [
                                ...ConditionDescription_1.conditionFields,
                            ],
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the fields to display them to user so that he can
                // select them easily
                getFields() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = TriggerPlaceholders_1.triggerPlaceholders;
                        const customFields = [
                            'text',
                            'textarea',
                            'date',
                            'integer',
                            'decimal',
                            'regexp',
                            'multiselect',
                            'tagger',
                        ];
                        const fields = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'ticket_fields', 'GET', '/ticket_fields');
                        for (const field of fields) {
                            if (customFields.includes(field.type) && field.removable && field.active) {
                                const fieldName = field.title;
                                const fieldId = field.id;
                                returnData.push({
                                    name: fieldName,
                                    value: `ticket.ticket_field_${fieldId}`,
                                    description: `Custom field ${fieldName}`,
                                });
                            }
                        }
                        return returnData;
                    });
                },
                // Get all the groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const groups = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'groups', 'GET', '/groups');
                        for (const group of groups) {
                            const groupName = group.name;
                            const groupId = group.id;
                            returnData.push({
                                name: groupName,
                                value: groupId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the users to display them to user so that he can
                // select them easily
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'users', 'GET', '/users');
                        for (const user of users) {
                            const userName = user.name;
                            const userId = user.id;
                            returnData.push({
                                name: userName,
                                value: userId,
                            });
                        }
                        returnData.push({
                            name: 'Current User',
                            value: 'current_user',
                        });
                        returnData.push({
                            name: 'Requester',
                            value: 'requester_id',
                        });
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const conditions = this.getNodeParameter('conditions');
                        let endpoint = '';
                        const resultAll = [], resultAny = [];
                        const conditionsAll = conditions.all;
                        if (conditionsAll) {
                            for (const conditionAll of conditionsAll) {
                                const aux = {};
                                aux.field = conditionAll.field;
                                aux.operator = conditionAll.operation;
                                if (conditionAll.operation !== 'changed'
                                    && conditionAll.operation !== 'not_changed') {
                                    aux.value = conditionAll.value;
                                }
                                else {
                                    aux.value = null;
                                }
                                resultAll.push(aux);
                            }
                        }
                        const conditionsAny = conditions.any;
                        if (conditionsAny) {
                            for (const conditionAny of conditionsAny) {
                                const aux = {};
                                aux.field = conditionAny.field;
                                aux.operator = conditionAny.operation;
                                if (conditionAny.operation !== 'changed'
                                    && conditionAny.operation !== 'not_changed') {
                                    aux.value = conditionAny.value;
                                }
                                else {
                                    aux.value = null;
                                }
                                resultAny.push(aux);
                            }
                        }
                        // get all webhooks
                        // https://developer.zendesk.com/api-reference/event-connectors/webhooks/webhooks/#list-webhooks
                        const { webhooks } = yield GenericFunctions_1.zendeskApiRequest.call(this, 'GET', '/webhooks');
                        for (const webhook of webhooks) {
                            if (webhook.endpoint === webhookUrl) {
                                webhookData.targetId = webhook.id;
                                break;
                            }
                        }
                        // no target was found
                        if (webhookData.targetId === undefined) {
                            return false;
                        }
                        endpoint = `/triggers/active`;
                        const triggers = yield GenericFunctions_1.zendeskApiRequestAllItems.call(this, 'triggers', 'GET', endpoint);
                        for (const trigger of triggers) {
                            const toDeleteTriggers = [];
                            // this trigger belong to the current target
                            if (trigger.actions[0].value[0].toString() === ((_a = webhookData.targetId) === null || _a === void 0 ? void 0 : _a.toString())) {
                                toDeleteTriggers.push(trigger.id);
                            }
                            // delete all trigger attach to this target;
                            if (toDeleteTriggers.length !== 0) {
                                yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', '/triggers/destroy_many', {}, { ids: toDeleteTriggers.join(',') });
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const service = this.getNodeParameter('service');
                        if (service === 'support') {
                            const message = {};
                            const resultAll = [], resultAny = [];
                            const conditions = this.getNodeParameter('conditions');
                            const options = this.getNodeParameter('options');
                            if (Object.keys(conditions).length === 0) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You must have at least one condition');
                            }
                            if (options.fields) {
                                for (const field of options.fields) {
                                    // @ts-ignore
                                    message[field] = `{{${field}}}`;
                                }
                            }
                            else {
                                message['ticket.id'] = '{{ticket.id}}';
                            }
                            const conditionsAll = conditions.all;
                            if (conditionsAll) {
                                for (const conditionAll of conditionsAll) {
                                    const aux = {};
                                    aux.field = conditionAll.field;
                                    aux.operator = conditionAll.operation;
                                    if (conditionAll.operation !== 'changed'
                                        && conditionAll.operation !== 'not_changed') {
                                        aux.value = conditionAll.value;
                                    }
                                    else {
                                        aux.value = null;
                                    }
                                    resultAll.push(aux);
                                }
                            }
                            const conditionsAny = conditions.any;
                            if (conditionsAny) {
                                for (const conditionAny of conditionsAny) {
                                    const aux = {};
                                    aux.field = conditionAny.field;
                                    aux.operator = conditionAny.operation;
                                    if (conditionAny.operation !== 'changed'
                                        && conditionAny.operation !== 'not_changed') {
                                        aux.value = conditionAny.value;
                                    }
                                    else {
                                        aux.value = null;
                                    }
                                    resultAny.push(aux);
                                }
                            }
                            const urlParts = new URL(webhookUrl);
                            const bodyTrigger = {
                                trigger: {
                                    title: `n8n-webhook:${urlParts.pathname}`,
                                    conditions: {
                                        all: resultAll,
                                        any: resultAny,
                                    },
                                    actions: [
                                        {
                                            field: 'notification_webhook',
                                            value: [],
                                        },
                                    ],
                                },
                            };
                            const bodyTarget = {
                                webhook: {
                                    name: 'n8n webhook',
                                    endpoint: webhookUrl,
                                    http_method: 'POST',
                                    status: 'active',
                                    request_format: 'json',
                                    subscriptions: [
                                        'conditional_ticket_events',
                                    ],
                                },
                            };
                            let target = {};
                            // if target id exists but trigger does not then reuse the target
                            // and create the trigger else create both
                            if (webhookData.targetId !== undefined) {
                                target.id = webhookData.targetId;
                            }
                            else {
                                // create a webhook
                                // https://developer.zendesk.com/api-reference/event-connectors/webhooks/webhooks/#create-or-clone-webhook
                                target = (yield GenericFunctions_1.zendeskApiRequest.call(this, 'POST', '/webhooks', bodyTarget)).webhook;
                            }
                            // @ts-ignore
                            bodyTrigger.trigger.actions[0].value = [target.id, JSON.stringify(message)];
                            const { trigger } = yield GenericFunctions_1.zendeskApiRequest.call(this, 'POST', '/triggers', bodyTrigger);
                            webhookData.webhookId = trigger.id;
                            webhookData.targetId = target.id;
                        }
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        try {
                            yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', `/triggers/${webhookData.webhookId}`);
                            yield GenericFunctions_1.zendeskApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.targetId}`);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.triggerId;
                        delete webhookData.targetId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.ZendeskTrigger = ZendeskTrigger;
