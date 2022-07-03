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
exports.AsanaTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
// import {
// 	createHmac,
// } from 'crypto';
class AsanaTrigger {
    constructor() {
        this.description = {
            displayName: 'Asana Trigger',
            name: 'asanaTrigger',
            icon: 'file:asana.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Asana events occur.',
            defaults: {
                name: 'Asana-Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'asanaApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'asanaOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
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
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The resource ID to subscribe to. The resource can be a task or project.',
                },
                {
                    displayName: 'Workspace Name or ID',
                    name: 'workspace',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getWorkspaces',
                    },
                    options: [],
                    default: '',
                    description: 'The workspace ID the resource is registered under. This is only required if you want to allow overriding existing webhooks. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available workspaces to display them to user so that he can
                // select them easily
                getWorkspaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const workspaces = yield GenericFunctions_1.getWorkspaces.call(this);
                        workspaces.unshift({
                            name: '',
                            value: '',
                        });
                        return workspaces;
                    });
                },
            },
        };
        // @ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const resource = this.getNodeParameter('resource');
                        const workspace = this.getNodeParameter('workspace');
                        const endpoint = '/webhooks';
                        const { data } = yield GenericFunctions_1.asanaApiRequest.call(this, 'GET', endpoint, {}, { workspace });
                        for (const webhook of data) {
                            if (webhook.resource.gid === resource && webhook.target === webhookUrl) {
                                webhookData.webhookId = webhook.gid;
                                return true;
                            }
                        }
                        // If it did not error then the webhook exists
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        if (webhookUrl.includes('%20')) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The name of the Asana Trigger Node is not allowed to contain any spaces!');
                        }
                        const resource = this.getNodeParameter('resource');
                        const endpoint = `/webhooks`;
                        const body = {
                            resource,
                            target: webhookUrl,
                        };
                        let responseData;
                        responseData = yield GenericFunctions_1.asanaApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.data === undefined || responseData.data.gid === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.data.gid;
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
                                yield GenericFunctions_1.asanaApiRequest.call(this, 'DELETE', endpoint, body);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                            delete webhookData.webhookEvents;
                            delete webhookData.hookSecret;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            const headerData = this.getHeaderData();
            const req = this.getRequestObject();
            const webhookData = this.getWorkflowStaticData('node');
            if (headerData['x-hook-secret'] !== undefined) {
                // Is a create webhook confirmation request
                webhookData.hookSecret = headerData['x-hook-secret'];
                const res = this.getResponseObject();
                res.set('X-Hook-Secret', webhookData.hookSecret);
                res.status(200).end();
                return {
                    noWebhookResponse: true,
                };
            }
            // Is regular webhook call
            // Check if it contains any events
            if (bodyData.events === undefined || !Array.isArray(bodyData.events) ||
                bodyData.events.length === 0) {
                // Does not contain any event data so nothing to process so no reason to
                // start the workflow
                return {};
            }
            // TODO: Had to be deactivated as it is currently not possible to get the secret
            //       in production mode as the static data overwrites each other because the
            //       two exist at the same time (create webhook [with webhookId] and receive
            //       webhook [with secret])
            // // Check if the request is valid
            // // (if the signature matches to data and hookSecret)
            // const computedSignature = createHmac('sha256', webhookData.hookSecret as string).update(JSON.stringify(req.body)).digest('hex');
            // if (headerData['x-hook-signature'] !== computedSignature) {
            // 	// Signature is not valid so ignore call
            // 	return {};
            // }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body.events),
                ],
            };
        });
    }
}
exports.AsanaTrigger = AsanaTrigger;
