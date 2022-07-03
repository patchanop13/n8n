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
exports.KafkaTrigger = void 0;
const kafkajs_1 = require("kafkajs");
const confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry");
const n8n_workflow_1 = require("n8n-workflow");
class KafkaTrigger {
    constructor() {
        this.description = {
            displayName: 'Kafka Trigger',
            name: 'kafkaTrigger',
            icon: 'file:kafka.svg',
            group: ['trigger'],
            version: 1,
            description: 'Consume messages from a Kafka topic',
            defaults: {
                name: 'Kafka Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'kafka',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Topic',
                    name: 'topic',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'topic-name',
                    description: 'Name of the queue of topic to consume from',
                },
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'n8n-kafka',
                    description: 'ID of the consumer group',
                },
                {
                    displayName: 'Use Schema Registry',
                    name: 'useSchemaRegistry',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to use Confluent Schema Registry',
                },
                {
                    displayName: 'Schema Registry URL',
                    name: 'schemaRegistryUrl',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            useSchemaRegistry: [
                                true,
                            ],
                        },
                    },
                    placeholder: 'https://schema-registry-domain:8081',
                    default: '',
                    description: 'URL of the schema registry',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add Option',
                    options: [
                        {
                            displayName: 'Allow Topic Creation',
                            name: 'allowAutoTopicCreation',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to allow sending message to a previously non exisiting topic',
                        },
                        {
                            displayName: 'Read Messages From Beginning',
                            name: 'fromBeginning',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to read message from beginning',
                        },
                        {
                            displayName: 'JSON Parse Message',
                            name: 'jsonParseMessage',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to try to parse the message to an object',
                        },
                        {
                            displayName: 'Only Message',
                            name: 'onlyMessage',
                            type: 'boolean',
                            displayOptions: {
                                show: {
                                    jsonParseMessage: [
                                        true,
                                    ],
                                },
                            },
                            default: false,
                            description: 'Whether to return only the message property',
                        },
                        {
                            displayName: 'Session Timeout',
                            name: 'sessionTimeout',
                            type: 'number',
                            default: 30000,
                            description: 'The time to await a response in ms',
                        },
                        {
                            displayName: 'Return Headers',
                            name: 'returnHeaders',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to return the headers received from Kafka',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = this.getNodeParameter('topic');
            const groupId = this.getNodeParameter('groupId');
            const credentials = yield this.getCredentials('kafka');
            const brokers = (credentials.brokers || '').split(',').map(item => item.trim());
            const clientId = credentials.clientId;
            const ssl = credentials.ssl;
            const config = {
                clientId,
                brokers,
                ssl,
                logLevel: kafkajs_1.logLevel.ERROR,
            };
            if (credentials.authentication === true) {
                if (!(credentials.username && credentials.password)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Username and password are required for authentication');
                }
                config.sasl = {
                    username: credentials.username,
                    password: credentials.password,
                    mechanism: credentials.saslMechanism,
                };
            }
            const kafka = new kafkajs_1.Kafka(config);
            const consumer = kafka.consumer({ groupId });
            yield consumer.connect();
            const options = this.getNodeParameter('options', {});
            yield consumer.subscribe({ topic, fromBeginning: (options.fromBeginning) ? true : false });
            const self = this;
            const useSchemaRegistry = this.getNodeParameter('useSchemaRegistry', 0);
            const schemaRegistryUrl = this.getNodeParameter('schemaRegistryUrl', 0);
            const startConsumer = () => __awaiter(this, void 0, void 0, function* () {
                yield consumer.run({
                    eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        let data = {};
                        let value = (_a = message.value) === null || _a === void 0 ? void 0 : _a.toString();
                        if (options.jsonParseMessage) {
                            try {
                                value = JSON.parse(value);
                            }
                            catch (error) { }
                        }
                        if (useSchemaRegistry) {
                            try {
                                const registry = new confluent_schema_registry_1.SchemaRegistry({ host: schemaRegistryUrl });
                                value = yield registry.decode(message.value);
                            }
                            catch (error) { }
                        }
                        if (options.returnHeaders && message.headers) {
                            const headers = {};
                            for (const key of Object.keys(message.headers)) {
                                const header = message.headers[key];
                                headers[key] = (header === null || header === void 0 ? void 0 : header.toString('utf8')) || '';
                            }
                            data.headers = headers;
                        }
                        data.message = value;
                        data.topic = topic;
                        if (options.onlyMessage) {
                            //@ts-ignore
                            data = value;
                        }
                        self.emit([self.helpers.returnJsonArray([data])]);
                    }),
                });
            });
            startConsumer();
            // The "closeFunction" function gets called by n8n whenever
            // the workflow gets deactivated and can so clean up.
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield consumer.disconnect();
                });
            }
            // The "manualTriggerFunction" function gets called by n8n
            // when a user is in the workflow editor and starts the
            // workflow manually. So the function has to make sure that
            // the emit() gets called with similar data like when it
            // would trigger by itself so that the user knows what data
            // to expect.
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    startConsumer();
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.KafkaTrigger = KafkaTrigger;
