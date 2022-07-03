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
exports.Redis = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const redis_1 = __importDefault(require("redis"));
const util_1 = __importDefault(require("util"));
class Redis {
    constructor() {
        this.description = {
            displayName: 'Redis',
            name: 'redis',
            icon: 'file:redis.svg',
            group: ['input'],
            version: 1,
            description: 'Get, send and update data in Redis',
            defaults: {
                name: 'Redis',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'redis',
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
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a key from Redis',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get the value of a key from Redis',
                        },
                        {
                            name: 'Increment',
                            value: 'incr',
                            description: 'Atomically increments a key by 1. Creates the key if it does not exist.',
                        },
                        {
                            name: 'Info',
                            value: 'info',
                            description: 'Returns generic information about the Redis instance',
                        },
                        {
                            name: 'Keys',
                            value: 'keys',
                            description: 'Returns all the keys matching a pattern',
                        },
                        {
                            name: 'Publish',
                            value: 'publish',
                            description: 'Publish message to redis channel',
                        },
                        {
                            name: 'Set',
                            value: 'set',
                            description: 'Set the value of a key in redis',
                        },
                    ],
                    default: 'info',
                },
                // ----------------------------------
                //         get
                // ----------------------------------
                {
                    displayName: 'Name',
                    name: 'propertyName',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                        },
                    },
                    default: 'propertyName',
                    required: true,
                    description: 'Name of the property to write received data to. Supports dot-notation. Example: "data.person[0].name"',
                },
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the key to delete from Redis',
                },
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the key to get from Redis',
                },
                {
                    displayName: 'Key Type',
                    name: 'keyType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Automatic',
                            value: 'automatic',
                            description: 'Requests the type before requesting the data (slower)',
                        },
                        {
                            name: 'Hash',
                            value: 'hash',
                            description: 'Data in key is of type \'hash\'',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Data in key is of type \'lists\'',
                        },
                        {
                            name: 'Sets',
                            value: 'sets',
                            description: 'Data in key is of type \'sets\'',
                        },
                        {
                            name: 'String',
                            value: 'string',
                            description: 'Data in key is of type \'string\'',
                        },
                    ],
                    default: 'automatic',
                    description: 'The type of the key to get',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                        },
                    },
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Dot Notation',
                            name: 'dotNotation',
                            type: 'boolean',
                            default: true,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: '<p>By default, dot-notation is used in property names. This means that "a.b" will set the property "b" underneath "a" so { "a": { "b": value} }.<p></p>If that is not intended this can be deactivated, it will then set { "a.b": value } instead.</p>.',
                        },
                    ],
                },
                // ----------------------------------
                //         incr
                // ----------------------------------
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'incr',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the key to increment',
                },
                {
                    displayName: 'Expire',
                    name: 'expire',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'incr',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to set a timeout on key',
                },
                {
                    displayName: 'TTL',
                    name: 'ttl',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'incr',
                            ],
                            expire: [
                                true,
                            ],
                        },
                    },
                    default: 60,
                    description: 'Number of seconds before key expiration',
                },
                // ----------------------------------
                //         keys
                // ----------------------------------
                {
                    displayName: 'Key Pattern',
                    name: 'keyPattern',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'keys',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The key pattern for the keys to return',
                },
                // ----------------------------------
                //         set
                // ----------------------------------
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'set',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Name of the key to set in Redis',
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'set',
                            ],
                        },
                    },
                    default: '',
                    description: 'The value to write in Redis',
                },
                {
                    displayName: 'Key Type',
                    name: 'keyType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: [
                                'set',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Automatic',
                            value: 'automatic',
                            description: 'Tries to figure out the type automatically depending on the data',
                        },
                        {
                            name: 'Hash',
                            value: 'hash',
                            description: 'Data in key is of type \'hash\'',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Data in key is of type \'lists\'',
                        },
                        {
                            name: 'Sets',
                            value: 'sets',
                            description: 'Data in key is of type \'sets\'',
                        },
                        {
                            name: 'String',
                            value: 'string',
                            description: 'Data in key is of type \'string\'',
                        },
                    ],
                    default: 'automatic',
                    description: 'The type of the key to set',
                },
                {
                    displayName: 'Expire',
                    name: 'expire',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'set',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to set a timeout on key',
                },
                {
                    displayName: 'TTL',
                    name: 'ttl',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'set',
                            ],
                            expire: [
                                true,
                            ],
                        },
                    },
                    default: 60,
                    description: 'Number of seconds before key expiration',
                },
                // ----------------------------------
                //         publish
                // ----------------------------------
                {
                    displayName: 'Channel',
                    name: 'channel',
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
                    description: 'Channel name',
                },
                {
                    displayName: 'Data',
                    name: 'messageData',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'publish',
                            ],
                        },
                    },
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    required: true,
                    description: 'Data to publish',
                },
            ],
        };
    }
    execute() {
        // Parses the given value in a number if it is one else returns a string
        function getParsedValue(value) {
            if (value.match(/^[\d\.]+$/) === null) {
                // Is a string
                return value;
            }
            else {
                // Is a number
                return parseFloat(value);
            }
        }
        // Converts the Redis Info String into an object
        function convertInfoToObject(stringData) {
            const returnData = {};
            let key, value;
            for (const line of stringData.split('\n')) {
                if (['#', ''].includes(line.charAt(0))) {
                    continue;
                }
                [key, value] = line.split(':');
                if (key === undefined || value === undefined) {
                    continue;
                }
                value = value.trim();
                if (value.includes('=')) {
                    returnData[key] = {};
                    let key2, value2;
                    for (const keyValuePair of value.split(',')) {
                        [key2, value2] = keyValuePair.split('=');
                        returnData[key][key2] = getParsedValue(value2);
                    }
                }
                else {
                    returnData[key] = getParsedValue(value);
                }
            }
            return returnData;
        }
        function getValue(client, keyName, type) {
            return __awaiter(this, void 0, void 0, function* () {
                if (type === undefined || type === 'automatic') {
                    // Request the type first
                    const clientType = util_1.default.promisify(client.type).bind(client);
                    type = yield clientType(keyName);
                }
                if (type === 'string') {
                    const clientGet = util_1.default.promisify(client.get).bind(client);
                    return yield clientGet(keyName);
                }
                else if (type === 'hash') {
                    const clientHGetAll = util_1.default.promisify(client.hgetall).bind(client);
                    return yield clientHGetAll(keyName);
                }
                else if (type === 'list') {
                    const clientLRange = util_1.default.promisify(client.lrange).bind(client);
                    return yield clientLRange(keyName, 0, -1);
                }
                else if (type === 'sets') {
                    const clientSMembers = util_1.default.promisify(client.smembers).bind(client);
                    return yield clientSMembers(keyName);
                }
            });
        }
        const setValue = (client, keyName, value, expire, ttl, type) => __awaiter(this, void 0, void 0, function* () {
            if (type === undefined || type === 'automatic') {
                // Request the type first
                if (typeof value === 'string') {
                    type = 'string';
                }
                else if (Array.isArray(value)) {
                    type = 'list';
                }
                else if (typeof value === 'object') {
                    type = 'hash';
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not identify the type to set. Please set it manually!');
                }
            }
            if (type === 'string') {
                const clientSet = util_1.default.promisify(client.set).bind(client);
                yield clientSet(keyName, value.toString());
            }
            else if (type === 'hash') {
                const clientHset = util_1.default.promisify(client.hset).bind(client);
                for (const key of Object.keys(value)) {
                    // @ts-ignore
                    yield clientHset(keyName, key, value[key].toString());
                }
            }
            else if (type === 'list') {
                const clientLset = util_1.default.promisify(client.lset).bind(client);
                for (let index = 0; index < value.length; index++) {
                    yield clientLset(keyName, index, value[index].toString());
                }
            }
            if (expire === true) {
                const clientExpire = util_1.default.promisify(client.expire).bind(client);
                yield clientExpire(keyName, ttl);
            }
            return;
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // TODO: For array and object fields it should not have a "value" field it should
            //       have a parameter field for a path. Because it is not possible to set
            //       array, object via parameter directly (should maybe be possible?!?!)
            //       Should maybe have a parameter which is JSON.
            const credentials = yield this.getCredentials('redis');
            const redisOptions = {
                host: credentials.host,
                port: credentials.port,
                db: credentials.database,
            };
            if (credentials.password) {
                redisOptions.password = credentials.password;
            }
            const client = redis_1.default.createClient(redisOptions);
            const operation = this.getNodeParameter('operation', 0);
            client.on('error', (err) => {
                client.quit();
                reject(err);
            });
            client.on('ready', (err) => __awaiter(this, void 0, void 0, function* () {
                client.select(credentials.database);
                try {
                    if (operation === 'info') {
                        const clientInfo = util_1.default.promisify(client.info).bind(client);
                        const result = yield clientInfo();
                        resolve(this.prepareOutputData([{ json: convertInfoToObject(result) }]));
                        client.quit();
                    }
                    else if (['delete', 'get', 'keys', 'set', 'incr', 'publish'].includes(operation)) {
                        const items = this.getInputData();
                        const returnItems = [];
                        let item;
                        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                            item = { json: {} };
                            if (operation === 'delete') {
                                const keyDelete = this.getNodeParameter('key', itemIndex);
                                const clientDel = util_1.default.promisify(client.del).bind(client);
                                // @ts-ignore
                                yield clientDel(keyDelete);
                                returnItems.push(items[itemIndex]);
                            }
                            else if (operation === 'get') {
                                const propertyName = this.getNodeParameter('propertyName', itemIndex);
                                const keyGet = this.getNodeParameter('key', itemIndex);
                                const keyType = this.getNodeParameter('keyType', itemIndex);
                                const value = (yield getValue(client, keyGet, keyType)) || null;
                                const options = this.getNodeParameter('options', itemIndex, {});
                                if (options.dotNotation === false) {
                                    item.json[propertyName] = value;
                                }
                                else {
                                    (0, lodash_1.set)(item.json, propertyName, value);
                                }
                                returnItems.push(item);
                            }
                            else if (operation === 'keys') {
                                const keyPattern = this.getNodeParameter('keyPattern', itemIndex);
                                const clientKeys = util_1.default.promisify(client.keys).bind(client);
                                const keys = yield clientKeys(keyPattern);
                                const promises = {};
                                for (const keyName of keys) {
                                    promises[keyName] = yield getValue(client, keyName);
                                }
                                for (const keyName of keys) {
                                    item.json[keyName] = yield promises[keyName];
                                }
                                returnItems.push(item);
                            }
                            else if (operation === 'set') {
                                const keySet = this.getNodeParameter('key', itemIndex);
                                const value = this.getNodeParameter('value', itemIndex);
                                const keyType = this.getNodeParameter('keyType', itemIndex);
                                const expire = this.getNodeParameter('expire', itemIndex, false);
                                const ttl = this.getNodeParameter('ttl', itemIndex, -1);
                                yield setValue(client, keySet, value, expire, ttl, keyType);
                                returnItems.push(items[itemIndex]);
                            }
                            else if (operation === 'incr') {
                                const keyIncr = this.getNodeParameter('key', itemIndex);
                                const expire = this.getNodeParameter('expire', itemIndex, false);
                                const ttl = this.getNodeParameter('ttl', itemIndex, -1);
                                const clientIncr = util_1.default.promisify(client.incr).bind(client);
                                // @ts-ignore
                                const incrementVal = yield clientIncr(keyIncr);
                                if (expire === true && ttl > 0) {
                                    const clientExpire = util_1.default.promisify(client.expire).bind(client);
                                    yield clientExpire(keyIncr, ttl);
                                }
                                returnItems.push({ json: { [keyIncr]: incrementVal } });
                            }
                            else if (operation === 'publish') {
                                const channel = this.getNodeParameter('channel', itemIndex);
                                const messageData = this.getNodeParameter('messageData', itemIndex);
                                const clientPublish = util_1.default.promisify(client.publish).bind(client);
                                yield clientPublish(channel, messageData);
                                returnItems.push(items[itemIndex]);
                            }
                        }
                        client.quit();
                        resolve(this.prepareOutputData(returnItems));
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }));
    }
}
exports.Redis = Redis;
