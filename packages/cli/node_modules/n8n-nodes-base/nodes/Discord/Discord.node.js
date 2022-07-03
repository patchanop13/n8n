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
exports.Discord = void 0;
class Discord {
    constructor() {
        this.description = {
            displayName: 'Discord',
            name: 'discord',
            icon: 'file:discord.svg',
            group: ['output'],
            version: 1,
            description: 'Sends data to Discord',
            defaults: {
                name: 'Discord',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Webhook URL',
                    name: 'webhookUri',
                    type: 'string',
                    typeOptions: {
                        alwaysOpenEditWindow: true,
                    },
                    required: true,
                    default: '',
                    placeholder: 'https://discord.com/api/webhooks/ID/TOKEN',
                },
                {
                    displayName: 'Content',
                    name: 'text',
                    type: 'string',
                    typeOptions: {
                        maxValue: 2000,
                        alwaysOpenEditWindow: true,
                    },
                    default: '',
                    placeholder: 'Hello World!',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Allowed Mentions',
                            name: 'allowedMentions',
                            type: 'json',
                            typeOptions: { alwaysOpenEditWindow: true, editor: 'code' },
                            default: '',
                        },
                        {
                            displayName: 'Attachments',
                            name: 'attachments',
                            type: 'json',
                            typeOptions: { alwaysOpenEditWindow: true, editor: 'code' },
                            default: '',
                        },
                        {
                            displayName: 'Avatar URL',
                            name: 'avatarUrl',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Components',
                            name: 'components',
                            type: 'json',
                            typeOptions: { alwaysOpenEditWindow: true, editor: 'code' },
                            default: '',
                        },
                        {
                            displayName: 'Embeds',
                            name: 'embeds',
                            type: 'json',
                            typeOptions: { alwaysOpenEditWindow: true, editor: 'code' },
                            default: '',
                        },
                        {
                            displayName: 'Flags',
                            name: 'flags',
                            type: 'number',
                            default: '',
                        },
                        {
                            displayName: 'JSON Payload',
                            name: 'payloadJson',
                            type: 'json',
                            typeOptions: { alwaysOpenEditWindow: true, editor: 'code' },
                            default: '',
                        },
                        {
                            displayName: 'Username',
                            name: 'username',
                            type: 'string',
                            default: '',
                            placeholder: 'User',
                        },
                        {
                            displayName: 'TTS',
                            name: 'tts',
                            type: 'boolean',
                            default: false,
                            description: 'Whether this message be sent as a Text To Speech message',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const returnData = [];
            const webhookUri = this.getNodeParameter('webhookUri', 0, '');
            if (!webhookUri)
                throw Error('Webhook uri is required.');
            const items = this.getInputData();
            const length = items.length;
            for (let i = 0; i < length; i++) {
                const body = {};
                const webhookUri = this.getNodeParameter('webhookUri', i);
                body.content = this.getNodeParameter('text', i);
                const options = this.getNodeParameter('options', i);
                if (!body.content && !options.embeds) {
                    throw new Error('Either content or embeds must be set.');
                }
                if (options.embeds) {
                    try {
                        //@ts-expect-error
                        body.embeds = JSON.parse(options.embeds);
                        if (!Array.isArray(body.embeds)) {
                            throw new Error('Embeds must be an array of embeds.');
                        }
                    }
                    catch (e) {
                        throw new Error('Embeds must be valid JSON.');
                    }
                }
                if (options.username) {
                    body.username = options.username;
                }
                if (options.components) {
                    try {
                        //@ts-expect-error
                        body.components = JSON.parse(options.components);
                    }
                    catch (e) {
                        throw new Error('Components must be valid JSON.');
                    }
                }
                if (options.allowed_mentions) {
                    //@ts-expect-error
                    body.allowed_mentions = JSON.parse(options.allowed_mentions);
                }
                if (options.avatarUrl) {
                    body.avatar_url = options.avatarUrl;
                }
                if (options.flags) {
                    body.flags = options.flags;
                }
                if (options.tts) {
                    body.tts = options.tts;
                }
                if (options.payloadJson) {
                    //@ts-expect-error
                    body.payload_json = JSON.parse(options.payloadJson);
                }
                if (options.attachments) {
                    //@ts-expect-error
                    body.attachments = JSON.parse(options.attachments);
                }
                //* Not used props, delete them from the payload as Discord won't need them :^
                if (!body.content)
                    delete body.content;
                if (!body.username)
                    delete body.username;
                if (!body.avatar_url)
                    delete body.avatar_url;
                if (!body.embeds)
                    delete body.embeds;
                if (!body.allowed_mentions)
                    delete body.allowed_mentions;
                if (!body.flags)
                    delete body.flags;
                if (!body.components)
                    delete body.components;
                if (!body.payload_json)
                    delete body.payload_json;
                if (!body.attachments)
                    delete body.attachments;
                let requestOptions;
                if (!body.payload_json) {
                    requestOptions = {
                        resolveWithFullResponse: true,
                        method: 'POST',
                        body,
                        uri: webhookUri,
                        headers: {
                            'content-type': 'application/json; charset=utf-8',
                        },
                        json: true,
                    };
                }
                else {
                    requestOptions = {
                        resolveWithFullResponse: true,
                        method: 'POST',
                        body,
                        uri: webhookUri,
                        headers: {
                            'content-type': 'multipart/form-data; charset=utf-8',
                        },
                    };
                }
                let maxTries = 5;
                let response;
                do {
                    try {
                        response = yield this.helpers.request(requestOptions);
                        const resetAfter = response.headers['x-ratelimit-reset-after'] * 1000;
                        const remainingRatelimit = response.headers['x-ratelimit-remaining'];
                        // remaining requests 0
                        // https://discord.com/developers/docs/topics/rate-limits
                        if (!+remainingRatelimit) {
                            yield new Promise((resolve) => setTimeout(resolve, resetAfter || 1000));
                        }
                        break;
                    }
                    catch (error) {
                        // HTTP/1.1 429 TOO MANY REQUESTS
                        // Await when the current rate limit will reset
                        // https://discord.com/developers/docs/topics/rate-limits
                        if (error.statusCode === 429) {
                            const retryAfter = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.headers['retry-after']) || 1000;
                            yield new Promise((resolve) => setTimeout(resolve, +retryAfter));
                            continue;
                        }
                        throw error;
                    }
                } while (--maxTries);
                if (maxTries <= 0) {
                    throw new Error('Could not send Webhook message. Max amount of rate-limit retries reached.');
                }
                returnData.push({ success: true });
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Discord = Discord;
