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
exports.RabbitMQTrigger = void 0;
/* eslint-disable n8n-nodes-base/filesystem-wrong-node-filename */
const n8n_workflow_1 = require("n8n-workflow");
const DefaultOptions_1 = require("./DefaultOptions");
const GenericFunctions_1 = require("./GenericFunctions");
class RabbitMQTrigger {
    constructor() {
        this.description = {
            displayName: 'RabbitMQ Trigger',
            name: 'rabbitmqTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:rabbitmq.png',
            group: ['trigger'],
            version: 1,
            description: 'Listens to RabbitMQ messages',
            defaults: {
                name: 'RabbitMQ Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'rabbitmq',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Queue / Topic',
                    name: 'queue',
                    type: 'string',
                    default: '',
                    placeholder: 'queue-name',
                    description: 'The name of the queue to read from',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add Option',
                    options: [
                        {
                            displayName: 'Content Is Binary',
                            name: 'contentIsBinary',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to save the content as binary',
                        },
                        {
                            displayName: 'Delete From Queue When',
                            name: 'acknowledge',
                            type: 'options',
                            options: [
                                {
                                    name: 'Execution Finishes',
                                    value: 'executionFinishes',
                                    description: 'After the workflow execution finished. No matter if the execution was successful or not.',
                                },
                                {
                                    name: 'Execution Finishes Successfully',
                                    value: 'executionFinishesSuccessfully',
                                    description: 'After the workflow execution finished successfully',
                                },
                                {
                                    name: 'Immediately',
                                    value: 'immediately',
                                    description: 'As soon as the message got received',
                                },
                            ],
                            default: 'immediately',
                            description: 'When to acknowledge the message',
                        },
                        {
                            displayName: 'JSON Parse Body',
                            name: 'jsonParseBody',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    contentIsBinary: [
                                        true,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to parse the body to an object',
                        },
                        {
                            displayName: 'Only Content',
                            name: 'onlyContent',
                            type: 'boolean',
                            displayOptions: {
                                hide: {
                                    contentIsBinary: [
                                        true,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to return only the content property',
                        },
                        // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
                        {
                            displayName: 'Parallel Message Processing Limit',
                            name: 'parallelMessages',
                            type: 'number',
                            default: -1,
                            displayOptions: {
                                hide: {
                                    acknowledge: [
                                        'immediately',
                                    ],
                                },
                            },
                            description: 'Max number of executions at a time. Use -1 for no limit.',
                        },
                        ...DefaultOptions_1.rabbitDefaultOptions,
                    ].sort((a, b) => {
                        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) {
                            return -1;
                        }
                        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    }),
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = this.getNodeParameter('queue');
            const options = this.getNodeParameter('options', {});
            const channel = yield GenericFunctions_1.rabbitmqConnectQueue.call(this, queue, options);
            const self = this;
            let parallelMessages = (options.parallelMessages !== undefined && options.parallelMessages !== -1) ? parseInt(options.parallelMessages, 10) : -1;
            if (parallelMessages === 0 || parallelMessages < -1) {
                throw new Error('Parallel message processing limit must be greater than zero (or -1 for no limit)');
            }
            if (this.getMode() === 'manual') {
                // Do only catch a single message when executing manually, else messages will leak
                parallelMessages = 1;
            }
            let acknowledgeMode = options.acknowledge ? options.acknowledge : 'immediately';
            if (parallelMessages !== -1 && acknowledgeMode === 'immediately') {
                // If parallel message limit is set, then the default mode is "executionFinishes"
                // unless acknowledgeMode got set specifically. Be aware that the mode "immediately"
                // can not be supported in this case.
                acknowledgeMode = 'executionFinishes';
            }
            const messageTracker = new GenericFunctions_1.MessageTracker();
            let consumerTag;
            const startConsumer = () => __awaiter(this, void 0, void 0, function* () {
                if (parallelMessages !== -1) {
                    channel.prefetch(parallelMessages);
                }
                const consumerInfo = yield channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
                    if (message !== null) {
                        try {
                            if (acknowledgeMode !== 'immediately') {
                                messageTracker.received(message);
                            }
                            let content = message.content.toString();
                            const item = {
                                json: {},
                            };
                            if (options.contentIsBinary === true) {
                                item.binary = {
                                    data: yield this.helpers.prepareBinaryData(message.content),
                                };
                                item.json = message;
                                message.content = undefined;
                            }
                            else {
                                if (options.jsonParseBody === true) {
                                    content = JSON.parse(content);
                                }
                                if (options.onlyContent === true) {
                                    item.json = content;
                                }
                                else {
                                    message.content = content;
                                    item.json = message;
                                }
                            }
                            let responsePromise = undefined;
                            if (acknowledgeMode !== 'immediately') {
                                responsePromise = yield (0, n8n_workflow_1.createDeferredPromise)();
                            }
                            self.emit([
                                [
                                    item,
                                ],
                            ], undefined, responsePromise);
                            if (responsePromise) {
                                // Acknowledge message after the execution finished
                                yield responsePromise
                                    .promise()
                                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                                    if (data.data.resultData.error) {
                                        // The execution did fail
                                        if (acknowledgeMode === 'executionFinishesSuccessfully') {
                                            channel.nack(message);
                                            messageTracker.answered(message);
                                            return;
                                        }
                                    }
                                    channel.ack(message);
                                    messageTracker.answered(message);
                                }));
                            }
                            else {
                                // Acknowledge message directly
                                channel.ack(message);
                            }
                        }
                        catch (error) {
                            const workflow = this.getWorkflow();
                            const node = this.getNode();
                            if (acknowledgeMode !== 'immediately') {
                                messageTracker.answered(message);
                            }
                            n8n_workflow_1.LoggerProxy.error(`There was a problem with the RabbitMQ Trigger node "${node.name}" in workflow "${workflow.id}": "${error.message}"`, {
                                node: node.name,
                                workflowId: workflow.id,
                            });
                        }
                    }
                }));
                consumerTag = consumerInfo.consumerTag;
            });
            startConsumer();
            // The "closeFunction" function gets called by n8n whenever
            // the workflow gets deactivated and can so clean up.
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        return messageTracker.closeChannel(channel, consumerTag);
                    }
                    catch (error) {
                        const workflow = self.getWorkflow();
                        const node = self.getNode();
                        n8n_workflow_1.LoggerProxy.error(`There was a problem closing the RabbitMQ Trigger node connection "${node.name}" in workflow "${workflow.id}": "${error.message}"`, {
                            node: node.name,
                            workflowId: workflow.id,
                        });
                    }
                });
            }
            return {
                closeFunction,
            };
        });
    }
}
exports.RabbitMQTrigger = RabbitMQTrigger;
