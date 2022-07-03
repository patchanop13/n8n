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
exports.PipedriveTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const basic_auth_1 = __importDefault(require("basic-auth"));
function authorizationError(resp, realm, responseCode, message) {
    if (message === undefined) {
        message = 'Authorization problem!';
        if (responseCode === 401) {
            message = 'Authorization is required!';
        }
        else if (responseCode === 403) {
            message = 'Authorization data is wrong!';
        }
    }
    resp.writeHead(responseCode, { 'WWW-Authenticate': `Basic realm="${realm}"` });
    resp.end(message);
    return {
        noWebhookResponse: true,
    };
}
class PipedriveTrigger {
    constructor() {
        this.description = {
            displayName: 'Pipedrive Trigger',
            name: 'pipedriveTrigger',
            icon: 'file:pipedrive.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Pipedrive events occur',
            defaults: {
                name: 'Pipedrive Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'pipedriveApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'apiToken',
                            ],
                        },
                    },
                },
                {
                    name: 'pipedriveOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
                {
                    name: 'httpBasicAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            incomingAuthentication: [
                                'basicAuth',
                            ],
                        },
                    },
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'API Token',
                            value: 'apiToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'apiToken',
                },
                {
                    displayName: 'Incoming Authentication',
                    name: 'incomingAuthentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Basic Auth',
                            value: 'basicAuth',
                        },
                        {
                            name: 'None',
                            value: 'none',
                        },
                    ],
                    default: 'none',
                    description: 'If authentication should be activated for the webhook (makes it more secure)',
                },
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    options: [
                        {
                            name: 'Added',
                            value: 'added',
                            description: 'Data got added',
                        },
                        {
                            name: 'All',
                            value: '*',
                            description: 'Any change',
                        },
                        {
                            name: 'Deleted',
                            value: 'deleted',
                            description: 'Data got deleted',
                        },
                        {
                            name: 'Merged',
                            value: 'merged',
                            description: 'Data got merged',
                        },
                        {
                            name: 'Updated',
                            value: 'updated',
                            description: 'Data got updated',
                        },
                    ],
                    default: '*',
                    description: 'Type of action to receive notifications about',
                },
                {
                    displayName: 'Object',
                    name: 'object',
                    type: 'options',
                    options: [
                        {
                            name: 'Activity',
                            value: 'activity',
                        },
                        {
                            name: 'Activity Type',
                            value: 'activityType',
                        },
                        {
                            name: 'All',
                            value: '*',
                        },
                        {
                            name: 'Deal',
                            value: 'deal',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                        {
                            name: 'Organization',
                            value: 'organization',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                        },
                        {
                            name: 'Pipeline',
                            value: 'pipeline',
                        },
                        {
                            name: 'Product',
                            value: 'product',
                        },
                        {
                            name: 'Stage',
                            value: 'stage',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: '*',
                    description: 'Type of object to receive notifications about',
                },
            ],
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const eventAction = this.getNodeParameter('action');
                        const eventObject = this.getNodeParameter('object');
                        // Webhook got created before so check if it still exists
                        const endpoint = `/webhooks`;
                        const responseData = yield GenericFunctions_1.pipedriveApiRequest.call(this, 'GET', endpoint, {});
                        if (responseData.data === undefined) {
                            return false;
                        }
                        for (const existingData of responseData.data) {
                            if (existingData.subscription_url === webhookUrl
                                && existingData.event_action === eventAction
                                && existingData.event_object === eventObject) {
                                // The webhook exists already
                                webhookData.webhookId = existingData.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const incomingAuthentication = this.getNodeParameter('incomingAuthentication', 0);
                        const eventAction = this.getNodeParameter('action');
                        const eventObject = this.getNodeParameter('object');
                        const endpoint = `/webhooks`;
                        const body = {
                            event_action: eventAction,
                            event_object: eventObject,
                            subscription_url: webhookUrl,
                            http_auth_user: undefined,
                            http_auth_password: undefined,
                        };
                        if (incomingAuthentication === 'basicAuth') {
                            let httpBasicAuth;
                            try {
                                httpBasicAuth = yield this.getCredentials('httpBasicAuth');
                            }
                            catch (error) {
                                // Do nothing
                            }
                            if (httpBasicAuth === undefined || !httpBasicAuth.user || !httpBasicAuth.password) {
                                // Data is not defined on node so can not authenticate
                                return false;
                            }
                            body.http_auth_user = httpBasicAuth.user;
                            body.http_auth_password = httpBasicAuth.password;
                        }
                        const responseData = yield GenericFunctions_1.pipedriveApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.data === undefined || responseData.data.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = responseData.data.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/webhooks/${webhookData.webhookId}`;
                            const body = {};
                            try {
                                yield GenericFunctions_1.pipedriveApiRequest.call(this, 'DELETE', endpoint, body);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                            delete webhookData.webhookEvents;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const resp = this.getResponseObject();
            const realm = 'Webhook';
            const incomingAuthentication = this.getNodeParameter('incomingAuthentication', 0);
            if (incomingAuthentication === 'basicAuth') {
                // Basic authorization is needed to call webhook
                let httpBasicAuth;
                try {
                    httpBasicAuth = yield this.getCredentials('httpBasicAuth');
                }
                catch (error) {
                    // Do nothing
                }
                if (httpBasicAuth === undefined || !httpBasicAuth.user || !httpBasicAuth.password) {
                    // Data is not defined on node so can not authenticate
                    return authorizationError(resp, realm, 500, 'No authentication data defined on node!');
                }
                const basicAuthData = (0, basic_auth_1.default)(req);
                if (basicAuthData === undefined) {
                    // Authorization data is missing
                    return authorizationError(resp, realm, 401);
                }
                if (basicAuthData.name !== httpBasicAuth.user || basicAuthData.pass !== httpBasicAuth.password) {
                    // Provided authentication data is wrong
                    return authorizationError(resp, realm, 403);
                }
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.PipedriveTrigger = PipedriveTrigger;
