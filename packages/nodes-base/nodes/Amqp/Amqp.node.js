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
exports.Amqp = void 0;
const rhea_1 = require("rhea");
const n8n_workflow_1 = require("n8n-workflow");
class Amqp {
    constructor() {
        this.description = {
            displayName: 'AMQP Sender',
            name: 'amqp',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:amqp.png',
            group: ['transform'],
            version: 1,
            description: 'Sends a raw-message via AMQP 1.0, executed once per item',
            defaults: {
                name: 'AMQP Sender',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{
                    name: 'amqp',
                    required: true,
                }],
            properties: [
                {
                    displayName: 'Queue / Topic',
                    name: 'sink',
                    type: 'string',
                    default: '',
                    placeholder: 'topic://sourcename.something',
                    description: 'Name of the queue of topic to publish to',
                },
                // Header Parameters
                {
                    displayName: 'Headers',
                    name: 'headerParametersJson',
                    type: 'json',
                    default: '',
                    description: 'Header parameters as JSON (flat object). Sent as application_properties in amqp-message meta info.',
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
                            displayName: 'Data as Object',
                            name: 'dataAsObject',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to send the data as an object',
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
                            displayName: 'Send Property',
                            name: 'sendOnlyProperty',
                            type: 'string',
                            default: '',
                            description: 'The only property to send. If empty the whole item will be sent.',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = yield this.getCredentials('amqp');
                const sink = this.getNodeParameter('sink', 0, '');
                const applicationProperties = this.getNodeParameter('headerParametersJson', 0, {});
                const options = this.getNodeParameter('options', 0, {});
                const containerId = options.containerId;
                const containerReconnect = options.reconnect || true;
                const containerReconnectLimit = options.reconnectLimit || 50;
                let headerProperties; // tslint:disable-line:no-any
                if (typeof applicationProperties === 'string' && applicationProperties !== '') {
                    headerProperties = JSON.parse(applicationProperties);
                }
                else {
                    headerProperties = applicationProperties;
                }
                if (sink === '') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Queue or Topic required!');
                }
                const container = (0, rhea_1.create_container)();
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
                const conn = container.connect(connectOptions);
                const sender = conn.open_sender(sink);
                const responseData = yield new Promise((resolve) => {
                    container.once('sendable', (context) => {
                        var _a;
                        const returnData = [];
                        const items = this.getInputData();
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            let body = item.json;
                            const sendOnlyProperty = options.sendOnlyProperty;
                            if (sendOnlyProperty) {
                                body = body[sendOnlyProperty];
                            }
                            if (options.dataAsObject !== true) {
                                body = JSON.stringify(body);
                            }
                            const result = (_a = context.sender) === null || _a === void 0 ? void 0 : _a.send({
                                application_properties: headerProperties,
                                body,
                            });
                            returnData.push({ id: result === null || result === void 0 ? void 0 : result.id });
                        }
                        resolve(returnData);
                    });
                });
                sender.close();
                conn.close();
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
exports.Amqp = Amqp;
