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
exports.MqttTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const mqtt_1 = __importDefault(require("mqtt"));
class MqttTrigger {
    constructor() {
        this.description = {
            displayName: 'MQTT Trigger',
            name: 'mqttTrigger',
            icon: 'file:mqtt.svg',
            group: ['trigger'],
            version: 1,
            description: 'Listens to MQTT events',
            defaults: {
                name: 'MQTT Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mqtt',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Topics',
                    name: 'topics',
                    type: 'string',
                    default: '',
                    description: 'Topics to subscribe to, multiple can be defined with comma. Wildcard characters are supported (+ - for single level and # - for multi level). By default all subscription used QoS=0. To set a different QoS, write the QoS desired after the topic preceded by a colom. For Example: topicA:1,topicB:2',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'JSON Parse Body',
                            name: 'jsonParseBody',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to try parse the message to an object',
                        },
                        {
                            displayName: 'Only Message',
                            name: 'onlyMessage',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to return only the message property',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('mqtt');
            const topics = this.getNodeParameter('topics').split(',');
            const topicsQoS = {};
            for (const data of topics) {
                const [topic, qos] = data.split(':');
                topicsQoS[topic] = (qos) ? { qos: parseInt(qos, 10) } : { qos: 0 };
            }
            const options = this.getNodeParameter('options');
            if (!topics) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Topics are mandatory!');
            }
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
            const self = this;
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield new Promise((resolve, reject) => {
                        client.on('connect', () => {
                            client.subscribe(topicsQoS, (err, granted) => {
                                if (err) {
                                    reject(err);
                                }
                                client.on('message', (topic, message) => {
                                    let result = {};
                                    message = message.toString();
                                    if (options.jsonParseBody) {
                                        try {
                                            message = JSON.parse(message.toString());
                                        }
                                        catch (err) { }
                                    }
                                    result.message = message;
                                    result.topic = topic;
                                    if (options.onlyMessage) {
                                        //@ts-ignore
                                        result = [message];
                                    }
                                    self.emit([self.helpers.returnJsonArray(result)]);
                                    resolve(true);
                                });
                            });
                        });
                        client.on('error', (error) => {
                            reject(error);
                        });
                    });
                });
            }
            if (this.getMode() === 'trigger') {
                manualTriggerFunction();
            }
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    client.end();
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.MqttTrigger = MqttTrigger;
