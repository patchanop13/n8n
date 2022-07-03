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
exports.Mqtt = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
class Mqtt {
    constructor() {
        this.description = {
            displayName: 'MQTT',
            name: 'mqtt',
            icon: 'file:mqtt.svg',
            group: ['input'],
            version: 1,
            description: 'Push messages to MQTT',
            defaults: {
                name: 'MQTT',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mqtt',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Topic',
                    name: 'topic',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The topic to publish to',
                },
                {
                    displayName: 'Send Input Data',
                    name: 'sendInputData',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to send the the data the node receives as JSON',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            sendInputData: [
                                false,
                            ],
                        },
                    },
                    default: '',
                    description: 'The message to publish',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'QoS',
                            name: 'qos',
                            type: 'options',
                            options: [
                                {
                                    name: 'Received at Most Once',
                                    value: 0,
                                },
                                {
                                    name: 'Received at Least Once',
                                    value: 1,
                                },
                                {
                                    name: 'Exactly Once',
                                    value: 2,
                                },
                            ],
                            default: 0,
                            description: 'QoS subscription level',
                        },
                        {
                            displayName: 'Retain',
                            name: 'retain',
                            type: 'boolean',
                            default: false,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'Normally if a publisher publishes a message to a topic, and no one is subscribed to that topic the message is simply discarded by the broker. However the publisher can tell the broker to keep the last message on that topic by setting the retain flag to true.',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const length = items.length;
            const credentials = yield this.getCredentials('mqtt');
            const protocol = credentials.protocol || 'mqtt';
            const host = credentials.host;
            const brokerUrl = `${protocol}://${host}`;
            const port = credentials.port || 1883;
            const clientId = credentials.clientId || `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
            const clean = credentials.clean;
            const ssl = credentials.ssl;
            const ca = credentials.ca;
            const cert = credentials.cert;
            const key = credentials.key;
            const rejectUnauthorized = credentials.rejectUnauthorized;
            let client;
            if (ssl === false) {
                const clientOptions = {
                    port,
                    clean,
                    clientId,
                };
                if (credentials.username && credentials.password) {
                    clientOptions.username = credentials.username;
                    clientOptions.password = credentials.password;
                }
                client = mqtt_1.default.connect(brokerUrl, clientOptions);
            }
            else {
                const clientOptions = {
                    port,
                    clean,
                    clientId,
                    ca,
                    cert,
                    key,
                    rejectUnauthorized,
                };
                if (credentials.username && credentials.password) {
                    clientOptions.username = credentials.username;
                    clientOptions.password = credentials.password;
                }
                client = mqtt_1.default.connect(brokerUrl, clientOptions);
            }
            const sendInputData = this.getNodeParameter('sendInputData', 0);
            // tslint:disable-next-line: no-any
            const data = yield new Promise((resolve, reject) => {
                client.on('connect', () => {
                    for (let i = 0; i < length; i++) {
                        let message;
                        const topic = this.getNodeParameter('topic', i);
                        const options = this.getNodeParameter('options', i);
                        try {
                            if (sendInputData === true) {
                                message = JSON.stringify(items[i].json);
                            }
                            else {
                                message = this.getNodeParameter('message', i);
                            }
                            client.publish(topic, message, options);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    //wait for the in-flight messages to be acked.
                    //needed for messages with QoS 1 & 2
                    client.end(false, {}, () => {
                        resolve([items]);
                    });
                    client.on('error', (e) => {
                        reject(e);
                    });
                });
            });
            return data;
        });
    }
}
exports.Mqtt = Mqtt;
