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
exports.Crypto = void 0;
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
class Crypto {
    constructor() {
        this.description = {
            displayName: 'Crypto',
            name: 'crypto',
            icon: 'fa:key',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["action"]}}',
            description: 'Provide cryptographic utilities',
            defaults: {
                name: 'Crypto',
                color: '#408000',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    options: [
                        {
                            name: 'Generate',
                            description: 'Generate random string',
                            value: 'generate',
                        },
                        {
                            name: 'Hash',
                            description: 'Hash a text in a specified format',
                            value: 'hash',
                        },
                        {
                            name: 'Hmac',
                            description: 'Hmac a text in a specified format',
                            value: 'hmac',
                        },
                        {
                            name: 'Sign',
                            description: 'Sign a string using a private key',
                            value: 'sign',
                        },
                    ],
                    default: 'hash',
                },
                {
                    displayName: 'Type',
                    name: 'type',
                    displayOptions: {
                        show: {
                            action: [
                                'hash',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'MD5',
                            value: 'MD5',
                        },
                        {
                            name: 'SHA256',
                            value: 'SHA256',
                        },
                        {
                            name: 'SHA384',
                            value: 'SHA384',
                        },
                        {
                            name: 'SHA512',
                            value: 'SHA512',
                        },
                    ],
                    default: 'MD5',
                    description: 'The hash type to use',
                    required: true,
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    displayOptions: {
                        show: {
                            action: [
                                'hash',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    description: 'The value that should be hashed',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'hash',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the hash',
                },
                {
                    displayName: 'Encoding',
                    name: 'encoding',
                    displayOptions: {
                        show: {
                            action: [
                                'hash',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'BASE64',
                            value: 'base64',
                        },
                        {
                            name: 'HEX',
                            value: 'hex',
                        },
                    ],
                    default: 'hex',
                    required: true,
                },
                {
                    displayName: 'Type',
                    name: 'type',
                    displayOptions: {
                        show: {
                            action: [
                                'hmac',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'MD5',
                            value: 'MD5',
                        },
                        {
                            name: 'SHA256',
                            value: 'SHA256',
                        },
                        {
                            name: 'SHA384',
                            value: 'SHA384',
                        },
                        {
                            name: 'SHA512',
                            value: 'SHA512',
                        },
                    ],
                    default: 'MD5',
                    description: 'The hash type to use',
                    required: true,
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    displayOptions: {
                        show: {
                            action: [
                                'hmac',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    description: 'The value of which the hmac should be created',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'hmac',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the hmac',
                },
                {
                    displayName: 'Secret',
                    name: 'secret',
                    displayOptions: {
                        show: {
                            action: [
                                'hmac',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Encoding',
                    name: 'encoding',
                    displayOptions: {
                        show: {
                            action: [
                                'hmac',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'BASE64',
                            value: 'base64',
                        },
                        {
                            name: 'HEX',
                            value: 'hex',
                        },
                    ],
                    default: 'hex',
                    required: true,
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    displayOptions: {
                        show: {
                            action: [
                                'sign',
                            ],
                        },
                    },
                    type: 'string',
                    default: '',
                    description: 'The value that should be signed',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'sign',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the signed value',
                },
                {
                    displayName: 'Algorithm Name or ID',
                    name: 'algorithm',
                    displayOptions: {
                        show: {
                            action: [
                                'sign',
                            ],
                        },
                    },
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getHashes',
                    },
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Encoding',
                    name: 'encoding',
                    displayOptions: {
                        show: {
                            action: [
                                'sign',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'BASE64',
                            value: 'base64',
                        },
                        {
                            name: 'HEX',
                            value: 'hex',
                        },
                    ],
                    default: 'hex',
                    required: true,
                },
                {
                    displayName: 'Private Key',
                    name: 'privateKey',
                    displayOptions: {
                        show: {
                            action: [
                                'sign',
                            ],
                        },
                    },
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    description: 'Private key to use when signing the string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: {
                            action: [
                                'generate',
                            ],
                        },
                    },
                    description: 'Name of the property to which to write the random string',
                },
                {
                    displayName: 'Type',
                    name: 'encodingType',
                    displayOptions: {
                        show: {
                            action: [
                                'generate',
                            ],
                        },
                    },
                    type: 'options',
                    options: [
                        {
                            name: 'ASCII',
                            value: 'ascii',
                        },
                        {
                            name: 'BASE64',
                            value: 'base64',
                        },
                        {
                            name: 'HEX',
                            value: 'hex',
                        },
                        {
                            name: 'UUID',
                            value: 'uuid',
                        },
                    ],
                    default: 'uuid',
                    description: 'Encoding that will be used to generate string',
                    required: true,
                },
                {
                    displayName: 'Length',
                    name: 'stringLength',
                    type: 'number',
                    default: 32,
                    description: 'Length of the generated string',
                    displayOptions: {
                        show: {
                            action: [
                                'generate',
                            ],
                            encodingType: [
                                'ascii',
                                'base64',
                                'hex',
                            ],
                        },
                    },
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the hashes to display them to user so that he can
                // select them easily
                getHashes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const hashes = (0, crypto_1.getHashes)();
                        for (const hash of hashes) {
                            const hashName = hash;
                            const hashId = hash;
                            returnData.push({
                                name: hashName,
                                value: hashId,
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
            const length = items.length;
            const action = this.getNodeParameter('action', 0);
            let item;
            for (let i = 0; i < length; i++) {
                try {
                    item = items[i];
                    const dataPropertyName = this.getNodeParameter('dataPropertyName', i);
                    const value = this.getNodeParameter('value', i, '');
                    let newValue;
                    if (action === 'generate') {
                        const encodingType = this.getNodeParameter('encodingType', i);
                        if (encodingType === 'uuid') {
                            newValue = (0, uuid_1.v4)();
                        }
                        else {
                            const stringLength = this.getNodeParameter('stringLength', i);
                            if (encodingType === 'base64') {
                                newValue = (0, crypto_1.randomBytes)(stringLength).toString(encodingType).replace(/\W/g, '').slice(0, stringLength);
                            }
                            else {
                                newValue = (0, crypto_1.randomBytes)(stringLength).toString(encodingType).slice(0, stringLength);
                            }
                        }
                    }
                    if (action === 'hash') {
                        const type = this.getNodeParameter('type', i);
                        const encoding = this.getNodeParameter('encoding', i);
                        newValue = (0, crypto_1.createHash)(type).update(value).digest(encoding);
                    }
                    if (action === 'hmac') {
                        const type = this.getNodeParameter('type', i);
                        const secret = this.getNodeParameter('secret', i);
                        const encoding = this.getNodeParameter('encoding', i);
                        newValue = (0, crypto_1.createHmac)(type, secret).update(value).digest(encoding);
                    }
                    if (action === 'sign') {
                        const algorithm = this.getNodeParameter('algorithm', i);
                        const encoding = this.getNodeParameter('encoding', i);
                        const privateKey = this.getNodeParameter('privateKey', i);
                        const sign = (0, crypto_1.createSign)(algorithm);
                        sign.write(value);
                        sign.end();
                        newValue = sign.sign(privateKey, encoding);
                    }
                    let newItem;
                    if (dataPropertyName.includes('.')) {
                        // Uses dot notation so copy all data
                        newItem = {
                            json: JSON.parse(JSON.stringify(item.json)),
                            pairedItem: {
                                item: i,
                            },
                        };
                    }
                    else {
                        // Does not use dot notation so shallow copy is enough
                        newItem = {
                            json: Object.assign({}, item.json),
                            pairedItem: {
                                item: i,
                            },
                        };
                    }
                    if (item.binary !== undefined) {
                        newItem.binary = item.binary;
                    }
                    (0, lodash_1.set)(newItem, `json.${dataPropertyName}`, newValue);
                    returnData.push(newItem);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.Crypto = Crypto;
