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
exports.parseRawEmail = exports.EmailReadImap = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const imap_simple_1 = require("imap-simple");
const mailparser_1 = require("mailparser");
const lodash_1 = __importDefault(require("lodash"));
class EmailReadImap {
    constructor() {
        this.description = {
            displayName: 'EmailReadImap',
            name: 'emailReadImap',
            icon: 'fa:inbox',
            group: ['trigger'],
            version: 1,
            description: 'Triggers the workflow when a new email is received',
            eventTriggerDescription: 'Waiting for you to receive an email',
            defaults: {
                name: 'IMAP Email',
                color: '#44AA22',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'imap',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Mailbox Name',
                    name: 'mailbox',
                    type: 'string',
                    default: 'INBOX',
                },
                {
                    displayName: 'Action',
                    name: 'postProcessAction',
                    type: 'options',
                    options: [
                        {
                            name: 'Mark as Read',
                            value: 'read',
                        },
                        {
                            name: 'Nothing',
                            value: 'nothing',
                        },
                    ],
                    default: 'read',
                    description: 'What to do after the email has been received. If "nothing" gets selected it will be processed multiple times.',
                },
                {
                    displayName: 'Download Attachments',
                    name: 'downloadAttachments',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            format: [
                                'simple',
                            ],
                        },
                    },
                    description: 'Whether attachments of emails should be downloaded. Only set if needed as it increases processing.',
                },
                {
                    displayName: 'Format',
                    name: 'format',
                    type: 'options',
                    options: [
                        {
                            name: 'RAW',
                            value: 'raw',
                            description: 'Returns the full email message data with body content in the raw field as a base64url encoded string; the payload field is not used',
                        },
                        {
                            name: 'Resolved',
                            value: 'resolved',
                            description: 'Returns the full email with all data resolved and attachments saved as binary data',
                        },
                        {
                            name: 'Simple',
                            value: 'simple',
                            description: 'Returns the full email; do not use if you wish to gather inline attachments',
                        },
                    ],
                    default: 'simple',
                    description: 'The format to return the message in',
                },
                {
                    displayName: 'Property Prefix Name',
                    name: 'dataPropertyAttachmentsPrefixName',
                    type: 'string',
                    default: 'attachment_',
                    displayOptions: {
                        show: {
                            format: [
                                'resolved',
                            ],
                        },
                    },
                    description: 'Prefix for name of the binary property to which to write the attachments. An index starting with 0 will be added. So if name is "attachment_" the first attachment is saved to "attachment_0"',
                },
                {
                    displayName: 'Property Prefix Name',
                    name: 'dataPropertyAttachmentsPrefixName',
                    type: 'string',
                    default: 'attachment_',
                    displayOptions: {
                        show: {
                            format: [
                                'simple',
                            ],
                            downloadAttachments: [
                                true,
                            ],
                        },
                    },
                    description: 'Prefix for name of the binary property to which to write the attachments. An index starting with 0 will be added. So if name is "attachment_" the first attachment is saved to "attachment_0"',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Custom Email Rules',
                            name: 'customEmailConfig',
                            type: 'string',
                            default: '["UNSEEN"]',
                            description: 'Custom email fetching rules. See <a href="https://github.com/mscdex/node-imap">node-imap</a>\'s search function for more details.',
                        },
                        {
                            displayName: 'Ignore SSL Issues',
                            name: 'allowUnauthorizedCerts',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to connect even if SSL certificate validation is not possible',
                        },
                        {
                            displayName: 'Force Reconnect',
                            name: 'forceReconnect',
                            type: 'number',
                            default: 60,
                            description: 'Sets an interval (in minutes) to force a reconnection',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('imap');
            const mailbox = this.getNodeParameter('mailbox');
            const postProcessAction = this.getNodeParameter('postProcessAction');
            const options = this.getNodeParameter('options', {});
            const staticData = this.getWorkflowStaticData('node');
            n8n_workflow_1.LoggerProxy.debug('Loaded static data for node "EmailReadImap"', { staticData });
            let connection;
            // Returns the email text
            const getText = (parts, message, subtype) => __awaiter(this, void 0, void 0, function* () {
                if (!message.attributes.struct) {
                    return '';
                }
                const textParts = parts.filter((part) => {
                    return part.type.toUpperCase() === 'TEXT' && part.subtype.toUpperCase() === subtype.toUpperCase();
                });
                if (textParts.length === 0) {
                    return '';
                }
                try {
                    return yield connection.getPartData(message, textParts[0]);
                }
                catch (_a) {
                    return '';
                }
            });
            // Returns the email attachments
            const getAttachment = (connection, parts, message) => __awaiter(this, void 0, void 0, function* () {
                if (!message.attributes.struct) {
                    return [];
                }
                // Check if the message has attachments and if so get them
                const attachmentParts = parts.filter((part) => {
                    return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
                });
                const attachmentPromises = [];
                let attachmentPromise;
                for (const attachmentPart of attachmentParts) {
                    attachmentPromise = connection.getPartData(message, attachmentPart)
                        .then((partData) => {
                        // Return it in the format n8n expects
                        return this.helpers.prepareBinaryData(partData, attachmentPart.disposition.params.filename);
                    });
                    attachmentPromises.push(attachmentPromise);
                }
                return Promise.all(attachmentPromises);
            });
            // Returns all the new unseen messages
            const getNewEmails = (connection, searchCriteria) => __awaiter(this, void 0, void 0, function* () {
                const format = this.getNodeParameter('format', 0);
                let fetchOptions = {};
                if (format === 'simple' || format === 'raw') {
                    fetchOptions = {
                        bodies: ['TEXT', 'HEADER'],
                        markSeen: postProcessAction === 'read',
                        struct: true,
                    };
                }
                else if (format === 'resolved') {
                    fetchOptions = {
                        bodies: [''],
                        markSeen: postProcessAction === 'read',
                        struct: true,
                    };
                }
                const results = yield connection.search(searchCriteria, fetchOptions);
                const newEmails = [];
                let newEmail, messageHeader, messageBody;
                let attachments;
                let propertyName;
                // All properties get by default moved to metadata except the ones
                // which are defined here which get set on the top level.
                const topLevelProperties = [
                    'cc',
                    'date',
                    'from',
                    'subject',
                    'to',
                ];
                if (format === 'resolved') {
                    const dataPropertyAttachmentsPrefixName = this.getNodeParameter('dataPropertyAttachmentsPrefixName');
                    for (const message of results) {
                        if (staticData.lastMessageUid !== undefined && message.attributes.uid <= staticData.lastMessageUid) {
                            continue;
                        }
                        if (staticData.lastMessageUid === undefined || staticData.lastMessageUid < message.attributes.uid) {
                            staticData.lastMessageUid = message.attributes.uid;
                        }
                        const part = lodash_1.default.find(message.parts, { which: '' });
                        if (part === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Email part could not be parsed.');
                        }
                        const parsedEmail = yield parseRawEmail.call(this, part.body, dataPropertyAttachmentsPrefixName);
                        newEmails.push(parsedEmail);
                    }
                }
                else if (format === 'simple') {
                    const downloadAttachments = this.getNodeParameter('downloadAttachments');
                    let dataPropertyAttachmentsPrefixName = '';
                    if (downloadAttachments === true) {
                        dataPropertyAttachmentsPrefixName = this.getNodeParameter('dataPropertyAttachmentsPrefixName');
                    }
                    for (const message of results) {
                        if (staticData.lastMessageUid !== undefined && message.attributes.uid <= staticData.lastMessageUid) {
                            continue;
                        }
                        if (staticData.lastMessageUid === undefined || staticData.lastMessageUid < message.attributes.uid) {
                            staticData.lastMessageUid = message.attributes.uid;
                        }
                        const parts = (0, imap_simple_1.getParts)(message.attributes.struct);
                        newEmail = {
                            json: {
                                textHtml: yield getText(parts, message, 'html'),
                                textPlain: yield getText(parts, message, 'plain'),
                                metadata: {},
                            },
                        };
                        messageHeader = message.parts.filter((part) => {
                            return part.which === 'HEADER';
                        });
                        messageBody = messageHeader[0].body;
                        for (propertyName of Object.keys(messageBody)) {
                            if (messageBody[propertyName].length) {
                                if (topLevelProperties.includes(propertyName)) {
                                    newEmail.json[propertyName] = messageBody[propertyName][0];
                                }
                                else {
                                    newEmail.json.metadata[propertyName] = messageBody[propertyName][0];
                                }
                            }
                        }
                        if (downloadAttachments === true) {
                            // Get attachments and add them if any get found
                            attachments = yield getAttachment(connection, parts, message);
                            if (attachments.length) {
                                newEmail.binary = {};
                                for (let i = 0; i < attachments.length; i++) {
                                    newEmail.binary[`${dataPropertyAttachmentsPrefixName}${i}`] = attachments[i];
                                }
                            }
                        }
                        newEmails.push(newEmail);
                    }
                }
                else if (format === 'raw') {
                    for (const message of results) {
                        if (staticData.lastMessageUid !== undefined && message.attributes.uid <= staticData.lastMessageUid) {
                            continue;
                        }
                        if (staticData.lastMessageUid === undefined || staticData.lastMessageUid < message.attributes.uid) {
                            staticData.lastMessageUid = message.attributes.uid;
                        }
                        const part = lodash_1.default.find(message.parts, { which: 'TEXT' });
                        if (part === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Email part could not be parsed.');
                        }
                        // Return base64 string
                        newEmail = {
                            json: {
                                raw: part.body,
                            },
                        };
                        newEmails.push(newEmail);
                    }
                }
                return newEmails;
            });
            const returnedPromise = yield (0, n8n_workflow_1.createDeferredPromise)();
            const establishConnection = () => {
                let searchCriteria = [
                    'UNSEEN',
                ];
                if (options.customEmailConfig !== undefined) {
                    try {
                        searchCriteria = JSON.parse(options.customEmailConfig);
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Custom email config is not valid JSON.`);
                    }
                }
                const config = {
                    imap: {
                        user: credentials.user,
                        password: credentials.password,
                        host: credentials.host,
                        port: credentials.port,
                        tls: credentials.secure,
                        authTimeout: 20000,
                    },
                    onmail: () => __awaiter(this, void 0, void 0, function* () {
                        if (connection) {
                            if (staticData.lastMessageUid !== undefined) {
                                searchCriteria.push(['UID', `${staticData.lastMessageUid}:*`]);
                                /**
                                 * A short explanation about UIDs and how they work
                                 * can be found here: https://dev.to/kehers/imap-new-messages-since-last-check-44gm
                                 * TL;DR:
                                 * - You cannot filter using ['UID', 'CURRENT ID + 1:*'] because IMAP
                                 * won't return correct results if current id + 1 does not yet exist.
                                 * - UIDs can change but this is not being treated here.
                                 * If the mailbox is recreated (lets say you remove all emails, remove
                                 * the mail box and create another with same name, UIDs will change)
                                 * - You can check if UIDs changed in the above example
                                 * by checking UIDValidity.
                                 */
                                n8n_workflow_1.LoggerProxy.debug('Querying for new messages on node "EmailReadImap"', { searchCriteria });
                            }
                            try {
                                const returnData = yield getNewEmails(connection, searchCriteria);
                                if (returnData.length) {
                                    this.emit([returnData]);
                                }
                            }
                            catch (error) {
                                n8n_workflow_1.LoggerProxy.error('Email Read Imap node encountered an error fetching new emails', { error });
                                // Wait with resolving till the returnedPromise got resolved, else n8n will be unhappy
                                // if it receives an error before the workflow got activated
                                returnedPromise.promise().then(() => {
                                    this.emitError(error);
                                });
                            }
                        }
                    }),
                };
                if (options.allowUnauthorizedCerts === true) {
                    config.imap.tlsOptions = {
                        rejectUnauthorized: false,
                    };
                }
                // Connect to the IMAP server and open the mailbox
                // that we get informed whenever a new email arrives
                return (0, imap_simple_1.connect)(config).then((conn) => __awaiter(this, void 0, void 0, function* () {
                    conn.on('error', (error) => __awaiter(this, void 0, void 0, function* () {
                        const errorCode = error.code.toUpperCase();
                        if (['ECONNRESET', 'EPIPE'].includes(errorCode)) {
                            n8n_workflow_1.LoggerProxy.verbose(`IMAP connection was reset (${errorCode}) - reconnecting.`, { error });
                            try {
                                connection = yield establishConnection();
                                yield connection.openBox(mailbox);
                                return;
                            }
                            catch (e) {
                                n8n_workflow_1.LoggerProxy.error('IMAP reconnect did fail', { error: e });
                                // If something goes wrong we want to run emitError
                            }
                        }
                        else {
                            n8n_workflow_1.LoggerProxy.error('Email Read Imap node encountered a connection error', { error });
                        }
                        this.emitError(error);
                    }));
                    return conn;
                }));
            };
            connection = yield establishConnection();
            yield connection.openBox(mailbox);
            let reconnectionInterval;
            if (options.forceReconnect !== undefined) {
                reconnectionInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    n8n_workflow_1.LoggerProxy.verbose('Forcing reconnection of IMAP node.');
                    yield connection.end();
                    connection = yield establishConnection();
                    yield connection.openBox(mailbox);
                }), options.forceReconnect * 1000 * 60);
            }
            // When workflow and so node gets set to inactive close the connectoin
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (reconnectionInterval) {
                        clearInterval(reconnectionInterval);
                    }
                    yield connection.end();
                });
            }
            // Resolve returned-promise so that waiting errors can be emitted
            returnedPromise.resolve();
            return {
                closeFunction,
            };
        });
    }
}
exports.EmailReadImap = EmailReadImap;
function parseRawEmail(messageEncoded, dataPropertyNameDownload) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield (0, mailparser_1.simpleParser)(messageEncoded);
        const headers = {};
        for (const header of responseData.headerLines) {
            headers[header.key] = header.line;
        }
        // @ts-ignore
        responseData.headers = headers;
        // @ts-ignore
        responseData.headerLines = undefined;
        const binaryData = {};
        if (responseData.attachments) {
            for (let i = 0; i < responseData.attachments.length; i++) {
                const attachment = responseData.attachments[i];
                binaryData[`${dataPropertyNameDownload}${i}`] = yield this.helpers.prepareBinaryData(attachment.content, attachment.filename, attachment.contentType);
            }
            // @ts-ignore
            responseData.attachments = undefined;
        }
        return {
            json: responseData,
            binary: Object.keys(binaryData).length ? binaryData : undefined,
        };
    });
}
exports.parseRawEmail = parseRawEmail;
