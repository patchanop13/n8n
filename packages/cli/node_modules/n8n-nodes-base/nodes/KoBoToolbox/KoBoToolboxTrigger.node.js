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
exports.KoBoToolboxTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const Options_1 = require("./Options");
class KoBoToolboxTrigger {
    constructor() {
        this.description = {
            displayName: 'KoBoToolbox Trigger',
            name: 'koBoToolboxTrigger',
            icon: 'file:koBoToolbox.svg',
            group: ['trigger'],
            version: 1,
            description: 'Process KoBoToolbox submissions',
            defaults: {
                name: 'KoBoToolbox Trigger',
                color: '#64C0FF',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'koBoToolboxApi',
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
                    displayName: 'Form Name or ID',
                    name: 'formId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'loadForms',
                    },
                    required: true,
                    default: '',
                    description: 'Form ID (e.g. aSAvYreNzVEkrWg5Gdcvg). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    required: true,
                    default: 'formSubmission',
                    options: [
                        {
                            name: 'On Form Submission',
                            value: 'formSubmission',
                        },
                    ],
                },
                Object.assign({}, Options_1.options),
            ],
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const formId = this.getNodeParameter('formId'); //tslint:disable-line:variable-name
                        const webhooks = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            url: `/api/v2/assets/${formId}/hooks/`,
                        });
                        for (const webhook of webhooks || []) {
                            if (webhook.endpoint === webhookUrl && webhook.active === true) {
                                webhookData.webhookId = webhook.uid;
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
                        const workflow = this.getWorkflow();
                        const formId = this.getNodeParameter('formId'); //tslint:disable-line:variable-name
                        const response = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            method: 'POST',
                            url: `/api/v2/assets/${formId}/hooks/`,
                            body: {
                                name: `n8n webhook id ${workflow.id}: ${workflow.name}`,
                                endpoint: webhookUrl,
                                email_notification: true,
                            },
                        });
                        if (response.uid) {
                            webhookData.webhookId = response.uid;
                            return true;
                        }
                        return false;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const formId = this.getNodeParameter('formId'); //tslint:disable-line:variable-name
                        try {
                            yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                method: 'DELETE',
                                url: `/api/v2/assets/${formId}/hooks/${webhookData.webhookId}`,
                            });
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
        this.methods = {
            loadOptions: {
                loadForms: GenericFunctions_1.loadForms,
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const formatOptions = this.getNodeParameter('formatOptions');
            const responseData = formatOptions.reformat
                ? (0, GenericFunctions_1.formatSubmission)(req.body, (0, GenericFunctions_1.parseStringList)(formatOptions.selectMask), (0, GenericFunctions_1.parseStringList)(formatOptions.numberMask))
                : req.body;
            if (formatOptions.download) {
                // Download related attachments
                return {
                    workflowData: [
                        [yield GenericFunctions_1.downloadAttachments.call(this, responseData, formatOptions)],
                    ],
                };
            }
            else {
                return {
                    workflowData: [
                        this.helpers.returnJsonArray([responseData]),
                    ],
                };
            }
        });
    }
}
exports.KoBoToolboxTrigger = KoBoToolboxTrigger;
