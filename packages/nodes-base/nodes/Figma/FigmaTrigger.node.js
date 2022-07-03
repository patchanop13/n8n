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
exports.FigmaTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const change_case_1 = require("change-case");
const crypto_1 = require("crypto");
class FigmaTrigger {
    constructor() {
        this.description = {
            displayName: 'Figma Trigger (Beta)',
            name: 'figmaTrigger',
            icon: 'file:figma.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["triggerOn"]}}',
            description: 'Starts the workflow when Figma events occur',
            defaults: {
                name: 'Figma Trigger (Beta)',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'figmaApi',
                    required: true,
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
                    displayName: 'Team ID',
                    name: 'teamId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Trigger will monitor this Figma Team for changes. Team ID can be found in the URL of a Figma Team page when viewed in a web browser: figma.com/files/team/{TEAM-ID}/.',
                },
                {
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    options: [
                        {
                            name: 'File Commented',
                            value: 'fileComment',
                            description: 'Triggers when someone comments on a file',
                        },
                        {
                            name: 'File Deleted',
                            value: 'fileDelete',
                            description: 'Triggers whenever a file has been deleted. Does not trigger on all files within a folder, if the folder is deleted.',
                        },
                        {
                            name: 'File Updated',
                            value: 'fileUpdate',
                            description: 'Triggers whenever a file saves or is deleted. This occurs whenever a file is closed or within 30 seconds after changes have been made.',
                        },
                        {
                            name: 'File Version Updated',
                            value: 'fileVersionUpdate',
                            description: 'Triggers whenever a named version is created in the version history of a file',
                        },
                        {
                            name: 'Library Publish',
                            value: 'libraryPublish',
                            description: 'Triggers whenever a library file is published',
                        },
                    ],
                    default: '',
                    required: true,
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
                        const teamId = this.getNodeParameter('teamId');
                        const triggerOn = this.getNodeParameter('triggerOn');
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const { webhooks } = yield GenericFunctions_1.figmaApiRequest.call(this, 'GET', `/v2/teams/${teamId}/webhooks`);
                        for (const webhook of webhooks) {
                            if (webhook.endpoint === webhookUrl
                                && webhook.team_id === teamId
                                && webhook.event_type === (0, change_case_1.snakeCase)(triggerOn).toUpperCase()
                                && webhook.status === 'ACTIVE') {
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const triggerOn = this.getNodeParameter('triggerOn');
                        const teamId = this.getNodeParameter('teamId');
                        const endpoint = '/v2/webhooks';
                        const body = {
                            event_type: (0, change_case_1.snakeCase)(triggerOn).toUpperCase(),
                            team_id: teamId,
                            description: `n8n-webhook:${webhookUrl}`,
                            endpoint: webhookUrl,
                            passcode: (0, crypto_1.randomBytes)(10).toString('hex'),
                        };
                        const responseData = yield GenericFunctions_1.figmaApiRequest.call(this, 'POST', endpoint, body);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const endpoint = `/v2/webhooks/${webhookData.webhookId}`;
                            try {
                                yield GenericFunctions_1.figmaApiRequest.call(this, 'DELETE', endpoint);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
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
            if (bodyData.event_type === 'PING') {
                const res = this.getResponseObject();
                res.status(200).end();
                return {
                    noWebhookResponse: true,
                };
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.FigmaTrigger = FigmaTrigger;
