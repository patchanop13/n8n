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
exports.Kafka = void 0;
const kafkajs_1 = require("kafkajs");
const confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry");
const n8n_workflow_1 = require("n8n-workflow");
class Kafka {
    constructor() {
        this.description = {
            displayName: 'Kafka',
            name: 'kafka',
            icon: 'file:kafka.svg',
            group: ['transform'],
            version: 1,
            description: 'Sends messages to a Kafka topic',
            defaults: {
                name: 'Kafka',
            },
            inputs: ['main'],
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
                    placeholder: 'topic-name',
                    description: 'Name of the queue of topic to publish to',
                },
                {
                    displayName: 'Send Input Data',
                    name: 'sendInputData',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to send the the data the node receives as JSON to Kafka',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    displayOptions: {
                        show: {
                            sendInputData: [
                                false,
                            ],
                        },
                    },
                    default: '',
                    description: 'The message to be sent',
                },
                {
                    displayName: 'JSON Parameters',
                    name: 'jsonParameters',
                    type: 'boolean',
                    default: false,
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
                    displayName: 'Event Name',
                    name: 'eventName',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            useSchemaRegistry: [
                                true,
                            ],
                        },
                    },
                    default: '',
                    description: 'Namespace and Name of Schema in Schema Registry (namespace.name)',
                },
                {
                    displayName: 'Headers',
                    name: 'headersUi',
                    placeholder: 'Add Header',
                    type: 'fixedCollection',
                    displayOptions: {
                        show: {
                            jsonParameters: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    options: [
                        {
                            name: 'headerValues',
                            displayName: 'Header',
                            values: [
                                {
                                    displayName: 'Key',
                                    name: 'key',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Headers (JSON)',
                    name: 'headerParametersJson',
                    type: 'json',
                    displayOptions: {
                        show: {
                            jsonParameters: [
                                true,
                            ],
                        },
                    },
                    default: '',
                    description: 'Header parameters as JSON (flat object)',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add Option',
                    options: [
                        {
                            displayName: 'Acks',
                            name: 'acks',
                            type: 'boolean',
                            default: false,
                            description: 'Whether or not producer must wait for acknowledgement from all replicas',
                        },
                        {
                            displayName: 'Compression',
                            name: 'compression',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to send the data in a compressed format using the GZIP codec',
                        },
                        {
                            displayName: 'Timeout',
                            name: 'timeout',
                            type: 'number',
                            default: 30000,
                            description: 'The time to await a response in ms',
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
            const topicMessages = [];
            let responseData;
            try {
                const options = this.getNodeParameter('options', 0);
                const sendInputData = this.getNodeParameter('sendInputData', 0);
                const useSchemaRegistry = this.getNodeParameter('useSchemaRegistry', 0);
                const timeout = options.timeout;
                let compression = kafkajs_1.CompressionTypes.None;
                const acks = (options.acks === true) ? 1 : 0;
                if (options.compression === true) {
                    compression = kafkajs_1.CompressionTypes.GZIP;
                }
                const credentials = yield this.getCredentials('kafka');
                const brokers = (credentials.brokers || '').split(',').map(item => item.trim());
                const clientId = credentials.clientId;
                const ssl = credentials.ssl;
                const config = {
                    clientId,
                    brokers,
                    ssl,
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
                const producer = kafka.producer();
                yield producer.connect();
                let message;
                for (let i = 0; i < length; i++) {
                    if (sendInputData === true) {
                        message = JSON.stringify(items[i].json);
                    }
                    else {
                        message = this.getNodeParameter('message', i);
                    }
                    if (useSchemaRegistry) {
                        try {
                            const schemaRegistryUrl = this.getNodeParameter('schemaRegistryUrl', 0);
                            const eventName = this.getNodeParameter('eventName', 0);
                            const registry = new confluent_schema_registry_1.SchemaRegistry({ host: schemaRegistryUrl });
                            const id = yield registry.getLatestSchemaId(eventName);
                            message = yield registry.encode(id, JSON.parse(message));
                        }
                        catch (exception) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Verify your Schema Registry configuration');
                        }
                    }
                    const topic = this.getNodeParameter('topic', i);
                    const jsonParameters = this.getNodeParameter('jsonParameters', i);
                    let headers;
                    if (jsonParameters === true) {
                        headers = this.getNodeParameter('headerParametersJson', i);
                        try {
                            headers = JSON.parse(headers);
                        }
                        catch (exception) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Headers must be a valid json');
                        }
                    }
                    else {
                        const values = this.getNodeParameter('headersUi', i).headerValues;
                        headers = {};
                        if (values !== undefined) {
                            for (const value of values) {
                                //@ts-ignore
                                headers[value.key] = value.value;
                            }
                        }
                    }
                    topicMessages.push({
                        topic,
                        messages: [{
                                value: message,
                                headers,
                            }],
                    });
                }
                responseData = yield producer.sendBatch({
                    topicMessages,
                    timeout,
                    compression,
                    acks,
                });
                if (responseData.length === 0) {
                    responseData.push({
                        success: true,
                    });
                }
                yield producer.disconnect();
                return [this.helpers.returnJsonArray(responseData)];
            }
            catch (error) {
                if (this.continueOnFail()) {
                    return [this.helpers.returnJsonArray({ error: error.message })];
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.Kafka = Kafka;
