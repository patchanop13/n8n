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
exports.AmqpTrigger = void 0;
const rhea_1 = require("rhea");
const n8n_workflow_1 = require("n8n-workflow");
class AmqpTrigger {
    constructor() {
        this.description = {
            displayName: 'AMQP Trigger',
            name: 'amqpTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:amqp.png',
            group: ['trigger'],
            version: 1,
            description: 'Listens to AMQP 1.0 Messages',
            defaults: {
                name: 'AMQP Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [{
                    name: 'amqp',
                    required: true,
                }],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'Queue / Topic',
                    name: 'sink',
                    type: 'string',
                    default: '',
                    placeholder: 'topic://sourcename.something',
                    description: 'Name of the queue of topic to listen to',
                },
                {
                    displayName: 'Clientname',
                    name: 'clientname',
                    type: 'string',
                    default: '',
                    placeholder: 'for durable/persistent topic subscriptions, example: "n8n"',
                    description: 'Leave empty for non-durable topic subscriptions or queues',
                },
                {
                    displayName: 'Subscription',
                    name: 'subscription',
                    type: 'string',
                    default: '',
                    placeholder: 'for durable/persistent topic subscriptions, example: "order-worker"',
                    description: 'Leave empty for non-durable topic subscriptions or queues',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Container ID',
                            name: 'containerId',
                            type: 'string',
                            default: '',
                            description: 'Will be used to pass to the RHEA Backend as container_id',
                        },
                        {
                            displayName: 'Convert Body To String',
                            name: 'jsonConvertByteArrayToString',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to convert JSON Body content (["body"]["content"]) from Byte Array to string. Needed for Azure Service Bus.',
                        },
                        {
                            displayName: 'JSON Parse Body',
                            name: 'jsonParseBody',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to parse the body to an object',
                        },
                        {
                            displayName: 'Messages per Cicle',
                            name: 'pullMessagesNumber',
                            type: 'number',
                            default: 100,
                            description: 'Number of messages to pull from the bus for every cicle',
                        },
                        {
                            displayName: 'Only Body',
                            name: 'onlyBody',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to return only the body property',
                        },
                        {
                            displayName: 'Reconnect',
                            name: 'reconnect',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to automatically reconnect if disconnected',
                        },
                        {
                            displayName: 'Reconnect Limit',
                            name: 'reconnectLimit',
                            type: 'number',
                            default: 50,
                            description: 'Maximum number of reconnect attempts',
                        },
                        {
                            displayName: 'Sleep Time',
                            name: 'sleepTime',
                            type: 'number',
                            default: 10,
                            description: 'Milliseconds to sleep after every cicle',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('amqp');
            const sink = this.getNodeParameter('sink', '');
            const clientname = this.getNodeParameter('clientname', '');
            const subscription = this.getNodeParameter('subscription', '');
            const options = this.getNodeParameter('options', {});
            const pullMessagesNumber = options.pullMessagesNumber || 100;
            const containerId = options.containerId;
            const containerReconnect = options.reconnect || true;
            const containerReconnectLimit = options.reconnectLimit || 50;
            if (sink === '') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Queue or Topic required!');
            }
            let durable = false;
            if (subscription && clientname) {
                durable = true;
            }
            const container = (0, rhea_1.create_container)();
            let lastMsgId = undefined;
            const self = this;
            container.on('receiver_open', (context) => {
                var _a;
                (_a = context.receiver) === null || _a === void 0 ? void 0 : _a.add_credit(pullMessagesNumber);
            });
            container.on('message', (context) => {
                var _a;
                // No message in the context
                if (!context.message) {
                    return;
                }
                // ignore duplicate message check, don't think it's necessary, but it was in the rhea-lib example code
                if (context.message.message_id && context.message.message_id === lastMsgId) {
                    return;
                }
                lastMsgId = context.message.message_id;
                let data = context.message;
                if (options.jsonConvertByteArrayToString === true && data.body.content !== undefined) {
                    // The buffer is not ready... Stringify and parse back to load it.
                    const cont = JSON.stringify(data.body.content);
                    data.body = String.fromCharCode.apply(null, JSON.parse(cont).data);
                }
                if (options.jsonConvertByteArrayToString === true && data.body.content !== undefined) {
                    // The buffer is not ready... Stringify and parse back to load it.
                    const cont = JSON.stringify(data.body.content);
                    data.body = String.fromCharCode.apply(null, JSON.parse(cont).data);
                }
                if (options.jsonConvertByteArrayToString === true && data.body.content !== undefined) {
                    // The buffer is not ready... Stringify and parse back to load it.
                    const content = JSON.stringify(data.body.content);
                    data.body = String.fromCharCode.apply(null, JSON.parse(content).data);
                }
                if (options.jsonParseBody === true) {
                    data.body = JSON.parse(data.body);
                }
                if (options.onlyBody === true) {
                    data = data.body;
                }
                self.emit([self.helpers.returnJsonArray([data])]); // tslint:disable-line:no-any
                if (!((_a = context.receiver) === null || _a === void 0 ? void 0 : _a.has_credit())) {
                    setTimeout(() => {
                        var _a;
                        (_a = context.receiver) === null || _a === void 0 ? void 0 : _a.add_credit(pullMessagesNumber);
                    }, options.sleepTime || 10);
                }
            });
            /*
                Values are documentet here: https://github.com/amqp/rhea#container
             */
            const connectOptions = {
                host: credentials.hostname,
                hostname: credentials.hostname,
                port: credentials.port,
                reconnect: containerReconnect,
                reconnect_limit: containerReconnectLimit,
                username: credentials.username ? credentials.username : undefined,
                password: credentials.password ? credentials.password : undefined,
                transport: credentials.transportType ? credentials.transportType : undefined,
                container_id: containerId ? containerId : undefined,
                id: containerId ? containerId : undefined,
            };
            const connection = container.connect(connectOptions);
            const clientOptions = {
                name: subscription ? subscription : undefined,
                source: {
                    address: sink,
                    durable: (durable ? 2 : undefined),
                    expiry_policy: (durable ? 'never' : undefined),
                },
                credit_window: 0, // prefetch 1
            };
            connection.open_receiver(clientOptions);
            // The "closeFunction" function gets called by n8n whenever
            // the workflow gets deactivated and can so clean up.
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    container.removeAllListeners('receiver_open');
                    container.removeAllListeners('message');
                    connection.close();
                });
            }
            // The "manualTriggerFunction" function gets called by n8n
            // when a user is in the workflow editor and starts the
            // workflow manually.
            // for AMQP it doesn't make much sense to wait here but
            // for a new user who doesn't know how this works, it's better to wait and show a respective info message
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield new Promise((resolve, reject) => {
                        const timeoutHandler = setTimeout(() => {
                            reject(new Error('Aborted, no message received within 30secs. This 30sec timeout is only set for "manually triggered execution". Active Workflows will listen indefinitely.'));
                        }, 30000);
                        container.on('message', (context) => {
                            // Check if the only property present in the message is body
                            // in which case we only emit the content of the body property
                            // otherwise we emit all properties and their content
                            const message = context.message;
                            if (Object.keys(message)[0] === 'body' && Object.keys(message).length === 1) {
                                self.emit([self.helpers.returnJsonArray([message.body])]);
                            }
                            else {
                                self.emit([self.helpers.returnJsonArray([message])]); // tslint:disable-line:no-any
                            }
                            clearTimeout(timeoutHandler);
                            resolve(true);
                        });
                    });
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.AmqpTrigger = AmqpTrigger;
