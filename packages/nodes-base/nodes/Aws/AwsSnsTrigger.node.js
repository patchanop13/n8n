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
exports.AwsSnsTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const lodash_1 = require("lodash");
class AwsSnsTrigger {
    constructor() {
        this.description = {
            displayName: 'AWS SNS Trigger',
            subtitle: `={{$parameter["topic"].split(':')[5]}}`,
            name: 'awsSnsTrigger',
            icon: 'file:sns.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle AWS SNS events via webhooks',
            defaults: {
                name: 'AWS-SNS-Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
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
                    displayName: 'Topic Name or ID',
                    name: 'topic',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getTopics',
                    },
                    default: '',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available topics to display them to user so that he can
                // select them easily
                getTopics() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const data = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=ListTopics');
                        let topics = data.ListTopicsResponse.ListTopicsResult.Topics.member;
                        if (!Array.isArray(topics)) {
                            // If user has only a single topic no array get returned so we make
                            // one manually to be able to process everything identically
                            topics = [topics];
                        }
                        for (const topic of topics) {
                            const topicArn = topic.TopicArn;
                            const topicName = topicArn.split(':')[5];
                            returnData.push({
                                name: topicName,
                                value: topicArn,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const topic = this.getNodeParameter('topic');
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const params = [
                            `TopicArn=${topic}`,
                            'Version=2010-03-31',
                        ];
                        const data = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=ListSubscriptionsByTopic&' + params.join('&'));
                        const subscriptions = (0, lodash_1.get)(data, 'ListSubscriptionsByTopicResponse.ListSubscriptionsByTopicResult.Subscriptions');
                        if (!subscriptions || !subscriptions.member) {
                            return false;
                        }
                        let subscriptionMembers = subscriptions.member;
                        if (!Array.isArray(subscriptionMembers)) {
                            subscriptionMembers = [subscriptionMembers];
                        }
                        for (const subscription of subscriptionMembers) {
                            if (webhookData.webhookId === subscription.SubscriptionArn) {
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const topic = this.getNodeParameter('topic');
                        if (webhookUrl.includes('%20')) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The name of the SNS Trigger Node is not allowed to contain any spaces!');
                        }
                        const params = [
                            `TopicArn=${topic}`,
                            `Endpoint=${webhookUrl}`,
                            `Protocol=${webhookUrl === null || webhookUrl === void 0 ? void 0 : webhookUrl.split(':')[0]}`,
                            'ReturnSubscriptionArn=true',
                            'Version=2010-03-31',
                        ];
                        const { SubscribeResponse } = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=Subscribe&' + params.join('&'));
                        webhookData.webhookId = SubscribeResponse.SubscribeResult.SubscriptionArn;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const params = [
                            `SubscriptionArn=${webhookData.webhookId}`,
                            'Version=2010-03-31',
                        ];
                        try {
                            yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=Unsubscribe&' + params.join('&'));
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const topic = this.getNodeParameter('topic');
            // @ts-ignore
            const body = JSON.parse((req.rawBody).toString());
            if (body.Type === 'SubscriptionConfirmation' &&
                body.TopicArn === topic) {
                const { Token } = body;
                const params = [
                    `TopicArn=${topic}`,
                    `Token=${Token}`,
                    'Version=2010-03-31',
                ];
                yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=ConfirmSubscription&' + params.join('&'));
                return {
                    noWebhookResponse: true,
                };
            }
            if (body.Type === 'UnsubscribeConfirmation') {
                return {};
            }
            //TODO verify message signature
            return {
                workflowData: [
                    this.helpers.returnJsonArray(body),
                ],
            };
        });
    }
}
exports.AwsSnsTrigger = AwsSnsTrigger;
