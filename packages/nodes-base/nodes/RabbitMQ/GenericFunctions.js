"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MessageTracker = exports.rabbitmqConnectExchange = exports.rabbitmqConnectQueue = exports.rabbitmqConnect = void 0;
const amqplib = __importStar(require("amqplib"));
function rabbitmqConnect(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('rabbitmq');
        const credentialKeys = [
            'hostname',
            'port',
            'username',
            'password',
            'vhost',
        ];
        const credentialData = {};
        credentialKeys.forEach(key => {
            credentialData[key] = credentials[key] === '' ? undefined : credentials[key];
        });
        const optsData = {};
        if (credentials.ssl === true) {
            credentialData.protocol = 'amqps';
            optsData.ca = credentials.ca === '' ? undefined : [Buffer.from(credentials.ca)];
            if (credentials.passwordless === true) {
                optsData.cert = credentials.cert === '' ? undefined : Buffer.from(credentials.cert);
                optsData.key = credentials.key === '' ? undefined : Buffer.from(credentials.key);
                optsData.passphrase = credentials.passphrase === '' ? undefined : credentials.passphrase;
                optsData.credentials = amqplib.credentials.external();
            }
        }
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield amqplib.connect(credentialData, optsData);
                connection.on('error', (error) => {
                    reject(error);
                });
                const channel = yield connection.createChannel().catch(console.warn);
                if (options.arguments && options.arguments.argument.length) {
                    const additionalArguments = {};
                    options.arguments.argument.forEach((argument) => {
                        additionalArguments[argument.key] = argument.value;
                    });
                    options.arguments = additionalArguments;
                }
                resolve(channel);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.rabbitmqConnect = rabbitmqConnect;
function rabbitmqConnectQueue(queue, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield rabbitmqConnect.call(this, options);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield channel.assertQueue(queue, options);
                resolve(channel);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.rabbitmqConnectQueue = rabbitmqConnectQueue;
function rabbitmqConnectExchange(exchange, type, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield rabbitmqConnect.call(this, options);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield channel.assertExchange(exchange, type, options);
                resolve(channel);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.rabbitmqConnectExchange = rabbitmqConnectExchange;
class MessageTracker {
    constructor() {
        this.messages = [];
        this.isClosing = false;
    }
    received(message) {
        this.messages.push(message.fields.deliveryTag);
    }
    answered(message) {
        if (this.messages.length === 0) {
            return;
        }
        const index = this.messages.findIndex(value => value !== message.fields.deliveryTag);
        this.messages.splice(index);
    }
    unansweredMessages() {
        return this.messages.length;
    }
    closeChannel(channel, consumerTag) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClosing) {
                return;
            }
            this.isClosing = true;
            // Do not accept any new messages
            yield channel.cancel(consumerTag);
            let count = 0;
            let unansweredMessages = this.unansweredMessages();
            // Give currently executing messages max. 5 minutes to finish before
            // the channel gets closed. If we would not do that, it would not be possible
            // to acknowledge messages anymore for which the executions were already running
            // when for example a new version of the workflow got saved. That would lead to
            // them getting delivered and processed again.
            while (unansweredMessages !== 0 && count++ <= 300) {
                yield new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
                unansweredMessages = this.unansweredMessages();
            }
            yield channel.close();
            yield channel.connection.close();
        });
    }
}
exports.MessageTracker = MessageTracker;
