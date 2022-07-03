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
exports.AwsSns = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AwsSns {
    constructor() {
        this.description = {
            displayName: 'AWS SNS',
            name: 'awsSns',
            icon: 'file:sns.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["topic"]}}',
            description: 'Sends data to AWS SNS',
            defaults: {
                name: 'AWS SNS',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Publish',
                            value: 'publish',
                            description: 'Publish a message to a topic',
                        },
                    ],
                    default: 'publish',
                },
                {
                    displayName: 'Topic Name or ID',
                    name: 'topic',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getTopics',
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'publish',
                            ],
                        },
                    },
                    options: [],
                    default: '',
                    required: true,
                    description: 'The topic you want to publish to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'publish',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Subject when the message is delivered to email endpoints',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'publish',
                            ],
                        },
                    },
                    required: true,
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    description: 'The message you want to send',
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
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    const params = [
                        'TopicArn=' + this.getNodeParameter('topic', i),
                        'Subject=' + this.getNodeParameter('subject', i),
                        'Message=' + this.getNodeParameter('message', i),
                    ];
                    const responseData = yield GenericFunctions_1.awsApiRequestSOAP.call(this, 'sns', 'GET', '/?Action=Publish&' + params.join('&'));
                    returnData.push({ MessageId: responseData.PublishResponse.PublishResult.MessageId });
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
exports.AwsSns = AwsSns;
