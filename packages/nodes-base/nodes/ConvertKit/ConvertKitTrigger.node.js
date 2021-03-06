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
exports.ConvertKitTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
class ConvertKitTrigger {
    constructor() {
        this.description = {
            displayName: 'ConvertKit Trigger',
            name: 'convertKitTrigger',
            icon: 'file:convertKit.svg',
            subtitle: '={{$parameter["event"]}}',
            group: ['trigger'],
            version: 1,
            description: 'Handle ConvertKit events via webhooks',
            defaults: {
                name: 'ConvertKit Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'convertKitApi',
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
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    default: '',
                    description: 'The events that can trigger the webhook and whether they are enabled',
                    options: [
                        {
                            name: 'Form Subscribe',
                            value: 'formSubscribe',
                        },
                        {
                            name: 'Link Click',
                            value: 'linkClick',
                        },
                        {
                            name: 'Product Purchase',
                            value: 'productPurchase',
                        },
                        {
                            name: 'Purchase Created',
                            value: 'purchaseCreate',
                        },
                        {
                            name: 'Sequence Complete',
                            value: 'courseComplete',
                        },
                        {
                            name: 'Sequence Subscribe',
                            value: 'courseSubscribe',
                        },
                        {
                            name: 'Subscriber Activated',
                            value: 'subscriberActivate',
                        },
                        {
                            name: 'Subscriber Unsubscribe',
                            value: 'subscriberUnsubscribe',
                        },
                        {
                            name: 'Tag Add',
                            value: 'tagAdd',
                        },
                        {
                            name: 'Tag Remove',
                            value: 'tagRemove',
                        },
                    ],
                },
                {
                    displayName: 'Form Name or ID',
                    name: 'formId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getForms',
                    },
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            event: [
                                'formSubscribe',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Sequence Name or ID',
                    name: 'courseId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getSequences',
                    },
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            event: [
                                'courseSubscribe',
                                'courseComplete',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Initiating Link',
                    name: 'link',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The URL of the initiating link',
                    displayOptions: {
                        show: {
                            event: [
                                'linkClick',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Product ID',
                    name: 'productId',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            event: [
                                'productPurchase',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Tag Name or ID',
                    name: 'tagId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getTags',
                    },
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            event: [
                                'tagAdd',
                                'tagRemove',
                            ],
                        },
                    },
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { tags } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/tags');
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = tag.id;
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the forms to display them to user so that he can
                // select them easily
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { forms } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/forms');
                        for (const form of forms) {
                            const formName = form.name;
                            const formId = form.id;
                            returnData.push({
                                name: formName,
                                value: formId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the sequences to display them to user so that he can
                // select them easily
                getSequences() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { courses } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/sequences');
                        for (const course of courses) {
                            const courseName = course.name;
                            const courseId = course.id;
                            returnData.push({
                                name: courseName,
                                value: courseId,
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
                        const webhookData = this.getWorkflowStaticData('node');
                        // THe API does not have an endpoint to list all webhooks
                        if (webhookData.webhookId) {
                            return true;
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        let event = this.getNodeParameter('event', 0);
                        const endpoint = '/automations/hooks';
                        if (event === 'purchaseCreate') {
                            event = `purchase.${(0, change_case_1.snakeCase)(event)}`;
                        }
                        else {
                            event = `subscriber.${(0, change_case_1.snakeCase)(event)}`;
                        }
                        const body = {
                            target_url: webhookUrl,
                            event: {
                                name: event,
                            },
                        };
                        if (event === 'subscriber.form_subscribe') {
                            //@ts-ignore
                            body.event['form_id'] = this.getNodeParameter('formId', 0);
                        }
                        if (event === 'subscriber.course_subscribe' || event === 'subscriber.course_complete') {
                            //@ts-ignore
                            body.event['sequence_id'] = this.getNodeParameter('courseId', 0);
                        }
                        if (event === 'subscriber.link_click') {
                            //@ts-ignore
                            body.event['initiator_value'] = this.getNodeParameter('link', 0);
                        }
                        if (event === 'subscriber.product_purchase') {
                            //@ts-ignore
                            body.event['product_id'] = this.getNodeParameter('productId', 0);
                        }
                        if (event === 'subscriber.tag_add' || event === 'subscriber.tag_remove') {
                            //@ts-ignore
                            body.event['tag_id'] = this.getNodeParameter('tagId', 0);
                        }
                        const webhook = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', endpoint, body);
                        if (webhook.rule.id === undefined) {
                            return false;
                        }
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = webhook.rule.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/automations/hooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.convertKitApiRequest.call(this, 'DELETE', endpoint);
                            }
                            catch (error) {
                                return false;
                            }
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
            const returnData = [];
            returnData.push(this.getBodyData());
            return {
                workflowData: [
                    this.helpers.returnJsonArray(returnData),
                ],
            };
        });
    }
}
exports.ConvertKitTrigger = ConvertKitTrigger;
