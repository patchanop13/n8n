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
exports.RedisTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const redis_1 = __importDefault(require("redis"));
class RedisTrigger {
    constructor() {
        this.description = {
            displayName: 'Redis Trigger',
            name: 'redisTrigger',
            icon: 'file:redis.svg',
            group: ['trigger'],
            version: 1,
            description: 'Subscribe to redis channel',
            defaults: {
                name: 'Redis Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'redis',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Channels',
                    name: 'channels',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Channels to subscribe to, multiple channels be defined with comma. Wildcard character(*) is supported.',
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
                            description: 'Whether to try to parse the message to an object',
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
            const credentials = yield this.getCredentials('redis');
            const redisOptions = {
                host: credentials.host,
                port: credentials.port,
                db: credentials.database,
            };
            if (credentials.password) {
                redisOptions.password = credentials.password;
            }
            const channels = this.getNodeParameter('channels').split(',');
            const options = this.getNodeParameter('options');
            if (!channels) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Channels are mandatory!');
            }
            const client = redis_1.default.createClient(redisOptions);
            const self = this;
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield new Promise((resolve, reject) => {
                        client.on('connect', () => {
                            for (const channel of channels) {
                                client.psubscribe(channel);
                            }
                            client.on('pmessage', (pattern, channel, message) => {
                                if (options.jsonParseBody) {
                                    try {
                                        message = JSON.parse(message);
                                    }
                                    catch (error) { }
                                }
                                if (options.onlyMessage) {
                                    self.emit([self.helpers.returnJsonArray({ message })]);
                                    resolve(true);
                                    return;
                                }
                                self.emit([self.helpers.returnJsonArray({ channel, message })]);
                                resolve(true);
                            });
                        });
                        client.on('error', (error) => {
                            reject(error);
                        });
                    });
                });
            }
            if (this.getMode() === 'trigger') {
                yield manualTriggerFunction();
            }
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    client.quit();
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.RedisTrigger = RedisTrigger;
